import React, { useState } from 'react'
import { Button, Input } from 'antd';
import { useSelector } from 'react-redux';
import axios from 'axios';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

const { TextArea } = Input;

function Comment(props) {
    const videoId = props.postId;
    const user = useSelector(state => state.user);
    const [commentValue, setcommentValue] = useState("");

    const handleChange = (e) => {
        setcommentValue(e.currentTarget.value);
    }
    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            content: commentValue,
            writer: user.userData._id,
            postId: videoId
        }
        axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if(response.data.success) {
                    console.log("코맨트 등록 성공: ", response.data.result)
                    props.refreshFunction(response.data.result)
                    setcommentValue("")
                } else {
                    alert('코맨트 등록 실패')
                }
            })
    }

     return (
        <div>
            <br />
            <p> replies</p>
            <hr />
            {console.log("커맨드.js의 커맨드리스트: ", props.commentLists)}
            {/* Comment Lists  */}
            {props.commentLists && props.commentLists.map((comment, index) => (
                (!comment.responseTo &&
                    <React.Fragment>
                        <SingleComment refreshFunction={props.refreshFunction} key={index} comment={comment} postId={videoId} />
                        <ReplyComment parentCommentId={comment._id} CommentLists={props.commentLists} postId={videoId} refreshFunction={props.refreshFunction}/>
                    </React.Fragment> 
                )
            ))}

            {/* Root Comment Form */}
            <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                <TextArea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleChange}
                    value={commentValue}
                    placeholder="코맨트를 작성해주세요."
                />
                <br />
                <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</Button>
            </form>

        </div>
    )
}

export default Comment
