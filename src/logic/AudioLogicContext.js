import React, { createContext, useState } from 'react';
import AudioLogic from './AudioLogic';
import { Button } from "primereact/button";

export const AudioLogicContext = createContext();

export const AudioLogicProvider = ({ children }) => {
  const [audioLogic, setAudioLogic] = useState(null);

  const startAudio = () => {
    setAudioLogic(new AudioLogic());
  }

  if (!audioLogic) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Button className='w-[300px]' onClick={startAudio}  label="Start" outlined />
      </div>
    );
  }

  return (
    <AudioLogicContext.Provider value={audioLogic}>
      {children}
    </AudioLogicContext.Provider>
  );
};
