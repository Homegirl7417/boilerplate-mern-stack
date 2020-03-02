import React, { useEffect, useState } from 'react'
import { Tooltip, Icon } from 'antd';
import axios from 'axios';

function LikeDislikes(props) {
    const [Likes, setLikes] = useState(0)
    const [Dislikes, setDislikes] = useState(0)
    const [LikeAction, setLikeAction] = useState(null)
    const [DislikeAction, setDislikeAction] = useState(null)
    
    let variable = { }
    if(props.video) {
        variable = { videoId: props.videoId , userId: props.userId  }
    } else {
        variable = { commentId: props.commentId , userId: props.userId }
    }

    useEffect(() => {
        axios.post('/api/like/getLikes', variable)
                .then(response => {
                    if (response.data.success) {
                        //얼마나 많은 좋아요를 받았는지
                        setLikes(response.data.likes.length)

                        //내가 좋아요를 눌렀는지
                        response.data.likes.map(like => {
                            if (like.userId === props.userId) {
                                setLikeAction('liked')
                            }
                        })    
                    } else {
                        alert('라이크 얻기 실패')
                    }
                })
        axios.post('/api/like/getDislikes', variable)
                .then(response => {
                    if (response.data.success) {
                        //얼마나 많은 싫어요를 받았는지
                        setDislikes(response.data.dislikes.length)

                        //내가 싫어요를 눌렀는지
                        response.data.dislikes.map(dislike => {
                            if (dislike.userId === props.userId) {
                                setDislikeAction('disliked')
                            }
                        })    
                    } else {
                        alert('싫어요 얻기 실패')
                    }
                })


    }, [])

    const onLike = () => {
        
        if(LikeAction === null ) {
            //내가 아직 좋아요를 누르지 않은 상황
            //like를 하나 올려줘야 함
            axios.post('/api/like/upLike', variable)
                .then(response => {
                    if(response.data.success) {
                        setLikes(Likes + 1);
                        setLikeAction('liked');

                        if(DislikeAction !== null) {
                            //Dislike이 클릭되어있던 상황
                            setDislikeAction(null)
                            setDislikes(Dislikes - 1);
                        } 
                    } else {
                        alert('Like를 올리지 못했습니다.')
                    }
                })
        } else {

            //내가 좋아요를 이전에 누른 상황.
            //내가 누른 좋아요를 지워야함.
            axios.post('/api/like/unLike', variable)
                .then(response => {
                    if(response.data.success) {
                        setLikes(Likes - 1);
                        setLikeAction(null);
                    } else {
                        alert('Like를 내리지 못했습니다.')
                    }
                })
        }
    }

    const onDislike = () => {
        if(DislikeAction  !== null) {
            //이미 싫어요가 클릭 되어있는 상태.
            //싫어요를 클릭을 해제해야 하는 상황.
            axios.post('/api/like/unDislike', variable)
                .then(response => {
                    if(response.data.success) {
                        setDislikes(Dislikes - 1);
                        setDislikeAction(null);
                    } else {
                        alert('dislike를 지우지 못했습니다.')
                    }
                })
            
        } else {
            //Dislike 버튼이 클릭이 되지 않은 상황에서
            //Dislike을 클릭했을때
            axios.post('/api/like/upDislike', variable)
                .then(response => {
                    if(response.data.success) {
                        setDislikes(Dislikes + 1);
                        setDislikeAction('disliked');

                        if(DislikeAction !== null) {
                            //Like이 클릭되어있던 상황
                            setLikeAction(null)
                            setLikes(Likes - 1);
                        } 
                    } else {
                        alert('dislike를 하지 못했습니다.')
                    }
            })

        }
    }

    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon 
                        type="like"
                        theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
                        onClick={onLike} />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{Likes}</span>
            </span>&nbsp;&nbsp;

            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    <Icon
                        type="dislike"
                        theme={DislikeAction === 'disliked' ? 'filled' : 'outlined'}
                        onClick={onDislike}
                    />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{Dislikes}</span>
            </span>
        </div>
    )
}

export default LikeDislikes
