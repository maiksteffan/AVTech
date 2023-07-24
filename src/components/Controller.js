import "./Controller.css";
import { useState, useContext } from "react";
import { AudioLogicContext } from "./../logic/AudioLogicContext";
import { Knob } from "react-rotary-knob";
import * as skins from "react-rotary-knob-skin-pack";

/**
 * Component for the controller
 */
function Controller(props) {
  //State variable for crossfade slider
  const [crossfade, setCrossfade] = useState(0.5);

  //State variables for values of volume sliders
  const [volumeLeft, setVolumeLeft] = useState(0.5);
  const [volumeRight, setVolumeRight] = useState(0.5);

  //State variables for values of left filters
  const [highPassFilterLeft, setHighPassFilterLeft] = useState(0);
  const [midPassFilterLeft, setMidPassFilterLeft] = useState(0);
  const [lowPassFilterLeft, setLowPassFilterLeft] = useState(0);
  const [knob1Value, setKnob4Value] = useState(0);

  //State variables for values of right filters
  const [highPassFilterRight, setHighPassFilterRight] = useState(0);
  const [midPassFilterRight, setMidPassFilterRight] = useState(0);
  const [lowPassFilterRight, setLowPassFilterRight] = useState(0);
  const [knob3Value, setKnob5Value] = useState(0);

  //Knob skin see http://react-rotary-knob-skins-preview.surge.sh for all available skins
  const skin = skins.s10;

  //make audioLogic available
  const audioLogic = useContext(AudioLogicContext);

  /**
   * Function that handles the change of the crossfade slider
   * @param {*} event Event that is triggered when the crossfade slider is changed
   */
  function handleCrossfadeChange(event) {
    props.setCrossfade(event.target.value);
    setCrossfade(event.target.value);
    audioLogic.crossfade(event.target.value);
    setVolumeLeft(1 - event.target.value);
    setVolumeRight(event.target.value);
  }

  /**
   * Function that handles the change of the volume slider
   * @param {*} event Event that is triggered when the volume slider is changed
   */
  function handleVolumeLeftChange(event) {
    setVolumeLeft(event.target.value);
    audioLogic.gainNodeLeft.gain.value = event.target.value;
  }

  /**
   * Function that handles the change of the volume slider
   * @param {*} event Event that is triggered when the volume slider is changed
   */
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
          max="1"
          value={crossfade}
          step="0.01"
          onChange={handleCrossfadeChange}
          className="cross-fader"
        />
      </div>
      <div className="controller-bottom">
        <input
          type="range"
          min="0"
          max="1"
          value={volumeLeft}
          step="0.01"
          onChange={handleVolumeLeftChange}
          className="volume-controller"
        />
        <div className="flex flex-row items-center justify-center gap-x-2">
          <div className="flex-col items-center justify-center">
            <Knob
              onChange={(value) => {
                audioLogic.setLowPassGain("left", value);
                setLowPassFilterLeft(value);
              }}
              min={-10}
              max={10}
              value={lowPassFilterLeft}
              skin={skin}
              preciseMode={false}
              className="mt-[10px]"
              clampMin={180}
            />
            <Knob
              onChange={(value) => {
                audioLogic.setMidPassGain("left", value);
                setMidPassFilterLeft(value);
              }}
              min={-10}
              max={10}
              value={midPassFilterLeft}
              skin={skin}
              preciseMode={false}
              className="mt-[10px]"
            />
            <Knob
              onChange={(value) => {
                audioLogic.setHighPassGain("left", value);
                setHighPassFilterLeft(value);
              }}
              min={-10}
              max={10}
              value={highPassFilterLeft}
              skin={skin}
              preciseMode={false}
              className="mt-[10px]"
            />
            <Knob
              onChange={(value) => {
                audioLogic.setHighPassGain("left", value);
                setHighPassFilterLeft(value);
              }}
              min={-10}
              max={10}
              value={highPassFilterLeft}
              skin={skin}
              preciseMode={false}
              className="mt-[10px]"
            />
          </div>
          <div className="flex-col items-center justify-center gap-10">
            <Knob
              onChange={(value) => {
                audioLogic.setLowPassGain("right", value);
                setLowPassFilterRight(value);
              }}
              min={-10}
              max={10}
              value={lowPassFilterRight}
              skin={skin}
              preciseMode={false}
              className="mt-[10px]"
            />
            <Knob
              onChange={(value) => {
                audioLogic.setMidPassGain("right", value);
                setMidPassFilterRight(value);
              }}
              min={-10}
              max={10}
              value={midPassFilterRight}
              skin={skin}
              preciseMode={false}
              className="mt-[10px]"
            />
            <Knob
              onChange={(value) => {
                audioLogic.setHighPassGain("right", value);
                setHighPassFilterRight(value);
              }}
              min={-10}
              max={10}
              value={highPassFilterRight}
              skin={skin}
              preciseMode={false}
              className="mt-[10px]"
            />
            <Knob
              onChange={(value) => {
                audioLogic.setHighPassGain("right", value);
                setHighPassFilterRight(value);
              }}
              min={-10}
              max={10}
              value={highPassFilterRight}
              skin={skin}
              preciseMode={false}
              className="mt-[10px]"
            />
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          value={volumeRight}
          step="0.01"
          onChange={handleVolumeRightChange}
          className="volume-controller"
        />
      </div>
    </div>
  );
}

export default Controller;
