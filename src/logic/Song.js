/**
 * Class that represents a song.
 */
class Song {
    /**
     * Constructor for a song object.
     * @param {string} name Name of the song
     * @param {audioBuffer} buffer Audio buffer of the song
     * @param {*} video Video element of the song
     * @param {int} queuePoint Queue point of the song in seconds
     */
    constructor(name, buffer, video=null, queuePoint=0) {
        this.name = name; 
        this.buffer = buffer
        this.video = video;
        this.queuePoint = queuePoint;
    }
}
export default Song;