import { guess } from 'web-audio-beat-detector';

class AudioLogic {

  constructor() {
    this.audioContext = new AudioContext();
    this.isPlaying = false;
    this.audioBufferLeft = null;
    this.audioBufferRight = null;
    this.audioBufferList = [];

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
  }

  loadAudio(url) {
    return fetch(url)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => this.audioContext.decodeAudioData(arrayBuffer));
  }

  //load audio from file upload
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
   * Plays the audio context if it is not already playing.
   */
  play() {
    // Start the audio context if not already running
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }

    this.isPlaying = true;
  }

  /**
   * Pauses the audio context if it is playing.
   */
  pause() {
    this.isPlaying = false;
  }

  /**
   * Returns the BPM & offset of the audio source.
   * @param {*} audioSource 
   * @returns promise that resolves to an object with bpm and offset properties
   */
  getBPM(audioSource) {
    return guess(audioSource);
  }

  setAudioBuffer(audioBuffer, channel) {
    return new Promise((resolve, reject) => {
      console.log("Setting audio buffer");
      if (channel === "left") {
        this.audioBufferLeft = audioBuffer;
        console.log(this.audioBufferLeft);
        resolve();
      } else {
        this.audioBufferRight = audioBuffer;
        console.log(this.audioBufferRight);
        resolve();
      }
    });
  }

  getAudioBuffer(channel) {
    if (channel === "left") {
      return this.audioBufferLeft;
    }
    return this.audioBufferRight;
  }

  /**
   * Connects the audio source to the specified channel.
   * @param {*} source audio source to connect
   * @param {*} channel channel to connect to ("left" or "right")
   * @returns 
   */
  connectAudioSource(source, channel) {
    if (channel === "left") {
      source.connect(this.analyserNodeLeft);
      return;
    }
    source.connect(this.analyserNodeRight);
  }

  /**
   * Disconnects the audio source.
   * @param {*} source audio source to disconnect
   */
  disconnectAudioSource(source) {
    source.disconnect();
  }

  /**
   * Gets the song length in minutes and seconds.
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

  matchBpm(channel, source) {
    if (!this.audioBufferLeft || !this.audioBufferRight) {
      return Promise.resolve(null);
    }
  
    const targetBpmBuffer = channel === "left" ? this.audioBufferRight.buffer : this.audioBufferLeft.buffer;
    const sourceBpmBuffer = channel === "left" ? this.audioBufferLeft.buffer : this.audioBufferRight.buffer;
  
    const targetBpmPromise = this.getBPM(targetBpmBuffer);
    const sourceBpmPromise = this.getBPM(sourceBpmBuffer);
  
    return Promise.all([targetBpmPromise, sourceBpmPromise]).then(([targetBpmResult, sourceBpmResult]) => {
      const targetBpm = targetBpmResult.bpm;
      const sourceBpm = sourceBpmResult.bpm;
  
      const ratio = targetBpm / sourceBpm;
      source.playbackRate.value = ratio;
      return targetBpm;
    });
  }  
}
export default AudioLogic;
