import React, { useEffect, useState } from 'react'
import axios from 'axios';

function Subscribe(props) {
    const [SubscribeNumber, setSubscribeNumber] = useState(0); //구독자 수
    const [Subscribed, setSubscribed] = useState(false)//내가 구독하는지 여부

    useEffect(() => {
        // userTo는 구독자수, userFrom은 내가 구독 했는지 여부
        let variable = { userTo: props.userTo }
        let subscribedVariable = { userTo: props.userTo, userFrom: localStorage.getItem('userId') } 
        axios.post('/api/subscribe/subscriberNumber', variable)
            .then( response => {
                if(response.data.success) {
                    setSubscribeNumber(response.data.subscriberNumber);
                } else {
                    alert('구독자 수 가져오기 실패');
                }
            })

        axios.post('/api/subscribe/subscribed', subscribedVariable)
            .then( response => {
                if(response.data.success) {
                    setSubscribed(response.data.subscribed);
                } else {
                    alert('구독 여부 실패');
                }
            })
    }, [])
    const onSubsribe = () => {
        let subscribedVariable = {
            userTo: props.userTo,
            userFrom: props.userFrom
        }
        //이미 구독 중이라면
        if(Subscribed) {
            axios.post('/api/subscribe/unSubscribe', subscribedVariable)
                .then(response => {
                    if(response.data.success) {
                        setSubscribeNumber(SubscribeNumber - 1);
                        setSubscribed(!Subscribed)
                    } else {
                        alert('구독 취소 실패');
                    }
                })
        } else {
            //아직 구독 중이 아니라면
            axios.post('/api/subscribe/subscribe', subscribedVariable)
                .then(response => {
                    if(response.data.success) {
                        setSubscribeNumber(SubscribeNumber + 1);
                        setSubscribed(!Subscribed)
                    } else {
                        alert('구독 실패');
                    }
                })
        }
    }
    return (
        <div>
            <button 
            onClick={onSubsribe}
            style={{
                backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`,
                borderRadius: '4px', color: 'white',
                padding: '10px 16px', fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
            }}>
                {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    )
}

export default Subscribe;