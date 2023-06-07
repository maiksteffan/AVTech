class AudioLogic {
    constructor() {
      this.audioContext = new AudioContext();
      this.isPlaying = false;
    }
  
    loadAudio(url) {
      return fetch(url)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer));
    }
  
    play() {
      // Start the audio context if it's not already running
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
  
      this.isPlaying = true;
    }
  
    pause() {
      this.isPlaying = false;
    }
  
    connectAudioSource(source) {
      source.connect(this.audioContext.destination);
    }
  
    disconnectAudioSource(source) {
      source.disconnect();
    }
  }  