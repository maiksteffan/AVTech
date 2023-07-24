import React, { useContext } from "react";
import { AudioLogicContext } from "./../logic/AudioLogicContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay} from "@fortawesome/free-solid-svg-icons";

/**
 * Component to render the tracklist of the songs loaded in the audioLogic
 */
function Tracklist(props) {
  const audioLogic = useContext(AudioLogicContext);

  /**
   * Function that handles the playing of a song, by setting the song in the audioLogic
   * @param {*} song the song to be played 
   */
  function handlePlay(song) {
    audioLogic.setSong(song, props.id);
    props.setSong(song);
  }

  return (
    <div className="mt-5 h-[45vh] w-[30vw] flex flex-col text-[#0AC97A]">
      <h2 className="my-3 font-bold text-center">Tracklist</h2>
      <ul className="mx-auto w-[80%]">
        {audioLogic.songList &&
          audioLogic.songList.map((song, index) => (
            <li className="flex flex-row justify-between mb-[5px] list-none" key={index}>
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
