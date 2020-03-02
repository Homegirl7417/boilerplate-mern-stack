const express = require('express');
const router = express.Router();
const { Comment } = require('../models/Comment');


//=================================
//             Subscribe
//=================================


router.post('/saveComment', (req, res) => {
   
    //comment 내용을 Mongodb에 저장
    const comment = new Comment(req.body);
    comment.save((err, comment) => {
        if (err) return res.json({ success: false, err })
        Comment.find({ '_id': comment._id })
        .populate('writer')
        .exec((err, result) => {
            if (err) return res.json({ success: false, err })
            res.status(200).json({ success: true, result })
        })
    })
});


router.post("/getComments", (req, res) => {
    //데이터 베이스에서 이 포스트의 모든 커맨트 가져오기
    Comment.find({ "postId": req.body.videoId })
        .populate('writer')
        .exec((err, comments) => {
            if (err) return res.status(400).send(err)
            res.status(200).json({ success: true, comments })
        })

});

module.exports = router;