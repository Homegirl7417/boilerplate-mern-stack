import React, { useEffect, useState } from 'react'
import SingleComment from './SingleComment';

function ReplyComment(props) {
    const [ChildCommentNumber, setChildCommentNumber] = useState(0);

    useEffect(() => {

        let commentNumber = 0;
        props.CommentLists.map((comment) => {

            if (comment.responseTo === props.parentCommentId) {
                commentNumber++
            }
        })
        setChildCommentNumber(commentNumber)
    }, [])

    let renderReplyComment = (parentCommentId) => (
        props.CommentLists.map((comment, index) => (
            <React.Fragment>
                {comment.responseTo === parentCommentId &&
                    <div style={{ width: '80%', marginLeft: '40px' }}>
                        <SingleComment comment={comment} postId={props.postId} refreshFunction={props.refreshFunction} />
                        <ReplyComment CommentLists={props.CommentLists}  parentCommentId={comment._id} postId={props.videoId}/>
                    </div>
                }
            </React.Fragment>
        ))
    )

    return (
        <div>
            {ChildCommentNumber > 0 &&
                <p 
                    style={{ fontSize: '14px', margin: 0, color: 'gray' }}
                    onClick
                >
                    View {ChildCommentNumber} more comment(s)
                </p>
            }
            {renderReplyComment(props.parentCommentId)}
        </div>
    )
}

export default ReplyComment;
