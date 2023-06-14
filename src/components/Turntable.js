import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faRotate } from "@fortawesome/free-solid-svg-icons";
import { AudioLogicContext } from "./../logic/AudioLogicContext";
import "./Turntable.css";
import sampleSoundwave from "./../assets/soundwave.PNG";
import sampleImg from "./../assets/sampleImg.png";

function Turntable({ id, buffer }) {
  const [isPaused, setIsPaused] = useState(true);
  const [isSynchronized, setIsSynchronized] = useState(false);
  const audioLogic = useContext(AudioLogicContext);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioSource, setAudioSource] = useState(null);
  const [audioBuffer, setAudioBuffer] = useState(audioLogic.getAudioBuffer(id));
  const [bpm, setBpm] = useState(0);
  const [length, setLength] = useState(0);
  const [time, setTime] = useState(0);
  const discClass = `disc-${id}`;

  /*
    * useEffect hook that is called when the audio buffer is changed.
    * If the audio buffer is null, then the audio is won't be set to loaded.
    * If the audio buffer is not null, then the audio is set to loaded.
    * If the audio source is not null, then the audio source is stopped and disconnected from the audio context.
  */
  useEffect(() => {
    //stop audioSource when song is changed while playing
    if (audioSource) {
      audioSource.stop();
      audioLogic.disconnectAudioSource(audioSource);
      setIsPaused(true);
      const disc = document.querySelector(`.${discClass}`);
      disc.classList.toggle("spinning");
    }

    //sets the audio buffer to the passed in buffer
    setAudioBuffer(buffer);

    //if the audio buffer is null, then the audio is won't be set to loaded
    if (audioBuffer) {
      setAudioLoaded(true);
      setLength(audioLogic.getSongLength(audioBuffer.buffer));
      return;
    }
  }, [buffer]);

  useEffect(() => {
    if (!audioLoaded || !audioSource || isPaused) {
      return;
    }
  
    const interval = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000); 
  
    return () => {
      clearInterval(interval);
    };
  }, [audioLoaded, audioSource, isPaused]);

  //function that returns the time in the format of mm:ss
  function getTime() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  }


  /**
   * Function that creates a new source node with the audio buffer set 
   * to the audio buffer of this turntable.
   * @returns a new source node with the audio buffer set to the audio buffer of this turntable
   */
  function createNewSourceNode() {
    if (!audioLoaded || !audioBuffer) {
      return;
    }
    const sourceNode = audioLogic.audioContext.createBufferSource();
    sourceNode.buffer = audioBuffer.buffer;
    setAudioSource(sourceNode);
    audioLogic.connectAudioSource(sourceNode, id);
    sourceNode.start();
  }

  /**
   * Function that toggles the pause state of the turntable.
   * If the turntable is paused, a new source node will be created and connected to the audio context.
   * If the turntable is playing, the source will be stopped and disconnected from the audio context
   * @returns None
   */
  function togglePause() {
    if (!audioLoaded || !buffer) {
      return;
    }

    if (isPaused) {
      createNewSourceNode();
      audioLogic.getBPM(audioBuffer.buffer).then((bpm) => {
        setBpm(bpm.bpm);
      });
      setTime(0);
    } else {
      audioSource.stop();
      audioLogic.disconnectAudioSource(audioSource);
    }

    //toggle the spinning animation
    const disc = document.querySelector(`.${discClass}`);
    disc.classList.toggle("spinning");
    setIsPaused(!isPaused);
  }

  //match the bpm of this audio source to that of the other
  function sync() {
    if (!audioLoaded) {
      return;
    }

    //Call the matchBpm function in the audio logic
    audioLogic.matchBpm(id, audioSource)
    .then(targetBpm => {
      setBpm(targetBpm);
      setIsSynchronized(!isSynchronized);
    })
    .catch(error => {
      console.error("Error:", error);
    });
  }

  return (
    <div className="turntable-container">
      <div className="sound-wave-display">
        <img src={sampleSoundwave} />
      </div>
      <div className={`disc ${discClass}`}>
        <img src={sampleImg} />
      </div>

      {audioBuffer && <h1 className="green-text mt-[15px]">{audioBuffer.name} - {getTime()}/{length}</h1>}
      <div className="bpm-display">
        <div className="round-button" onClick={togglePause}>
          {!isPaused && <FontAwesomeIcon icon={faPause} size="xl" />}
          {isPaused && <FontAwesomeIcon icon={faPlay} size="xl" />}
        </div>
        <h1 className="digital mx-[20px]">{bpm} BPM</h1>
        <div className="round-button" onClick={sync}>
          {!isSynchronized && <FontAwesomeIcon icon={faRotate} size="xl" />}
          {isSynchronized && <FontAwesomeIcon icon={faRotate} size="xl" spin />}
        </div>
      </div>
    </div>
  );
}
export default Turntable;
