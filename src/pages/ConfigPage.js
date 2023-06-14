import React, { useState, useContext } from "react";
import { FileUpload } from "primereact/fileupload";
import { AudioLogicContext } from "./../logic/AudioLogicContext";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";

export default function () {
  const audioLogic = useContext(AudioLogicContext);

  const handleUpload = (event) => {
    const files = Array.from(event.files);
    handleSaveFiles(files);
  };

  const handleSaveFiles = (files) => {
    files.forEach((file) => {
      audioLogic.loadAudioFile(file)
    });
  };

  return (
    <div className="w-[80%] h-[90%] m-auto">
      <h1 className="text-4xl font-bold green-text mb-10">Config Page</h1>
      <FileUpload
        name="songs[]"
        url={"/demo_sounds"}
        multiple
        accept="audio/*"
        maxFileSize={10000000}
        customUpload
        uploadHandler={handleUpload}
        emptyTemplate={
          <p className="m-0">Drag and drop files to here to upload.</p>
        }
      />
      <div className="mt-10">
        <Link to="/dj-vj-tool"><Button label="Continue" outlined /></Link>
        </div>
    </div>
  );
}
