import React, { useState } from "react";
import VideoPlayer from "./../components/VideoPlayer";
import Turntable from "./../components/Turntable";
import Tracklist from "./../components/Tracklist";
import Controller from "./../components/Controller";
import "primereact/resources/themes/lara-light-indigo/theme.css";    
import "primereact/resources/primereact.min.css";
import "./../App.css";

export default function DJVJTool() {
  return (
    <div>
      <div className="dj-controller-container">
        <Turntable
          id="left"
          backgroundImg="./../assets/sampleImg.png"
          url="./../demo_sounds/demo1.mp3"
        />
        <VideoPlayer videoUrl="https://media.istockphoto.com/id/1371473504/video/4k-video-of-flowing-binary-code-in-green-color.mp4?s=mp4-640x640-is&k=20&c=Na3PSkNBQsfJY3I0U58mJ25PEeiFUokeQNj1FAoTI8Y=" />
        <Turntable
          id="right"
          backgroundImg="./../assets/sampleImg2.png"
          url="./../demo_sounds/demo2.mp3"
        />
      </div>
      <div className="dj-controller-bottom">
        <Tracklist />
        <Controller />
        <Tracklist />
      </div>
    </div>
  );
}
