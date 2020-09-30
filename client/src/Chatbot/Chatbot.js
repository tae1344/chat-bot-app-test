import Axios from 'axios';
import { func } from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react';
import { saveMessage } from '../_actions/message_actions';

function Chatbot() {
    const dispatch = useDispatch();

    useEffect(() => {
        eventQuery('welcomeToMyWebsite')
    }, [])


    const textQuery = async (text) => {

        // 입력한 메세지를 처리
        let conversation = {
            who: 'user',
            content: {
                text: {
                    text: text
                }
            }
        }

        dispatch(saveMessage(conversation))

        // 메세지에 대한 챗봇의 응답 처리
        const textQueryVariables = {
            text: text
        }

        try {
            //textQuery route 요청
            const response = await Axios.post('/api/dialogflow/textQuery', textQueryVariables)
            const content = response.data.fulfillmentMessages[0]

            conversation = {
                who: 'bot',
                content: content
            }
            dispatch(saveMessage(conversation))

        } catch (error) {
            conversation = {
                who: 'bot',
                content: {
                    text: {
                        text: "Error just occured, please check the problem"
                    }
                }
            }
            dispatch(saveMessage(conversation))
        }


    }


    const eventQuery = async (event) => {

        // 메세지에 대한 챗봇의 응답 처리
        const eventQueryVariables = {
            event
        }

        try {
            //textQuery route 요청
            const response = await Axios.post('/api/dialogflow/eventQuery', eventQueryVariables)
            const content = response.data.fulfillmentMessages[0]

            let conversation = {
                who: 'bot',
                content: content
            }
            dispatch(saveMessage(conversation))

        } catch (error) {
            let conversation = {
                who: 'bot',
                content: {
                    text: {
                        text: "Error just occured, please check the problem"
                    }
                }
            }
            dispatch(saveMessage(conversation))
        }


    }

    const keyPressHandler = (e) => {
        if (e.key === "Enter") {
            if (!e.target.value) {
                return alert('you need to type something first')
            }

            // we will send request to text query to route
            textQuery(e.target.value)

            e.target.value = "";
        }
    }

    return (
        <div style={{
            height: 700, width: 700,
            border: '3px solid black', borderRadius: '7px'
        }}>
            <div style={{ height: 644, width: '100%', overflow: 'auto' }}>

            </div>

            <input
                style={{
                    margin: 0, width: '100%', height: 50,
                    borderRadius: '4px', padding: '5px', fontSize: '1rem'
                }}
                placeholder="Send a message..."
                onKeyPress={keyPressHandler}
                type="text"
            />
        </div>
    )
}

export default Chatbot;