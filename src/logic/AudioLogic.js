import { guess } from 'web-audio-beat-detector';

class AudioLogic {
  constructor() {
    this.audioContext = new AudioContext();
    this.isPlaying = false;

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

  play() {
    // Start the audio context if not already running
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }

    this.isPlaying = true;
  }

  pause() {
    this.isPlaying = false;
  }

  getBPM(audioSource) {
    return guess(audioSource);
  }

  connectAudioSource(source, channel) {
    if (channel === "left") {
      source.connect(this.analyserNodeLeft);
      return;
    }
    source.connect(this.analyserNodeRight);
  }

  disconnectAudioSource(source) {
    source.disconnect();
  }
}
export default AudioLogic;
