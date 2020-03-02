import React, { useEffect, useState } from 'react';
import axios from 'axios';


function SideVideo() {
    const [sideVideos, setsideVideos] = useState([])

    //모든 비디오를 가져온다.
    useEffect(() => {
        axios.get('/api/video/getVideos')
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.videos)
                    setsideVideos(response.data.videos)
                } else {
                    alert('Failed to get Videos')
                }
            })
    }, [])

    const renderSideVideo = sideVideos.map((video, index) => {
        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor(video.duration - minutes * 60);

        return (
            <div key={index} style={{ display: 'flex', marginTop: '1rem', padding: '0 2rem' }}>
                <div style={{ width:'40%', marginRight:'1rem' }}>
                    <a href={`/video/${video._id}`} style={{ color:'gray' }}>
                        <img style={{ width: '100%' }} src={`http://localhost:5000/${video.thumbnail}`} alt="thumbnail" />
                    </a>
                </div>

                <div style={{ width:'50%' }}>
                    <a href={`/video/${video._id}`} style={{ color:'gray' }}>
                        <span style={{ fontSize: '1rem', color: 'black' }}>{video.title}  </span><br />
                        <span>{video.writer.name}</span><br />
                        <span>{video.views} views</span><br />
                        <span>{minutes} : {seconds}</span><br />
                    </a>
                </div>
            </div>
        );
    })

    return (
        <React.Fragment>
             <div style={{ marginTop:'3rem' }} />
            {renderSideVideo}
        </React.Fragment>
    )
}

export default SideVideo;
