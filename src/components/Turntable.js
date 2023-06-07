import "./Turntable.css";
import sampleSoundwave from "./../assets/soundwave.PNG";
import sampleImg from "./../assets/sampleImg.png";
import { useRef, useState, useEffect } from "react";

function Turntable({ id, backgroundImg = "./../assets/sampleImg.png", track, volume }) {
  const [isPaused, setIsPaused] = useState(true);
  const discClass = `disc-${id}`;

  function togglePause() {
    const disc = document.querySelector(`.${discClass}`);
    disc.classList.toggle("spinning");
    setIsPaused(!isPaused);
  }

  return (
    <div className="turntable-container">
      <div className="sound-wave-display">
        <img src={sampleSoundwave} />
      </div>
      <div className={`disc ${discClass}`}>
        <img src={sampleImg} />
      </div>

      <div className="bpm-display">
        <div className="play-button" onClick={togglePause}>
          {!isPaused && (
            <div className="play-button-pause">
              <div className="pause-line"></div>
              <div className="pause-line"></div>
            </div>
          )}
          {isPaused && (
            <div className="play-button-play">
              <div className="play-button-triangle"></div>
            </div>
          )}
        </div>
        <h1>120 BPM</h1>
      </div>

    </div>
  );
}

export default Turntable;