const express = require('express');
const router = express.Router();

const { Subscriber } = require('../models/Subscriber');


//=================================
//             Subscribe
//=================================


router.post('/subscriberNumber', (req, res) => {
   //(로그인한 사람의 아이디=userTo)를 req로 받음
   Subscriber.find({ 'userTo': req.body.userTo })
    .exec((err, subscribe) => {
        //로그인한 사람을 구독하고 있는 사람들이 배열로 나옴 = subscribe
        //그 배열의 수가 구독자수
        if(err) return res.status(400).send(err);
        return res.status(200).json({ success: true, subscriberNumber: subscribe.length })
    })
});

router.post('/subscribed', (req, res) => {
    //(로그인한 사람의 아이디=userTo)를 req로 받음
    Subscriber.find({ 'userTo': req.body.userTo, 'userFrom': req.body.userFrom })
     .exec((err, subscribe) => {
         //subscribe length가 1이면 구독. 0이면 구독 아님.
         if(err) return res.status(400).send(err);
         let result = false;
         if(subscribe.length !== 0) {
             result = true;
         }
         res.status(200).json({ success: true, subscribed: result })
     })
 });

 router.post('/subscribe', (req, res) => {
    //구독 시도. 데이터 베이스에 구독 정보 저장.
    const subscribe = new Subscriber(req.body);
    subscribe.save((err, doc) => {
        if(err) return res.json({ success: false, err })
        res.status(200).json({ success: true })
    })
    
 });

 router.post('/unSubscribe', (req, res) => {
    // 구독 취소. 데이터 베이스에서 내 id 삭제. 
    Subscriber.findOneAndDelete({ userTo: req.body.userTo, userFrom: req.body.userFrom })
        .exec((err, doc) => {
            if(err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true, doc })
        });
 });

module.exports = router;