import React, { useState, useContext, useEffect } from "react";
import { FileUpload } from "primereact/fileupload";
import { AudioLogicContext } from "./../logic/AudioLogicContext";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";

export default function () {
  const audioLogic = useContext(AudioLogicContext);

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

  const handleUpload = (event) => {
    const files = Array.from(event.files);
    handleSaveFiles(files);
  };

  const handleSaveFiles = (files) => {
    files.forEach((file) => {
      audioLogic.loadAudioFile(file);
    });
  };

  useEffect(() => {
    let urls = ["/demo_sounds/demo1.mp3", "/demo_sounds/demo2.mp3"];
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
