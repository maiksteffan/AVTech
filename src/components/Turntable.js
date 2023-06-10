import "./Turntable.css";
import sampleSoundwave from "./../assets/soundwave.PNG";
import sampleImg from "./../assets/sampleImg.png";
import React, { useContext, useEffect, useState } from "react";
import { AudioLogicContext } from "./../logic/AudioLogicContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { faPause } from "@fortawesome/free-solid-svg-icons";
import { faRotate } from "@fortawesome/free-solid-svg-icons";

function Turntable({ id, backgroundImg = "./../assets/sampleImg.png", url }) {
  const [isPaused, setIsPaused] = useState(true);
  const [isSynchronized, setIsSynchronized] = useState(false);
  const discClass = `disc-${id}`;
  const audioLogic = useContext(AudioLogicContext);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioSource, setAudioSource] = useState(null);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [bpm, setBpm] = useState(0);

  useEffect(() => {
    audioLogic
      .loadAudio(url)
      .then((audioBuffer) => {
        setAudioBuffer(audioBuffer);
        setAudioLoaded(true);
      })
      .catch((error) => {
        console.error("Error loading audio file:", error);
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

      let obj = audioLogic.getBPM(audioBuffer);
      obj.then((bpm) => {
        setBpm(bpm.bpm);
      });
    } else {
      audioSource.stop();
      audioLogic.disconnectAudioSource(audioSource);
    }

    setIsPaused(!isPaused);
  }

  function sync() {
    if (!audioLoaded) {
      return;
    }

    setIsSynchronized(!isSynchronized);
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
        <div className="round-button" onClick={togglePause}>
          {!isPaused && <FontAwesomeIcon icon={faPause} size="xl" />}
          {isPaused && <FontAwesomeIcon icon={faPlay} size="xl" />}
        </div>
        <h1 className="digital mx-[20px]">{bpm} BPM</h1>
        <div className="round-button" onClick={sync}>
          {!isSynchronized && <FontAwesomeIcon icon={faRotate} size="xl" />}
          {isSynchronized && (
            <FontAwesomeIcon icon={faRotate} size="xl" spin/>          )}
        </div>
      </div>
    </div>
  );
}

export default Turntable;
