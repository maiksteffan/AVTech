import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faRotate } from "@fortawesome/free-solid-svg-icons";
import { AudioLogicContext } from "./../logic/AudioLogicContext";
import "./Turntable.css";
import sampleSoundwave from "./../assets/soundwave.PNG";
import sampleImg from "./../assets/sampleImg.png";
import SongVisualization from "../SongVisualization";
import SoundWave from "./SoundWave";

function Turntable({ id, buffer }) {
  const [isPaused, setIsPaused] = useState(true);
  const [isSynchronized, setIsSynchronized] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const audioLogic = useContext(AudioLogicContext);
  const [bpm, setBpm] = useState(0);
  const [length, setLength] = useState(0);
  const [time, setTime] = useState(0);
  const discClass = `disc-${id}`;

  useEffect(() => {
    //stop audioSource when song is changed while playing
    if (!isPaused) {
      setIsPaused(true);
      audioLogic.pauseSong(id);
      const disc = document.querySelector(`.${discClass}`);
      disc.classList.toggle("spinning");
    }

    if (audioLogic.isLoaded(id)) {
      setAudioLoaded(true);
      setLength(audioLogic.getSongLengthChannel(id));
    }
  }, [buffer]);

  useEffect(() => {
    if (!audioLoaded || isPaused) {
      return;
    }

    const interval = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [audioLoaded, isPaused]);

  /**
   * Function that returns the current time of the audio source in the format of m:ss
   * @returns A string that represents the current time of the audio source in the format of m:ss
   */
  function getTime() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
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
      audioLogic.connectShifter(id);
      audioLogic.getBPM(id).then((bpm) => {
        setBpm(bpm.bpm);
      });
      audioLogic.playSong(id);
      setTime(0);
    } else {
      audioLogic.pauseSong(id);
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

    if (isSynchronized) {
      audioLogic.resetBpm(id);
      audioLogic.getBPM(id).then((bpm) => {
        setBpm(bpm.bpm);
      });
      setIsSynchronized(!isSynchronized);
      return;
    }


     audioLogic.matchBpm(id)
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
        <SongVisualization audioLogic={audioLogic} time={time} channel={id}/>
        <SoundWave analyserNode={audioLogic.getAnalyser(id)}/>
      </div>
      <div className={`disc ${discClass}`}>
        <img src={sampleImg} />
      </div>

      {buffer && <h1 className="green-text mt-[15px]">{buffer.name} - {getTime()}/{length}</h1>}
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
