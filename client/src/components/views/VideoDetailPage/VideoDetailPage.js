import React, { useState, useEffect } from 'react'
import { List, Avatar, Row, Col } from 'antd';
import axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';

function VideoDatilPage(props) {
    const videoId = props.match.params.videoId;
    const variable = { videoId: videoId };
    const [VideoDetail, setVideoDetail] = useState([])

    useEffect(() => {
        axios.post('/api/video/getVideoDetail', variable)
            .then(response => {
                if(response.data.success) {
                    console.log("비디오 가져오기 성공: ", response.data);
                    setVideoDetail(response.data.videoDetail);
                } else {
                    alert('비디오 가져오기 실패');
                }
            })
    }, [])

    if(VideoDetail.writer) {
        return (
            <Row gutter={[16, 16]}>
                    <Col lg={18} xs={24}>
                        <div className="postPage" style={{ width: '100%', padding: '3rem 4em' }}>
                            <video style={{ width: '100%' }} src={`http://localhost:5000/${VideoDetail.filePath}`} controls />
    
                            <List.Item
                                actions={[<Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')} />]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={VideoDetail.writer.image}/>}
                                    title={VideoDetail.writer.name}
                                    description={VideoDetail.description}
                                />
    
                            </List.Item>
    
                            {/* commnet */}
    
                        </div>
                    </Col>
                    <Col lg={6} xs={24}>
                        <SideVideo />
                       
                    </Col>
                </Row>
        );
    } else {
        return (
            <div>Loading...</div>
        );
    }
    
}

export default VideoDatilPage;
