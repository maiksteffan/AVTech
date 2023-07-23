import React, { useState, useContext, useEffect } from "react";
import Turntable from "./../components/Turntable";
import Tracklist from "./../components/TrackList";
import Controller from "./../components/Controller";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "./../App.css";
import { AudioLogicContext } from "./../logic/AudioLogicContext";

export default function DJVJTool() {
  const audioLogic = useContext(AudioLogicContext);
  const [songLeft, setSongLeft] = useState();
  const [songRight, setSongRight] = useState();
  const [songLeftPaused, setSongLeftPaused] = useState(true);
  const [songRightPaused, setSongRightPaused] = useState(true);
  const [crossfade, setCrossfade] = useState(0);

  //Video player functions
  
  /**
   * Custom hook that controls the video of a song.
   * @param {boolean} songPaused 
   * @param {String} channel 
   */
  const useVideoControl = (songPaused, channel) => {
    useEffect(() => {
      if (songPaused) {
        stopVideo(channel);
      } else {
        restartVideo(channel);
        playVideo(channel);
      }
    }, [songPaused, channel]);
  };

  /**
   * Function that plays the video of a song.
   * @param {string} channel the channel of the song (left or right)
   */
  function playVideo(channel) {
    const video = channel === "left" ? document.querySelector("#left video") : document.querySelector("#right video");
    if (!video) {
      return;
    }
    video.play();
  }

  /**
   * Function that stops the video of a song.
   * @param {string} channel the channel of the song (left or right)
   */
  function stopVideo(channel) {
    const video = channel === "left" ? document.querySelector("#left video") : document.querySelector("#right video");
    if (!video) {
      return;
    }
    video.pause();
  }

  /**
   * Function that restarts the video of a song.
   * @param {string} channel the channel of the song (left or right)
   */
  function restartVideo(channel) {
    const video = channel === "left" ? document.querySelector("#left video") : document.querySelector("#right video");
    video.currentTime = 0;
  }

  //use custom hook to control videos state
  useVideoControl(songLeftPaused, "left");
  useVideoControl(songRightPaused, "right");

  /**
   * Function that returns the cosine ease of a value.
   * @param {*} x the value to be eased 
   * @returns the eased value 
   */
  function cosineEase(x) {
    return (1 - Math.cos(Math.PI * x)) / 2;
  }
  
  /**
   * useEffect hook that changes the opacity of the videos depending on the crossfade value, using cosine ease.
   */
  useEffect(() => {
    // change opacity of videos depending on crossfade
    const videoLeft = document.querySelector("#left video");
    const videoRight = document.querySelector("#right video");
    if (!videoLeft || !videoRight) {
      return;
    }
    videoLeft.style.opacity = 1 - cosineEase(crossfade);
    videoRight.style.opacity = cosineEase(crossfade);
  }, [crossfade]);
  

  return (
    <div>
      <div className="dj-controller-container">
        <Turntable
          id="left"
          backgroundImg="./../assets/sampleImg.png"
          song={songLeft}
          setSongPaused={setSongLeftPaused}
        />
        <div id="left" className="relative w-[40vw] h-[25vw]">
          {songLeft && (
            <div className="absolute top-0 left-0">
              <video src={songLeft.video} muted loop />
            </div>
          )}
          {songRight && (
            <div id="right" className="absolute top-0 left-0">
              <video src={songRight.video} muted loop />
            </div>
          )}
        </div>
        <Turntable
          id="right"
          backgroundImg="./../assets/sampleImg2.png"
          song={songRight}
          setSongPaused={setSongRightPaused}
        />
      </div>
      <div className="dj-controller-bottom">
        <Tracklist id="left" setSong={setSongLeft} />
        <Controller setCrossfade={setCrossfade} />
        <Tracklist id="right" setSong={setSongRight} />
      </div>
    </div>
  );
}
