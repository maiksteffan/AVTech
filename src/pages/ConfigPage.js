import React, { useState, useContext, useEffect } from "react";
import { FileUpload } from "primereact/fileupload";
import { AudioLogicContext } from "./../logic/AudioLogicContext";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";

export default function () {
  const audioLogic = useContext(AudioLogicContext);

  /**
   * Function that loads demo files from the demo_sounds folder
   * @param {*} urls An array of urls to the demo files
   */
  const loadDemoFiles = (urls) => {
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
      "demo_sounds/Pop Smoke, Lil Tjay - Hello.mp3"
    ];
    loadDemoFiles(urls);
  }, []);

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
    </div>
  );
}
