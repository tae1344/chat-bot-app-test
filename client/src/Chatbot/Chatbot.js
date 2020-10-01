import Axios from 'axios';
import { func } from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveMessage } from '../_actions/message_actions';
import Message from './Sections/Message';
import { List, Icon, Avatar } from 'antd';
import Card from "./Sections/Card";

function Chatbot() {
    const dispatch = useDispatch();
    const messageFromRedux = useSelector(state => state.message.messages);

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

            for (let content of response.data.fulfillmentMessages) {
                conversation = {
                    who: 'bot',
                    content: content
                }
                dispatch(saveMessage(conversation))
            }

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

            for (let content of response.data.fulfillmentMessages) {

                let conversation = {
                    who: 'bot',
                    content: content
                }
                dispatch(saveMessage(conversation))
            }
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

    const renderCard = (cards) => {
        return cards.map((card, i) => <Card key={i} cardInfo={card.structValue} />)
    }

    const renderOneMessage = (message, i) => {
        console.log('message', message);

        // We need to give some condition here to separate message kinds

        // template for normal text
        if (message.content && message.content.text && message.content.text.text) {
            return <Message key={i} who={message.who} text={message.content.text.text} />
        } else if (message.content && message.content.payload.fields.card) {

            const AvatarSrc = message.who === 'bot' ? <Icon type="robot" /> : <Icon type="smile" />

            return <div>
                <List.Item style={{ padding: '1rem' }}>
                    <List.Item.Meta
                        avatar={<Avatar icon={AvatarSrc} />}
                        title={message.who}
                        description={renderCard(message.content.payload.fields.card.listValue.values)}
                    />
                </List.Item>

            </div>
        }


        // template for card message







    }

    const renderMessage = (returnedMessages) => {
        if (returnedMessages) {
            return returnedMessages.map((message, i) => {
                return renderOneMessage(message, i);
            })
        } else {
            return null;
        }
    }

    return (
        <div style={{
            height: 700, width: 700,
            border: '3px solid black', borderRadius: '7px'
        }}>
            <div style={{ height: 644, width: '100%', overflow: 'auto' }}>

                {renderMessage(messageFromRedux)}

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