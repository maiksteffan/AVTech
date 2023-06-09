import React, { useState } from "react";
import VideoPlayer from "./../components/VideoPlayer";
import Turntable from "./../components/Turntable";
import Tracklist from "./../components/Tracklist";
import Controller from "./../components/Controller";
import "primereact/resources/themes/lara-light-indigo/theme.css";    
import "primereact/resources/primereact.min.css";
import "./../App.css";

export default function DJVJTool() {
  const [volumeLeft, setVolumeLeft] = useState(0);
  const [volumeRight, setVolumeRight] = useState(0);
  const sampleSongs = [
    {
      title: "Baila Baila Baila",
      artist: "Ozuna",
      length: "2:37",
    },
    {
      title: "Con Altura",
      artist: "ROSALÍA, J Balvin",
      length: "2:41",
    },
    { title: "MIA", artist: "Bad Bunny, Drake", length: "3:30" },
    {
      title: "Señorita",
      artist: "Shawn Mendes, Camila Cabello",
      length: "3:11",
    },
    { title: "Despacito", artist: "Luis Fonsi, Daddy Yankee", length: "4:41" },
    { title: "Vente Pa' Ca", artist: "Ricky Martin, Maluma", length: "4:18" },
    { title: "Dura", artist: "Daddy Yankee", length: "3:21" },
    { title: "Tusa", artist: "Karol G, Nicki Minaj", length: "3:21" },
    { title: "La Modelo", artist: "Ozuna, Cardi B", length: "4:15" },
    {
      title: "Me Gusta",
      artist: "Anitta, Cardi B, Myke Towers",
      length: "2:44",
    },
  ];

  return (
    <div>
      <div className="dj-controller-container">
        <Turntable
          id="left"
          backgroundImg="./../assets/sampleImg.png"
          url="./../demo_sounds/hiphop_demo.mp3"
        />
        <VideoPlayer videoUrl="https://media.istockphoto.com/id/1371473504/video/4k-video-of-flowing-binary-code-in-green-color.mp4?s=mp4-640x640-is&k=20&c=Na3PSkNBQsfJY3I0U58mJ25PEeiFUokeQNj1FAoTI8Y=" />
        <Turntable
          id="right"
          backgroundImg="./../assets/sampleImg2.png"
          url="./../demo_sounds/hiphop_demo.mp3"
        />
      </div>
      <div className="dj-controller-bottom">
        <Tracklist songs={sampleSongs} />
        <Controller />
        <Tracklist songs={sampleSongs} />
      </div>
    </div>
  );
}
