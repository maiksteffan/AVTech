import "./Controller.css";
import { useState, useContext } from "react";
import { Knob } from 'primereact/knob';
import {AudioLogicContext} from './../logic/AudioLogicContext';

function Controller(props) {
  const [crossfade, setCrossfade] = useState(50);
  const [volumeLeft, setVolumeLeft] = useState(0.5);
  const [volumeRight, setVolumeRight] = useState(0.5);
  const [knob1Value, setKnob1Value] = useState(0);
  const [knob2Value, setKnob2Value] = useState(0);
  const [knob3Value, setKnob3Value] = useState(0);
  const [knob4Value, setKnob4Value] = useState(0);
  const [knob5Value, setKnob5Value] = useState(0);
  const [knob6Value, setKnob6Value] = useState(0);
  const [knob7Value, setKnob7Value] = useState(0);
  const [knob8Value, setKnob8Value] = useState(0);
  const audioLogic = useContext(AudioLogicContext);

  function handleCrossfadeChange(event) {
    setCrossfade(event.target.value);
  }

  function handleVolumeLeftChange(event) {
    setVolumeLeft(event.target.value);
    audioLogic.gainNodeLeft.gain.value = event.target.value;
  }

  function handleVolumeRightChange(event) {
    setVolumeRight(event.target.value);
    audioLogic.gainNodeRight.gain.value = event.target.value;
  }

  return (
    <div className="controller-container">
      <div className="cross-fader-container">
        <input
          type="range"
          min="0"
          max="100"
          value={crossfade}
          step="1"
          onChange={handleCrossfadeChange}
          className="cross-fader"
        />
      </div>
      <div className="controller-bottom">
        <input
          type="range"
          min="0"
          max="100"
          value={volumeLeft}
          step="1"
          onChange={handleVolumeLeftChange}
          className="volume-controller"
        />
        <div className="knob-container">
        <Knob value={knob1Value} size={50} onChange={(e) => setKnob1Value(e.value)} valueColor="#404040" rangeColor="#0AC97A"  />
        <Knob value={knob2Value} size={50} onChange={(e) => setKnob2Value(e.value)} valueColor="#404040" rangeColor="#0AC97A"  />
        <Knob value={knob3Value} size={50} onChange={(e) => setKnob3Value(e.value)} valueColor="#404040" rangeColor="#0AC97A"  />
        <Knob value={knob4Value} size={50} onChange={(e) => setKnob4Value(e.value)} valueColor="#404040" rangeColor="#0AC97A"  />
        <Knob value={knob5Value} size={50} onChange={(e) => setKnob5Value(e.value)} valueColor="#404040" rangeColor="#0AC97A"  />
        <Knob value={knob6Value} size={50} onChange={(e) => setKnob6Value(e.value)} valueColor="#404040" rangeColor="#0AC97A"  />
        <Knob value={knob7Value} size={50} onChange={(e) => setKnob7Value(e.value)} valueColor="#404040" rangeColor="#0AC97A"  />
        <Knob value={knob8Value} size={50} onChange={(e) => setKnob8Value(e.value)} valueColor="#404040" rangeColor="#0AC97A"  />
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={volumeRight}
          step="1"
          onChange={handleVolumeRightChange}
          className="volume-controller"
        />
      </div>
    </div>
  );
}

export default Controller;
