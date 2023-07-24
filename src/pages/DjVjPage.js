import React, { useState, useContext, useEffect, useRef } from "react";
import Turntable from "./../components/Turntable";
import Tracklist from "./../components/TrackList";
import Controller from "./../components/Controller";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "./../App.css";
import Filters from "./../logic/Filters";
import { AudioLogicContext } from "./../logic/AudioLogicContext";

/**
 * Component for the DJ/VJ page of the application, that includes the turntables, the tracklists the controller
 * and the video player and all its logic
 */
export default function DJVJTool() {
  const audioLogic = useContext(AudioLogicContext);
  const [songLeft, setSongLeft] = useState();
  const [songRight, setSongRight] = useState();
  const [songLeftPaused, setSongLeftPaused] = useState(true);
  const [songRightPaused, setSongRightPaused] = useState(true);
  const [crossfade, setCrossfade] = useState(0);
  const [filter, setFilter] = useState("");
  let lastFrameTime = Date.now();
  const animationFrameID = useRef();

  //Video player functions
  /**
   * Custom hook that controls the video of a song.
   * @param {boolean} songPaused boolean that indicates if the song is paused or not
   * @param {String} channel the channel of the song (left or right)
   */
  const useVideoControl = (songPaused, channel) => {
    useEffect(() => {
      if (songPaused) {
        stopVideo(channel);
      } else {
        const video =
          channel === "left"
            ? document.querySelector("#left video")
            : document.querySelector("#right video");
        const canvas =
          channel === "left"
            ? document.querySelector("#canvas-left")
            : document.querySelector("#canvas-right");

        canvas.width = (40 * window.innerWidth) / 100;
        canvas.height = (23 * window.innerWidth) / 100;
        restartVideo(channel);
        playVideo(channel);
        drawVideoOnCanvas(video, canvas, filter); // Change filter as desired
      }
    }, [songPaused, channel]);
  };

  /**
   * Function that draws the video of a song on a canvas.
   * @param {video} videoElement reference to the video element of the song
   * @param {canvas} canvasElement reference to the canvas element
   * @param {Filters} filter the filter to be applied to the video
   */
  function drawVideoOnCanvas(videoElement, canvasElement, filter) {
    
    // Cancel previous frame to avoid performance issues
    if (animationFrameID.current) {
      cancelAnimationFrame(animationFrameID.current);
    }

    // Calculate the time since the last frame.
    const now = Date.now();
    const elapsed = now - lastFrameTime;

    // Skip the frame if less than 30ms have passed since the last frame (for lowering performance issues)
    if (elapsed < 30) {
      animationFrameID.current = requestAnimationFrame(() =>
        drawVideoOnCanvas(videoElement, canvasElement, filter)
      );
      return;
    }

    // Update the last frame time to the current time
    lastFrameTime = now;

    // Check if the video is ready to be drawn currently
    if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
      const context = canvasElement.getContext("2d");
      context.clearRect(0, 0, canvasElement.width, canvasElement.height);
      context.drawImage(
        videoElement,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      // apply filter if it is matching an existing filter in the Filters object
      if (Filters[filter]) {
        Filters[filter](context, canvasElement);
      }
    }

    // request next frame
    animationFrameID.current = requestAnimationFrame(() =>
      drawVideoOnCanvas(videoElement, canvasElement, filter)
    );
  }

  /**
   * Function that plays the video of a song.
   * @param {string} channel the channel of the song (left or right)
   */
  function playVideo(channel) {
    const video =
      channel === "left"
        ? document.querySelector("#left video")
        : document.querySelector("#right video");
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
    const video =
      channel === "left"
        ? document.querySelector("#left video")
        : document.querySelector("#right video");
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
    const video =
      channel === "left"
        ? document.querySelector("#left video")
        : document.querySelector("#right video");
    video.currentTime = 0;
  }

  //use custom hook to control videos state depending on songLeftPaused and songRightPaused
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
    const canvasLeft = document.querySelector("#canvas-left");
    const canvasRight = document.querySelector("#canvas-right");
    if (!videoLeft || !videoRight || !canvasLeft || !canvasRight) {
      return;
    }
    videoLeft.style.opacity = 1 - cosineEase(crossfade);
    videoRight.style.opacity = cosineEase(crossfade);
    canvasLeft.style.opacity = 1 - cosineEase(crossfade);
    canvasRight.style.opacity = cosineEase(crossfade);
  }, [crossfade]);

  /**
   * useEffect hook that changes the filter of the videos depending on the filter state variable
   * and restarts the drawing of the videos on the canvases with the new filter
   */
  useEffect(() => {
    // if there are no songs loaded return
    if (!songLeft && !songRight) {
      return;
    }

    // get the videos and canvases of the songs
    const videoLeft = document.querySelector("#left video");
    const videoRight = document.querySelector("#right video");
    const canvasLeft = document.querySelector("#canvas-left");
    const canvasRight = document.querySelector("#canvas-right");

    // cancel previous frame to avoid performance issues
    if (animationFrameID.current) {
      cancelAnimationFrame(animationFrameID.current);
    }

    // restart the drawing of the videos on the canvases with the new filter, if the videos and canvases exist
    if (videoLeft && canvasLeft) {
      drawVideoOnCanvas(videoLeft, canvasLeft, filter);
    }
    if (videoRight && canvasRight) {
      drawVideoOnCanvas(videoRight, canvasRight, filter);
    }
  }, [filter]);

  return (
    <div>
      <div className="flex flex-row justify-around h-[50vh] w-[100vw] m-auto">
        <Turntable
          id="left"
          backgroundImg="./../assets/sampleImg.png"
          song={songLeft}
          setSongPaused={setSongLeftPaused}
        />
        <div id="left" className="relative w-[40vw] h-[25vw]">
          <div className="flex flex-row items-center justify-center gap-5">
            <button
              onClick={() => setFilter("grayscaleFilter")}
              className="px-3 py-1 border border-gray-700 rounded-md hover:bg-slate-800"
            >
              B/W
            </button>
            <button
              onClick={() => setFilter("colorInvertFilter")}
              className="px-3 py-1 border border-gray-700 rounded-md hover:bg-slate-800"
            >
              Invert
            </button>
            <button
              onClick={() => setFilter("sepiaFilter")}
              className="px-3 py-1 border border-gray-700 rounded-md hover:bg-slate-800"
            >
              Sepia
            </button>
            <button
              onClick={() => setFilter("barbieFilter")}
              className="px-3 py-1 border border-gray-700 rounded-md hover:bg-slate-800"
            >
              Barbie
            </button>
          </div>
          {songLeft && (
            <div className="absolute left-0 top-12">
              <video className="hidden" src={songLeft.video} muted loop />
              <canvas id="canvas-left" className="w-full h-full" />
            </div>
          )}
          {songRight && (
            <div id="right" className="absolute left-0 top-12">
              <video className="hidden" src={songRight.video} muted loop />
              <canvas id="canvas-right" />
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
      <div className="flex">
        <Tracklist id="left" setSong={setSongLeft} />
        <Controller setCrossfade={setCrossfade} />
        <Tracklist id="right" setSong={setSongRight} />
      </div>
    </div>
  );
}
