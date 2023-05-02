import React, { useState } from 'react';
import SliderStyles from './Slider.module.css'

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
                {activePlayer === 1 && ""}
                {activePlayer === 2 && ""}
            </div>
        </div>
    );
}

export default Slider;
