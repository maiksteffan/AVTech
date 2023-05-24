import VideoPlayerStyles from './VideoPlayer.module.css'

function VideoPlayer(){
    return (
        <div className="video-container">
            <video src={props.videoUrl}></video>
        </div>
    )
}

export default VideoPlayer;

