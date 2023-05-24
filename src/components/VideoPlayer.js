import './VideoPlayer.css'

function VideoPlayer(props){
    return (
        <div className="video-container">
            <video src={props.videoUrl}></video>
        </div>
    )
}

export default VideoPlayer;

