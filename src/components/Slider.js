import React, { useState } from 'react';
import AudioPlayer from './AudioPlayer';

function Slider() {
    const [activePlayer, setActivePlayer] = useState(1);

    const handleSliderChange = () => {
        setActivePlayer(activePlayer === 1 ? 2 : 1);
    };

    return (
        <div>
            <h2>Slider Component</h2>
            <div>
                <button onClick={handleSliderChange}>
                    {activePlayer === 1 ? 'Switch to Player 2' : 'Switch to Player 1'}
                </button>
            </div>
            <div>
                {activePlayer === 1 && <AudioPlayer />}
                {activePlayer === 2 && <AudioPlayer />}
            </div>
        </div>
    );
}

export default Slider;
