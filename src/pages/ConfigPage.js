import React, { useState, useContext, useEffect, useRef } from "react";
import { FileUpload } from "primereact/fileupload";
import { AudioLogicContext } from "./../logic/AudioLogicContext";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

/**
 * Component for the config page
 */
export default function () {
  const audioLogic = useContext(AudioLogicContext);
  const [queuePointModalVisible, setQueuePointModalVisible] = useState(false);
  const [linkVideoModalVisible, setLinkVideoModalVisible] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [filesLoaded, setFilesLoaded] = useState(true);
  const audioRef = useRef();

  //Array of the demo videos
  const videoList = [
    { name: "Neon Guts", url: "/demo_videos/Neon Guts.mp4" },
    { name: "Search and Rescue", url: "/demo_videos/Search and Rescue.mp4" },
    { name: "Default Video", url: "/demo_videos/defaultVideo.mp4" },
  ];

  /**
   * Function that loads demo files from the demo_sounds folder
   * @param {*} urls An array of urls to the demo files
   */
  const loadDemoFiles = (urls) => {
    if (filesLoaded && audioLogic.songList.length > 0) {
      return;
    }

    setFilesLoaded(false);
    if (audioLogic.songList.length == 0) {
      const fetchPromises = urls.map((url) => {
        return fetch(url)
          .then((response) => response.blob())
          .then((blob) => {
            const fileName = url.substring(url.lastIndexOf("/") + 1);
            const file = new File([blob], fileName, { type: blob.type });
            return audioLogic.loadAudioFile(file);
          });
      });

      Promise.all(fetchPromises).then(() => {
        setFilesLoaded(true);
      });
    }
  };

  /**
   * Function that handles the upload of files in the file upload component
   * @param {*} event Event that is triggered when a file is uploaded
   */
  const handleUpload = (event) => {
    const files = Array.from(event.files);
    handleSaveFiles(files);
  };

  /**
   * Function that triggers the saving of files in the audioLogic
   * @param {*} files
   */
  const handleSaveFiles = (files) => {
    setFilesLoaded(false);
    files.forEach((file) => {
      audioLogic.loadAudioFile(file);
    });
    setFilesLoaded(true);
  };

  useEffect(() => {
    let urls = [
      "/demo_sounds/Myke Towers - Almas Gemelas.mp3",
      "/demo_sounds/Pop Smoke - For The Night.mp3",
      "/demo_sounds/Pop Smoke - Invincible.mp3",
      "demo_sounds/Pop Smoke, Lil Tjay - Hello.mp3",
    ];
    loadDemoFiles(urls);
  }, []);

  /**
   * Function that handles the opening of the queue point modal
   * @param {*} song the song to add a queue point to
   */
  function handleQueuePoint(song) {
    setSelectedSong(song);
    setQueuePointModalVisible(true);
    //wait for the modal to open
    setTimeout(() => {
      let audio = audioRef.current;
      audio.src = "/demo_sounds/" + song.name + ".mp3";
    }, 100);
  }

  function setQueuePoint(song) {
    let audioTime = audioRef.current.currentTime;
    song.queuePoint = audioTime;
    setQueuePointModalVisible(false);
  }

  function resetQueuePoint(song) {
    song.queuePoint = 0;
    setQueuePointModalVisible(false);
  }

  /**
   * Function that handles the linking of a video to a song
   * @param {*} song the song to link a video to
   */
  function handleLinkVideo(song) {
    setSelectedSong(song);
    setLinkVideoModalVisible(true);
  }

  /**
   * Function that links a video to a song
   * @param {*} url the url of the video to link to the song
   */
  function linkVideo(url) {
    selectedSong.video = url;
    setLinkVideoModalVisible(false);
  }

  return (
    <div className="w-[80%] h-[90%] m-auto">
      <h1 className="mb-10 text-4xl font-bold green-text">Config Page</h1>
      <FileUpload
        name="songs[]"
        url={"/demo_sounds"}
        multiple
        accept="audio/*"
        maxFileSize={10000000}
        customUpload
        uploadHandler={handleUpload}
        auto
        emptyTemplate={
          <p className="m-0">Drag and drop files to here to upload.</p>
        }
      />
      <div className="mt-10">
        <Link to="/dj-vj-tool">
          <Button label="Continue" outlined />
        </Link>
      </div>

      <div className="w-[100%] mt-10 border border-gray-700 rounded-md px-5 py-3">
        <h2 className="mb-5 text-4xl font-bold green-text">Song Settings</h2>

        {audioLogic.songList &&
          filesLoaded &&
          audioLogic.songList.map((song, index) => (
            <div
              className="flex flex-row items-center justify-between h-12 pl-5 mt-2 border border-gray-700 rounded-md track"
              key={index}
            >
              <h2 className="green-text">{song.name}</h2>
              <div>
                <button
                  className="px-3 py-1 mr-3 border border-gray-700 rounded-md hover:bg-slate-800"
                  onClick={() => handleQueuePoint(song)}
                >
                  Add Queue Point
                </button>
                <button
                  onClick={() => handleLinkVideo(song)}
                  className="px-3 py-1 mr-3 border border-gray-700 rounded-md hover:bg-slate-800"
                >
                  Link Video
                </button>
              </div>
            </div>
          ))}
      </div>

      <Dialog
        header="Link Video"
        visible={linkVideoModalVisible}
        onHide={() => setLinkVideoModalVisible(false)}
        style={{ width: "50vw" }}
        breakpoints={{ "960px": "75vw", "641px": "100vw" }}
      >
        <p className="m-0">
          Select the video you want to link to{" "}
          <strong>{selectedSong && selectedSong.name}</strong>:
        </p>
        {videoList.map((video, index) => (
          <div
            className="flex flex-row items-center justify-between h-12 pl-5 mt-2 border border-gray-700 rounded-md track"
            key={index}
          >
            <h2 className="green-text">{video.name}</h2>
            <div>
              <button
                className="px-3 py-1 mr-3 border border-gray-700 rounded-md hover:bg-slate-800"
                onClick={() => linkVideo(video.url)}
              >
                Link
              </button>
            </div>
          </div>
        ))}
      </Dialog>
      <Dialog
        header="Add Queue Point"
        visible={queuePointModalVisible}
        onHide={() => setQueuePointModalVisible(false)}
        style={{ width: "50vw" }}
        breakpoints={{ "960px": "75vw", "641px": "100vw" }}
      >
        {selectedSong && (
          <p className="mb-1">
            <strong>{selectedSong.name}</strong>
          </p>
        )}
        { selectedSong && <p className="mb-3">Current queue point = {selectedSong.queuePoint} seconds</p> }

        <audio
          controls
          ref={audioRef}
          src={"/demo_sounds/Myke Towers - Almas Gemelas.mp3"}
          className="w-full mb-2"
        ></audio>
        <p className="mb-2">{"(The queue point will be set to the played time of the audio player)"}</p>
        <button onClick={() => setQueuePoint(selectedSong)} className="px-3 py-1 mr-3 border border-gray-700 rounded-md hover:bg-slate-800">
          Set Queue Point
        </button>
        <button onClick={() => resetQueuePoint(selectedSong)} className="px-3 py-1 mr-3 border border-gray-700 rounded-md hover:bg-slate-800">
          Reset Queue Point
        </button>
      </Dialog>
    </div>
  );
}
