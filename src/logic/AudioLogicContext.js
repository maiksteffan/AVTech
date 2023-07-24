import React, { createContext, useState } from 'react';
import AudioLogic from './AudioLogic';
import { Button } from "primereact/button";
import { Link } from 'react-router-dom';

/** 
 * Create a new context for Audio Logic.
 */
export const AudioLogicContext = createContext();

/**
 * Provider component for AudioLogicContext, to provide the audioLogic to the children components globally
 * @param {*} param0 all children components
 */
export const AudioLogicProvider = ({ children }) => {
  const [audioLogic, setAudioLogic] = useState(null);

  /**
   * Function that starts the audioLogic
   */
  const startAudio = () => {
    setAudioLogic(new AudioLogic());
  }

  // If audioLogic is not set, show the start button to start the audioLogic
  if (!audioLogic) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Link to="/config"><Button className='w-[300px]' onClick={startAudio}  label="Start" outlined /></Link>
      </div>
    );
  }

  // If audioLogic is set, provide the audioLogic to the children components
  return (
    <AudioLogicContext.Provider value={audioLogic}>
      {children}
    </AudioLogicContext.Provider>
  );
};
