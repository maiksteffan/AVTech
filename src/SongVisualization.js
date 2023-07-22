import React, { useEffect, useRef } from 'react';

function SongVisualization({ audioLogic, time, channel}) {
    const canvasRef = useRef(null);
    const audioBuffer = audioLogic.getAudioBuffer(channel);

    useEffect(() => {
        console.log(time);
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        //set canvas size
        canvas.width = 300;
        canvas.height = 70;

        const draw = () => {
            const width = canvas.width;
            const height = canvas.height;
            const midHeight = height / 2;  // Mid-point of the height

            const bufferLength = audioBuffer.length;

            const barCount = Math.ceil(width / 2); // Reduce the number of bars for better performance
            const barWidth = Math.ceil(width / barCount);
            const barSpacing = 1;

            context.clearRect(0, 0, width, height);

            let sum = 0;
            let average = 0;
            let barHeight = 0;

            for (let i = 0; i < barCount; i++) {
                // calculate data index based on time
                const dataIndex = Math.floor((time + (i - barCount / 2)) * bufferLength / width) % bufferLength;
                
                // Calculate the average of the surrounding data points
                sum = 0;
                for (let j = dataIndex; j < dataIndex + barWidth; j++) {
                    sum += Math.abs(audioBuffer.getChannelData(0)[j % bufferLength]); // Assuming mono audio
                }
                average = sum / barWidth;
                barHeight = average * midHeight;  // Adjusting bar height to half
            
                // Set bar color
                context.fillStyle = `rgb(54, 57,70)`;
            
                // Draw the bar equally up and down from the middle
                context.fillRect(
                    i * (barWidth + barSpacing),
                    midHeight - (barHeight / 2),
                    barWidth,
                    barHeight
                );
            }

            // Draw red vertical line
            const lineX = Math.floor(width / 2);
            context.beginPath();
            context.strokeStyle = 'red';
            context.lineWidth = 2;
            context.moveTo(lineX, 0);
            context.lineTo(lineX, height);
            context.stroke();
        };

        draw();
    }, [time, audioBuffer]);

    return <canvas className='border border-gray-700 ' ref={canvasRef} />;
}

export default SongVisualization;