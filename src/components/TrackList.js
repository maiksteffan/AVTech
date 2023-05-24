import TracklistStyles from './TrackList.module.css'

function Tracklist(props) {
  
    return (
      <div className="tracklist-container">
        <h2 className="tracklist-heading">Tracklist</h2>
        <ul>
          {props.songs.map((song, index) => (
            <li className="track" key={index}>{song.title} - {song.artist} - {song.length}</li>
          ))}
        </ul>
      </div>
    );
  }
  export default Tracklist;
