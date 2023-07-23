import React, { useState, useContext, useEffect } from "react";
import VideoPlayer from "./../components/VideoPlayer";
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

  function playVideo() {
    const video = document.querySelector("video");
    if (!video) {
      return;
    }
    
    video.play();
  }

  function stopVideo() {
    const video = document.querySelector("video");
    if (!video) {
      return;
    }
    video.pause();
  }

  function restartVideo() {
    const video = document.querySelector("video");
    video.currentTime = 0;
  }

  useEffect(() => {
    if (songLeftPaused) {
      stopVideo();
    } else {
      playVideo();
    }
  }
  ,[songLeftPaused]);
      
      

  return (
    <div>
      <div className="dj-controller-container">
        <Turntable
          id="left"
          backgroundImg="./../assets/sampleImg.png"
          song={songLeft}
          setSongPaused={setSongLeftPaused}
        />
        {songLeft ? (
          <div className="video-container">
            <video src={songLeft.video} muted loop />
          </div>
        ) : (
          <div className="video-container" />
        )}
        <Turntable
          id="right"
          backgroundImg="./../assets/sampleImg2.png"
          song={songRight}
        />
      </div>
      <div className="dj-controller-bottom">
        <Tracklist id="left" setSong={setSongLeft} />
        <Controller />
        <Tracklist id="right" setSong={setSongRight} />
      </div>
    </div>
  );
}
