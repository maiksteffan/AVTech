import "./TrackList.css";
import React, { useContext } from "react";
import { AudioLogicContext } from "./../logic/AudioLogicContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay} from "@fortawesome/free-solid-svg-icons";

function Tracklist(props) {
  const audioLogic = useContext(AudioLogicContext);

  function handlePlay(song) {
    audioLogic.setSong(song, props.id);
    props.setSong(song);
  }

  return (
    <div className="mt-5 tracklist-container">
      <h2 className="my-3 font-bold tracklist-heading">Tracklist</h2>
      <ul className="mx-auto w-[80%]">
        {audioLogic.songList &&
          audioLogic.songList.map((song, index) => (
            <li className="flex flex-row justify-between track" key={index}>
              {song.name} -{" "}
              {audioLogic.getSongLength(song.buffer)}
              <a onClick={() => handlePlay(song)}  className="ml-2 ">
                <FontAwesomeIcon icon={faCirclePlay} style={{color: "#0ac97a",}} />
              </a>
            </li>
          ))}
      </ul>
      </div>
  );
}
export default Tracklist;
