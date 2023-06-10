import "./TrackList.css";
import React, { useContext } from "react";
import { AudioLogicContext } from "./../logic/AudioLogicContext";

function Tracklist() {
  const audioLogic = useContext(AudioLogicContext);

  return (
    <div className="tracklist-container">
      <h2 className="tracklist-heading font-bold my-3">Tracklist</h2>
      <ul className="text-center">
        {audioLogic.audioBufferList &&
          audioLogic.audioBufferList.map((audioBuffer, index) => (
            <li className="track" key={index}>
              {audioBuffer.name} -{" "}
              {audioLogic.getSongLength(audioBuffer.buffer)}
            </li>
          ))}
      </ul>
    </div>
  );
}
export default Tracklist;
