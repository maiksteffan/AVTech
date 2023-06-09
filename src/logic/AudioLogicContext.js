import React, { createContext, useState } from 'react';
import AudioLogic from './AudioLogic';

export const AudioLogicContext = createContext();

export const AudioLogicProvider = ({ children }) => {
  const [audioLogic] = useState(new AudioLogic());

  return (
    <AudioLogicContext.Provider value={audioLogic}>
      {children}
    </AudioLogicContext.Provider>
  );
};