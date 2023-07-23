import React, { useState, useContext, useEffect, useRef } from "react";
import { FileUpload } from "primereact/fileupload";
import { AudioLogicContext } from "./../logic/AudioLogicContext";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

export default function () {
  const audioLogic = useContext(AudioLogicContext);
  const [queuePointModalVisible, setQueuePointModalVisible] = useState(false);
  const [linkVideoModalVisible, setLinkVideoModalVisible] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
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
    if (audioLogic.songList.length == 0) {
      for (let url of urls) {
        fetch(url)
          .then((response) => response.blob())
          .then((blob) => {
            const fileName = url.substring(url.lastIndexOf("/") + 1);
            const file = new File([blob], fileName, { type: blob.type });
            audioLogic.loadAudioFile(file).then((audioBuffer) => {
              console.log("Audio file loaded!");
            });
          });
      }
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
    files.forEach((file) => {
      audioLogic.loadAudioFile(file);
    });
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

  function handleQueuePoint(song) {
    setSelectedSong(song);
    setQueuePointModalVisible(true);
  }

  function handleLinkVideo(song) {
    setSelectedSong(song);
    setLinkVideoModalVisible(true);
  }

  function linkVideo(url) {
    selectedSong.setVideo(url);
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
        <p>Set Queue Point</p>
      </Dialog>
    </div>
  );
}
