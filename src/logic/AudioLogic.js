import { guess } from 'web-audio-beat-detector';
import { PitchShifter } from 'soundtouchjs';
import { parse } from '@fortawesome/fontawesome-svg-core';

/**
 * Class that handles the audio logic.
 */
class AudioLogic {

  constructor() {
    this.audioContext = new AudioContext();
    this.audioBufferLeft = null;
    this.audioBufferRight = null;
    this.audioBufferList = [];
    this.shifterLeft = null;
    this.shifterRight = null;

    // Create a gain node for each channel and connect them to the destination
    this.gainNodeLeft = this.audioContext.createGain();
    this.gainNodeRight = this.audioContext.createGain();
    this.gainNodeLeft.connect(this.audioContext.destination);
    this.gainNodeRight.connect(this.audioContext.destination);

    // Create analyzer nodes for each channel and connect them to the gain nodes
    this.analyserNodeLeft = this.audioContext.createAnalyser();
    this.analyserNodeRight = this.audioContext.createAnalyser();
    this.analyserNodeLeft.connect(this.gainNodeLeft);
    this.analyserNodeRight.connect(this.gainNodeRight);

    //Filter setup
    this.filterHighLeft = this.audioContext.createBiquadFilter();
    this.filterHighLeft.type = "highshelf";
    this.filterMidLeft = this.audioContext.createBiquadFilter();
    this.filterMidLeft.type = "peaking";
    this.filterLowLeft = this.audioContext.createBiquadFilter();
    this.filterLowLeft.type = "lowshelf";
    this.filterHighLeft.connect(this.filterMidLeft);
    this.filterMidLeft.connect(this.filterLowLeft);
    this.filterLowLeft.connect(this.analyserNodeLeft);

    this.filterHighRight = this.audioContext.createBiquadFilter();
    this.filterHighRight.type = "highshelf";
    this.filterMidRight = this.audioContext.createBiquadFilter();
    this.filterMidRight.type = "peaking";
    this.filterLowRight = this.audioContext.createBiquadFilter();
    this.filterLowRight.type = "lowshelf";
    this.filterHighRight.connect(this.filterMidRight);
    this.filterMidRight.connect(this.filterLowRight);
    this.filterLowRight.connect(this.analyserNodeRight);

    this.setLowPassGain = this.setLowPassGain.bind(this);
    this.setMidPassGain = this.setMidPassGain.bind(this);
    this.setHighPassGain = this.setHighPassGain.bind(this);
  }

