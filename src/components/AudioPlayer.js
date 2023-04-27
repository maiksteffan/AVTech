import React, { useState } from 'react';
import audioFile from './audio.mp3';
import { FaPlay } from 'react-icons/fa';

function AudioPlayer() {
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
