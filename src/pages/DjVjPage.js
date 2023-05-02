import React from "react";
import mainStyle from "./DjVjPage.module.css";
import AudioPlayer from "../components/AudioPlayer";
import Slider from "../components/Slider";
import VideoPlayer from "../components/VideoPlayer";
import TrackList from "../components/TrackList";
import Settings from "../components/Settings";

export default function DJVJTool() {
    return (
        <div className={mainStyle.DJVJTool}>
            <div className={mainStyle.column}>
                <div className={`${mainStyle.box} ${mainStyle.audioPlayerA}`}>
                    <AudioPlayer/>
                </div>
                <div className={mainStyle.box}>
                    <TrackList/>
                </div>
            </div>
            <div className={mainStyle.column}>
                <div className={mainStyle.box}>
                    <VideoPlayer/>
                </div>
                <div className={mainStyle.box}>
                    <Slider/>
                </div>
                <div className={mainStyle.settings}>
                    <div className={mainStyle.box}>
                        <Settings/>
                    </div>
                    <div className={mainStyle.box}>
                        <Settings/>
                    </div>
                </div>
            </div>
            <div className={mainStyle.column}>
                <div className={`${mainStyle.box} ${mainStyle.audioPlayerB}`}>
                    <AudioPlayer/>
                </div>
                <div className={mainStyle.box}>
                    <TrackList/>
                </div>
            </div>
        </div>
    );
}
