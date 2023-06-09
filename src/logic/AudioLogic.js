class AudioLogic {
  constructor() {
    this.audioContext = new AudioContext();
    this.isPlaying = false;

    // Create a gain node for each channel and connect them to the destination
    this.gainNodeLeft = this.audioContext.createGain();
    this.gainNodeRight = this.audioContext.createGain();
    this.gainNodeLeft.connect(this.audioContext.destination);
    this.gainNodeRight.connect(this.audioContext.destination);
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

  connectAudioSource(source, channel) {
    if (channel === "left") {
      source.connect(this.gainNodeLeft);
      return;
    }
    source.connect(this.gainNodeRight);
  }

  disconnectAudioSource(source) {
    source.disconnect();
  }
}
export default AudioLogic;
