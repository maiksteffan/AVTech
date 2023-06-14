import "./TrackList.css";
import React, { useContext } from "react";
import { AudioLogicContext } from "./../logic/AudioLogicContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay} from "@fortawesome/free-solid-svg-icons";

function Tracklist(props) {
  const audioLogic = useContext(AudioLogicContext);

  function handlePlay(buffer, id) {
    audioLogic.setAudioBuffer(buffer, props.id);
    props.setAudioBuffer(buffer);
  }

  return (
    <div className="tracklist-container mt-10">
      <h2 className="tracklist-heading font-bold my-3">Tracklist</h2>
      <ul className="text-center">
        {audioLogic.audioBufferList &&
          audioLogic.audioBufferList.map((audioBuffer, index) => (
            <li className="track" key={index}>
              {audioBuffer.name} -{" "}
              {audioLogic.getSongLength(audioBuffer.buffer)}
              <a onClick={() => handlePlay(audioBuffer, props.id)}  className="ml-2 ">
                <FontAwesomeIcon icon={faCirclePlay} style={{color: "#0ac97a",}} />
              </a>
            </li>
          ))}
      </ul>
    </div>
  );
}
export default Tracklist;
