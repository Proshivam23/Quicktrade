import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import './App.css';

function Chat() {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [cookies] = useCookies(['user']);
    const user = cookies.user;

    const location = useLocation();
    const data = location.state && location.state.someData;
    const [selectedChat, setSelectedChat] = useState(data);
    const [sendData, setSendData] = useState({
        content: '',
        sender: user.id,
        receiver: 0,
    });
    const [details, setDetails] = useState({});

    useEffect(() => {
        async function fetchMessages() {
            try {
                const response = await axios.get(`http://localhost:8081/getmessage/${selectedChat}`);
                setMessages(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        const messageInterval = setInterval(fetchMessages, 3000);

        return () => {
            clearInterval(messageInterval);
        };
    }, [selectedChat]);

    useEffect(() => {
        async function work() {
            try {
                const response = await axios.get(`http://localhost:8081/getmessage/${selectedChat}`);
                setMessages(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        const fetchMessagesInterval = setInterval(work, 3000);

        return () => {
            clearInterval(fetchMessagesInterval);
        };
    }, [sendData, selectedChat]);

    useEffect(() => {
        console.log(selectedChat);
        axios
            .get(`http://localhost:8081/getdetails/${selectedChat}`)
            .then((response) => {
                console.log(response.data);
                setDetails(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [selectedChat]);

    const handleInput = (e) => {
        setSendData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSendData({ ...sendData, receiver: selectedChat });
        axios
            .post('http://localhost:8081/handleSubmit', sendData)
            .then((response) => { })
            .catch((error) => {
                console.error('Error sending msg:', error);
            });

        // Reset the input field
        setSendData({ ...sendData, content: '' });
    };

    return (
        <div className="App">
            (isLoading?:<div></div>:
            <header className="bg-blue-500 text-white p-4">
                <h1 className="text-2xl font-bold">Chat</h1>
            </header>
            <div className="container mx-auto mt-10 p-4">
                <div className="chat-window bg-gray-200 rounded-lg shadow-md overflow-hidden">
                    <div className='bg-blue-600'>{details[0].username}</div>
                    <div className="chat-area h-48 p-4 overflow-y-scroll">
                        <div className="chat-messages space-y-2">
                            {messages.map((message, index) => (
                                <div className='flex flex-col'>
                                    {message.sender_id === user.id ?
                                        <div key={index} className="flex  justify-start bg-white p-2 rounded-md">
                                            <div className='bg-blue-300'>{message.sender_name}</div>

                                            <div>{message.message_content}</div>
                                        </div> : <div></div>}
                                    {message.receiver_id === user.id ?
                                        <div key={index} className="flex justify-end  bg-white p-2 rounded-md">
                                            <div className='bg-blue-300'>{message.sender_name}</div>

                                            <div>{message.message_content}</div>
                                        </div> : <div></div>}

                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="user-input p-4 bg-white rounded-b-lg">
                        <form name='form2'>
                            <input
                                name='content'
                                type="text"
                                onChange={handleInput}
                                className="w-full px-2 py-1 border rounded-md"
                                placeholder="Type your message..."
                            />
                            <button
                                className="px-4 py-2 bg-blue-500 rounded-md text-white"
                                onClick={handleSubmit}
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;