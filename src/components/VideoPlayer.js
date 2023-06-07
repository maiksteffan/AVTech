import './VideoPlayer.css'

function VideoPlayer(props){
    return (
        <div className="video-container">
            <video src={props.videoUrl} muted autoPlay loop></video>
        </div>
    )
}

export default VideoPlayer;

