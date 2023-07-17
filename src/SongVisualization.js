import React, { useEffect, useRef } from 'react';

function SongVisualization({ audioLogic, time}) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const audioBuffer = audioLogic.audioBufferLeft.buffer;

        const draw = () => {
            const width = canvas.width;
            const height = canvas.height;

            const bufferLength = audioBuffer.length;

            const barCount = Math.ceil(width / 2); // Reduce the number of bars for better performance
            const barWidth = Math.ceil(width / barCount);
            const barSpacing = 1;

            context.clearRect(0, 0, width, height);

            let sum = 0;
            let average = 0;
            let barHeight = 0;

            for (let i = 0; i < barCount; i++) {
                const dataIndex = Math.floor((i / barCount) * bufferLength);

                // Calculate the average of the surrounding data points
                sum = 0;
                for (let j = dataIndex; j < dataIndex + barWidth; j++) {
                    sum += Math.abs(audioBuffer.getChannelData(0)[j]); // Assuming mono audio
                }
                average = sum / barWidth;
                barHeight = average * height;

                // Set bar color
                context.fillStyle = `rgb(255, 255, 255)`;

                // Draw the bar
                context.fillRect(
                    i * (barWidth + barSpacing),
                    height - barHeight,
                    barWidth,
                    barHeight
                );
            }

            setInterval(function() {
                // Code to be executed every second
                console.log(time);
            }, 1000);

            // Draw red vertical line
            const lineX = Math.floor(width / 4);
            context.beginPath();
            context.strokeStyle = 'red';
            context.lineWidth = 2;
            context.moveTo(lineX, 0);
            context.lineTo(lineX, height);
            context.stroke();
        };

        draw();
    }, [audioLogic.audioBufferLeft.buffer]);


    return <canvas ref={canvasRef} />;
}

export default SongVisualization;

