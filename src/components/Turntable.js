import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faRotate } from "@fortawesome/free-solid-svg-icons";
import { AudioLogicContext } from "./../logic/AudioLogicContext";
import sampleImg from "./../assets/disc.png";
import SongVisualization from "../SongVisualization";

/**
 * Component for the turntable
 * @param {*} id The channel of the turntable (left or right)
 * @param {*} song The song that is loaded in the turntable
 * @param {*} setSongPaused Function that sets the songPaused state in the parent component
 */
function Turntable({ id, song, setSongPaused }) {
  const [isPaused, setIsPaused] = useState(true);
  const [isSynchronized, setIsSynchronized] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const audioLogic = useContext(AudioLogicContext);
  const [bpm, setBpm] = useState(0);
  const [length, setLength] = useState(0);
  const [time, setTime] = useState(0);
  const discClass = `disc-${id}`;

  /**
   * useEffect hook that is triggered when the song is changed
   */
  useEffect(() => {
    //stop audioSource when song is changed while playing
    if (!isPaused) {
      setIsPaused(true);
      setSongPaused(true);
      audioLogic.pauseSong(id);
      const disc = document.querySelector(`.${discClass}`);
      disc.classList.toggle("spinning");
    }

    //set the audioLoaded state to true and get the length of the song if the song is loaded 
    if (audioLogic.isLoaded(id)) {
      setAudioLoaded(true);
      setLength(audioLogic.getSongLengthChannel(id));
    }
  }, [song]);

  /**
 * useEffect hook to update the playing time of the audio source
 * if the speed of the audio source changes when matching the bpm, 
 * the timeout duration will be updated accordingly
 */
useEffect(() => {
  if (!audioLoaded || isPaused) {
    return;
  }
  
  let timeoutId;

  const updateTime = () => {
    setTime(prevTime => prevTime + 1);
    const speed = audioLogic.getSpeed(id);
    console.log(speed);
    timeoutId = setTimeout(updateTime, 1000/speed);
  }

  updateTime();
  
  return () => {
    clearTimeout(timeoutId); // clear the timeout when the component unmounts
  };
}, [audioLoaded, isPaused, audioLogic, id]);

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
    if (!audioLoaded || !song) {
      return;
    }

    if (isPaused) {
      audioLogic.connectShifter(id);
      audioLogic.getBPM(id).then((bpm) => {
        setBpm(bpm.bpm);
      });
      audioLogic.playSong(id);
      setSongPaused(false);
      setTime(Math.round(song.queuePoint));
    } else {
      audioLogic.pauseSong(id);
      setSongPaused(true);
    }

    //toggle the spinning animation
    const disc = document.querySelector(`.${discClass}`);
    disc.classList.toggle("spinning");
    setIsPaused(!isPaused);
  }

  /**
   * Function that synchronizes the bpm of the turntable with the bpm of the other turntable
   */
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
    <div className="flex flex-col items-center">
      <div className="h-[80px] w-[20vw] mb-[30px]">
        <SongVisualization audioLogic={audioLogic} time={time} channel={id}/>
      </div>
      <div className={`h-[13vw] w-[13vw] rounded-full flex justify-center items-center ${discClass}`}>
        <img className="rounded-full" src={sampleImg} />
      </div>


      {song && <h1 className="green-text mt-[15px]">{song.name} - {getTime()}/{length}</h1>}
      <div className="text-[#0ac97a] text-center flex flex-row justify-around items-center text-sm">
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
