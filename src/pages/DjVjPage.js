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
  const [audioBufferLeft, setAudioBufferLeft] = useState();
  const [audioBufferRight, setAudioBufferRight] = useState(
    audioLogic.audioBufferRight
  );

  return (
    <div>
      <div className="dj-controller-container">
        <Turntable
          id="left"
          backgroundImg="./../assets/sampleImg.png"
          buffer={audioBufferLeft}
        />
        <VideoPlayer videoUrl="https://media.istockphoto.com/id/1371473504/video/4k-video-of-flowing-binary-code-in-green-color.mp4?s=mp4-640x640-is&k=20&c=Na3PSkNBQsfJY3I0U58mJ25PEeiFUokeQNj1FAoTI8Y=" />
        <Turntable
          id="right"
          backgroundImg="./../assets/sampleImg2.png"
          buffer={audioBufferRight}
        />
      </div>
      <div className="dj-controller-bottom">
        <Tracklist
          id="left"
          setAudioBuffer={setAudioBufferLeft}
        />
        <Controller />
        <Tracklist
          id="right"
          setAudioBuffer={setAudioBufferRight}
        />
      </div>
    </div>
  );
}
