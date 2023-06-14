import "./Turntable.css";
import sampleSoundwave from "./../assets/soundwave.PNG";
import sampleImg from "./../assets/sampleImg.png";
import React, {
  useContext,
  useEffect,
  useState,
  componentDidUpdate,
} from "react";
import { AudioLogicContext } from "./../logic/AudioLogicContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { faPause } from "@fortawesome/free-solid-svg-icons";
import { faRotate } from "@fortawesome/free-solid-svg-icons";

function Turntable({
  id,
  backgroundImg = "./../assets/sampleImg.png",
  buffer,
}) {
  const [isPaused, setIsPaused] = useState(true);
  const [isSynchronized, setIsSynchronized] = useState(false);
  const discClass = `disc-${id}`;
  const audioLogic = useContext(AudioLogicContext);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioSource, setAudioSource] = useState(null);
  const [audioBuffer, setAudioBuffer] = useState(audioLogic.getAudioBuffer(id));
  const [bpm, setBpm] = useState(0);

  useEffect(() => {
    //stop audioSource when song is changed while playing
    if (audioSource) {
      audioSource.stop();
      audioLogic.disconnectAudioSource(audioSource);
      setIsPaused(true);
      const disc = document.querySelector(`.${discClass}`);
      disc.classList.toggle("spinning");
    }

    setAudioBuffer(buffer);
    if (audioBuffer) {
      setAudioLoaded(true);
      return;
    }
  }, [buffer]);

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

  function togglePause() {
    if (!audioLoaded || !buffer) {
      return;
    }

    const disc = document.querySelector(`.${discClass}`);
    disc.classList.toggle("spinning");

    if (isPaused) {
      createNewSourceNode();

      let promise = audioLogic.getBPM(audioBuffer.buffer);
      promise.then((bpm) => {
        setBpm(bpm.bpm);
      });
    } else {
      audioSource.stop();
      audioLogic.disconnectAudioSource(audioSource);
    }

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
      {audioBuffer && <h1>Currently Playing: {audioBuffer.name}</h1>}
    </div>
  );
}

export default Turntable;
