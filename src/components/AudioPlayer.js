import React, { useState } from 'react';
import audioFile from '../demo_sounds/file_example_MP3_700KB.mp3';
import { FaPlay } from 'react-icons/fa';

export default function() {
    const [isPlaying, setIsPlaying] = useState(false);
    const audio = new Audio(audioFile);

    const handlePlayPause = () => {
        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play();
            setIsPlaying(true);
        }
    };

    return (
        <div>
            <button onClick={handlePlayPause}>
                {isPlaying ? 'Pause' : <FaPlay />}
            </button>
        </div>
    );
}
