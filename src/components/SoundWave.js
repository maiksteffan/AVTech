import React, { useEffect, useRef } from 'react';

/**
 * Component for drawing the soundwave of an audio buffer
 * @param {*} analyserNode the analyserNode of the audio buffer
 */
function SoundWave({ analyserNode }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const canvasContext = canvas.getContext('2d');
        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            canvasContext.clearRect(0, 0, canvas.width, canvas.height);

            // Get the current frequency data
            analyserNode.getByteTimeDomainData(dataArray);

            // Set up the canvas properties
            canvasContext.lineWidth = 2;
            canvasContext.strokeStyle = 'rgb(255, 255, 255)';
            canvasContext.beginPath();

            const sliceWidth = canvas.width / bufferLength;
            let x = 0;

            // Draw the soundwave
            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = (v * canvas.height) / 2;

                if (i === 0) {
                    canvasContext.moveTo(x, y);
                } else {
                    canvasContext.lineTo(x, y);
                }

                x += sliceWidth;
            }

            // Complete the path and draw the soundwave
            canvasContext.lineTo(canvas.width, canvas.height / 2);
            canvasContext.stroke();

            // Call the next frame
            requestAnimationFrame(draw);
        };

        // Start drawing the soundwave
        draw();
    }, [analyserNode]);

    return <canvas ref={canvasRef} />;
}

export default SoundWave;
