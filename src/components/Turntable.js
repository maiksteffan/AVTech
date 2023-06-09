import "./Turntable.css";
import sampleSoundwave from "./../assets/soundwave.PNG";
import sampleImg from "./../assets/sampleImg.png";
import React, { useContext, useEffect, useState } from 'react';
import {AudioLogicContext} from './../logic/AudioLogicContext';

function Turntable({ id, backgroundImg = "./../assets/sampleImg.png", url }) {
  const [isPaused, setIsPaused] = useState(true);
  const discClass = `disc-${id}`;
  const audioLogic = useContext(AudioLogicContext);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioSource, setAudioSource] = useState(null);
  const [audioBuffer, setAudioBuffer] = useState(null);

  useEffect(() => {
    audioLogic.loadAudio(url)
      .then(audioBuffer => {
        setAudioBuffer(audioBuffer);
        setAudioLoaded(true);
      })
      .catch(error => {
        console.error('Error loading audio file:', error);
      });

    return () => {
      if (audioSource) {
        audioLogic.disconnectAudioSource(audioSource);
      }
    };
  }, [audioLogic, url]);

  function createNewSourceNode() {
    if (!audioLoaded) {
      return;
    }

    const sourceNode = audioLogic.audioContext.createBufferSource();
    sourceNode.buffer = audioBuffer;
    setAudioSource(sourceNode);
    audioLogic.connectAudioSource(sourceNode, id);
    sourceNode.start();
  }

  function togglePause() {
    if (!audioLoaded) {
      return;
    }
  
    const disc = document.querySelector(`.${discClass}`);
    disc.classList.toggle("spinning");
  
    if (isPaused) {
      createNewSourceNode();
    } else {
      audioSource.stop();
      audioLogic.disconnectAudioSource(audioSource);
    }
    
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