  /**
   * Function that loads an audio file and coverts it to an audio buffer, which is then stored in the audio buffer list.
   * @param {*} file audio file to load
   */
  loadAudioFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        this.audioContext.decodeAudioData(reader.result).then((audioBuffer) => {
          const fileNameWithoutFormat = file.name.split('.').slice(0, -1).join('.');
          this.audioBufferList.push({buffer: audioBuffer, name: fileNameWithoutFormat});
          resolve(audioBuffer);
          if (this.audioBufferLeft === null) {
          this.setAudioBuffer({buffer: audioBuffer, name: fileNameWithoutFormat}, "left");
          } else if (this.audioBufferRight === null) {
            this.setAudioBuffer({buffer: audioBuffer, name: fileNameWithoutFormat}, "right");
          }
        });
      };
      reader.onerror = reject;
    });
  }

  /**
   * Connects the audio source to the specified channel.
   * @param {*} source audio source to connect
   * @param {*} channel channel to connect to ("left" or "right")
   */
  connectShifter(channel) {
    if (channel === "left" && this.audioBufferLeft !== null) {
      this.shifterLeft = new PitchShifter(this.audioContext, this.audioBufferLeft.buffer, 1024);
      this.shifterLeft.tempo = 1;
      this.shifterLeft.pitch = 1;
    } else if (channel === "right" && this.audioBufferRight !== null) {
      this.shifterRight = new PitchShifter(this.audioContext, this.audioBufferRight.buffer, 1024);
      this.shifterRight.tempo = 1;
      this.shifterRight.pitch = 1;
    }
  }

  /**
   * Function that sets the audio buffer for the specified channel.
   * @param {*} audioBuffer audio buffer to set
   * @param {*} channel channel to set the audio buffer for ("left" or "right")
   */
  setAudioBuffer(audioBuffer, channel) {
    return new Promise((resolve) => {
      if (channel === "left") {
        this.audioBufferLeft = audioBuffer;
      } else {
        this.audioBufferRight = audioBuffer;
      }
      resolve();
    });
  }
  isLoaded(channel) {
    return channel === "left" ? this.audioBufferLeft !== null : this.audioBufferRight !== null;
  }

  /**
   * Setter for high pass filter gain
   * @param {*} channel channel to change the filter gain of ("left" or "right")
   * @param {*} value target gain value
   */
  setHighPassGain(channel, value) {
    const filter = channel === "left" ? this.filterMidLeft : this.filterMidRight;
    filter.gain.value = value;
  }

  /**
   * Setter for mid pass filter gain
   * @param {*} channel channel to change the filter gain of ("left" or "right")
   * @param {*} value target gain value
   */
  setMidPassGain(channel, value) {
    const filter = channel === "left" ? this.filterMidLeft : this.filterMidRight;
    filter.gain.value = value;
  }

  /**
   * Setter for low pass filter gain
   * @param {*} channel channel to change the filter gain of ("left" or "right")
   * @param {*} value target gain value
   */
  setLowPassGain(channel, value) {
    const filter = channel === "left" ? this.filterLowLeft : this.filterLowRight;
    filter.gain.value = value;
  }

  /**
   * Function thats plays the song on the specified channel.
   * @param {*} channel channel to play the song on ("left" or "right")
   */
  playSong(channel) {
    if (channel === "left") {
      this.shifterLeft.connect(this.filterHighLeft);
      return;
    }
    this.shifterRight.connect(this.filterHighRight);
  }

  /**
   * Function that pauses the song on the specified channel.
   * @param {*} channel channel to pause the song on ("left" or "right")
   */
  pauseSong(channel) {
    const shifter = channel === "left" ? this.shifterLeft : this.shifterRight;
    shifter.disconnect();
  }

  /**
   * Crossfades between the left and right channels.
   * @param {*} value value between 0 and 1 (0 = left, 1 = right)
   */
  crossfade(value) {
    // Use an equal-power crossfading curve:
    const gain1 = Math.cos(value * 0.5 * Math.PI);
    const gain2 = Math.cos((1.0 - value) * 0.5 * Math.PI);
    this.gainNodeLeft.gain.value = gain1;
    this.gainNodeRight.gain.value = gain2;
  }

  /**
   * Function that matches the BPM of the source to the target.
   * @param {*} channel channel to match the BPM of ("left" or "right")
   * @param {*} source audio source to match the BPM of
   * @returns a promise that resolves to the updated BPM
   */
  matchBpm(channel) {
    if (!this.audioBufferLeft || !this.audioBufferRight) {
      return Promise.resolve(null);
    }

    const targetBpmBuffer = channel === "left" ? this.audioBufferRight.buffer : this.audioBufferLeft.buffer;
    const sourceBpmBuffer = channel === "left" ? this.audioBufferLeft.buffer : this.audioBufferRight.buffer;
    const targetBpmPromise = guess(targetBpmBuffer);
    const sourceBpmPromise = guess(sourceBpmBuffer);

    return Promise.all([targetBpmPromise, sourceBpmPromise]).then(([targetBpmResult, sourceBpmResult]) => {
      const targetBpm = targetBpmResult.bpm;
      const sourceBpm = sourceBpmResult.bpm;
      const ratio = targetBpm / sourceBpm;

      if (channel === "left") {
        this.shifterLeft.tempo = ratio;
      } else {
        this.shifterRight.tempo = ratio;
      }
      return targetBpm;
    });
  }

  /**
   * Function that resets the BPM of the specified channel to 1.
   * @param {*} channel channel to reset the BPM of ("left" or "right")
   */
  resetBpm(channel) {
    if (channel === "left") {
      this.shifterLeft.tempo = 1;
    } else {
      this.shifterRight.tempo = 1;
    }
  }

  /**
   * Gets the song length in minutes and seconds for the specified buffer.
   * @param {*} audioBuffer
   * @returns a string with the length in the format "minutes:seconds"
   */
  getSongLength(audioBuffer) {
    let duration = audioBuffer.duration;
    let minutes = Math.floor(duration / 60);
    let seconds = Math.floor(duration % 60);
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return minutes + ":" + seconds;
  }

  /**
   * Gets the song length in minutes and seconds for the specified channel.
   * @param {*} channel channel to get the song length from ("left" or "right")
   * @returns a string with the length in the format "minutes:seconds"
   */
  getSongLengthChannel(channel) {
    const buffer = channel === "left" ? this.audioBufferLeft.buffer : this.audioBufferRight.buffer;
    return this.getSongLength(buffer);
  }

   /**
   * Returns the BPM & offset of the audio buffer.
   * @param {*} audioBuffer audio buffer to get the BPM & offset from
   * @returns promise that resolves to an object with bpm and offset properties
   */
   getBPM(channel) {
    const buffer = channel === "left" ? this.audioBufferLeft : this.audioBufferRight;
    return guess(buffer.buffer);
  }

  getAnalyser(chanel){
    const analyser = chanel === "left"? this.analyserNodeLeft : this.analyserNodeRight;
    return analyser;
  }

  getAudioBuffer(channel){
    const buffer = channel === "left" ? this.audioBufferLeft : this.audioBufferRight;
    return buffer.buffer;
  }
}
export default AudioLogic;
