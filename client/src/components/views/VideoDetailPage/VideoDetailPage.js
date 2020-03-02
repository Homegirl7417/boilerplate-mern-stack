import React, { useState, useEffect } from 'react'
import { List, Avatar, Row, Col } from 'antd';
import axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';
import Comment from './Sections/Comment';
import LikeDislikes from './Sections/LikeDislikes';

function VideoDatilPage(props) {
    const videoId = props.match.params.videoId;
    const variable = { videoId: videoId };
    const [VideoDetail, setVideoDetail] = useState([])
    const [Comments, setComments] = useState([])

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
        
        axios.post('/api/comment/getComments', variable)
            .then(response => {
                if(response.data.success) {
                    setComments(response.data.comments)
                    console.log("이 비디오의 모든 커맨트: ", response.data.comments)
                } else {
                    alert('이 비디오의 모든 커맨트 가져오기 실패');
                }
            })
    }, [])

    const refreshFunction = (newComponent) => {
        setComments(Comments.concat(newComponent));
    }

    if(VideoDetail.writer) {
        const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId') && <Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')} />
        return (
            <Row gutter={[16, 16]}>
                    <Col lg={18} xs={24}>
                        <div className="postPage" style={{ width: '100%', padding: '3rem 4em' }}>
                            <video style={{ width: '100%' }} src={`http://localhost:5000/${VideoDetail.filePath}`} controls />
    
                            <List.Item
                                actions={[ <LikeDislikes video userId={localStorage.getItem('userId')} videoId={videoId} />, subscribeButton ]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={VideoDetail.writer.image}/>}
                                    title={VideoDetail.writer.name}
                                    description={VideoDetail.description}
                                />
    
                            </List.Item>
                            
                            <Comment refreshFunction={refreshFunction} commentLists={Comments} postId={videoId}/>
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
