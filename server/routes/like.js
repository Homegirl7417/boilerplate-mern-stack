const express = require('express');
const router = express.Router();
const { Like } = require("../models/Like");
const { Dislike } = require("../models/Dislike");

const { auth } = require("../middleware/auth");

//=================================
//             Likes DisLikes
//=================================

router.post("/getLikes", (req, res) => {

    let variable = {}
    if (req.body.videoId) {
        variable = { videoId: req.body.videoId }
    } else {
        variable = { commentId: req.body.commentId }
    }

    Like.find(variable)
        .exec((err, likes) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({ success: true, likes })
        })
})

router.post("/getDislikes", (req, res) => {

    let variable = {}
    if (req.body.videoId) {
        variable = { videoId: req.body.videoId }
    } else {
        variable = { commentId: req.body.commentId }
    }

    Dislike.find(variable)
        .exec((err, dislikes) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({ success: true, dislikes })
        })
})

router.post("/upLike", (req, res) => {
    let variable = {}
    if (req.body.videoId) {
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {
        variable = { commentId: req.body.commentId, userId: req.body.userId }
    }

    // Like collection에다가 클릭 정보를 넣어 준다.
    const like = new Like(variable);
    like.save((err, likeResult) => {
        if(err) return res.json({ success: false, err })

        // 만약 Dislike가 이미 클릭 되어있다면, Dislike를 1 줄여준다.
        Dislike.findOneAndDelete(variable)
            .exec((err, disLikeResult) => {
                if(err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true })
            })
    })

})

router.post("/unLike", (req, res) => {
    let variable = {}
    if (req.body.videoId) {
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {
        variable = { commentId: req.body.commentId, userId: req.body.userId }
    }

    // Like 정보를 지워준다.
    Like.findOneAndDelete(variable)
    .exec((err, result) => {
        if(err) return res.status(400).json({ success: false, err })
        res.status(200).json({ sucess: true })
    })
})

router.post("/unDislike", (req, res) => {
    let variable = {}
    if (req.body.videoId) {
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {
        variable = { commentId: req.body.commentId, userId: req.body.userId }
    }

    // DIslike 정보를 지워준다.
    Dislike.findOneAndDelete(variable)
    .exec((err, result) => {
        if(err) return res.status(400).json({ success: false, err })
        res.status(200).json({ sucess: true })
    })
})

router.post("/upDislike", (req, res) => {
    let variable = {}
    if (req.body.videoId) {
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {
        variable = { commentId: req.body.commentId, userId: req.body.userId }
    }

    // DisLike collection에다가 클릭 정보를 넣어 준다.
    const dislike = new Dislike(variable);
    dislike.save((err, dislikeResult) => {
        if(err) return res.json({ success: false, err })

        // 만약 Like가 이미 클릭 되어있다면, Like를 1 줄여준다.
        Like.findOneAndDelete(variable)
            .exec((err, likeResult) => {
                if(err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true })
            })
    })

})

module.exports = router;