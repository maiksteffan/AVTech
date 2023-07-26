import React, { useEffect, useRef } from 'react';

/**
 * Component for the visualization of a song
 * @param {*} audioLogic The audioLogic object
 * @param {*} time The current time of the song
 * @param {*} channel The channel of the song (left or right)
 */
function SongVisualization({ audioLogic, time, channel}) {
    const canvasRef = useRef(null);
    const audioBuffer = audioLogic.getAudioBuffer(channel);

    /**
     * useEffect hook that draws the visualization of the song every time the time changes
     */
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        //set canvas size
        canvas.width = 300;
        canvas.height = 70;

        //draw the visualization on the canvas
        const draw = () => {
            const width = canvas.width;
            const height = canvas.height;
            const midHeight = height / 2;
            const redLineX = Math.floor(width / 2);

            const bufferLength = audioBuffer.length;

            const barCount = width;
            const barWidth = Math.ceil(width / barCount);
            const barSpacing = 1;

            context.clearRect(0, 0, width, height);

            let sum = 0;
            let average = 0;
            let barHeight = 0;

            // Draw the bars onto the canvas
            for (let i = 0; i < barCount; i++) {
                const relativeIndex = i - Math.floor(barCount / 2);
                const dataIndex = Math.floor((time + relativeIndex) * bufferLength / width) % bufferLength;

                sum = 0;
                for (let j = dataIndex; j < dataIndex + barWidth; j++) {
                    sum += Math.abs(audioBuffer.getChannelData(0)[j % bufferLength]); 
                }
                average = sum / barWidth;
                barHeight = average * midHeight; 

                context.fillStyle = `rgb(117, 251,253)`;

                const barX = redLineX + (relativeIndex * (barWidth + barSpacing));
                context.fillRect(
                    barX,
                    midHeight - (barHeight / 2),
                    barWidth,
                    barHeight
                );
            }

            //Drawing of the red line in the middle of the canvas
            context.beginPath();
            context.strokeStyle = 'red';
            context.lineWidth = 1;
            context.moveTo(redLineX, 0);
            context.lineTo(redLineX, height);
            context.stroke();
        };

        draw();
    }, [time, audioBuffer]);

    return <canvas className='border border-gray-700 ' ref={canvasRef} />;
}

export default SongVisualization;