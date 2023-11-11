import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Textarea, Button, IconButton } from "@material-tailwind/react";
import { LinkIcon } from "@heroicons/react/24/outline";

import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    ListItemSuffix,
    Chip,
} from "@material-tailwind/react";
import {
    PresentationChartBarIcon,
    ShoppingBagIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    InboxIcon,
    PowerIcon,
} from "@heroicons/react/24/solid";

const Chat = () => {
    const [cookies] = useCookies(['user']);
    const user = cookies.user;

    const [receivedata, setreceivedata] = useState([]);
    const [selectedchats, setselectedchats] = useState('');
    const [selectedname, setselectedname] = useState('');
    const [senddata, setsenddata] = useState({
        content: '',
        sender: user.id,
        receiver: null, // Set to null initially
    });

    const [selectedChat, setselectedChat] = useState([]);

    const handleInput = (e) => {
        setsenddata((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    useEffect(() => {
        const fetchdata = () => {
            axios.get(`http://localhost:8081/chat/${user.id}`)
                .then((response) => {
                    setreceivedata(response.data);
                    // console.log(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        };

        const fetchDataInterval = setInterval(fetchdata, 1000);

        return () => {
            clearInterval(fetchDataInterval); // Cleanup the interval
        };
    }, []);

    const handleChatClick = (sender, e) => {
        // Check if the event and target are defined
        // console.log(e);

        const selectedChatId = sender;
        // setselectedname(e.target.innerText);

        console.log(selectedChatId);
        // console.log(e.target.value);

        axios.get(`http://localhost:8081/getmessage/${selectedChatId}`)
            .then((response) => {
                console.log(response.data);
                setselectedChat(response.data);
                setselectedchats(selectedChatId);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });

    };

    // if(selectedchats===undefined){
    //     console.log("Select kar fodyaaa...!!!")
    // }
    // else{
    //     setInterval(work,3000);
    // }

    useEffect(() => {

        async function work() {
            await axios.get(`http://localhost:8081/getmessage/${selectedchats}`)
                .then((response) => {
                    // console.log(response.data);
                    setselectedChat(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        }

        setTimeout(work, 3000)
    }, [senddata, selectedChat])


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Hello");
        senddata.receiver = selectedchats;
        axios.post('http://localhost:8081/handleSubmit', senddata)
            .then((response) => { })
            .catch((error) => {
                console.error('Error sending msg:', error);
            });

        document.form2.reset();

    };

    return (
        <div className='bg-gray-100 text-center overflow-hidden'>
            <div className="flex h-screen">
                <div className="flex flex-col  items-center w-1/4 h-full m-3 rounded-2xl overflow-hidden">
                    <div className='flex text-white font-bold align-middle items-center h-16  w-full max-w-[20rem] bg-blue-400 m-2 p-3 rounded-xl'>{user.username}</div>
                    <Card className="h-[calc(100vh-2rem)]  w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
                        <List>
                            {receivedata.map((chat) => (
                                chat.userid !== user.id &&
                                <ListItem
                                    key={chat.userid}
                                    // value={chat.sender_id}
                                    onClick={() => handleChatClick(chat.userid)}
                                    className={`cursor-pointer text-white font-bold bg-blue-300 mb-2 hover:ring hover:bg-blue-200`}
                                >
                                    {chat.username}
                                </ListItem>
                            ))}
                        </List>
                    </Card>
                </div>
                <div className="flex flex-col w-3/4 p-3 h-screen bg-transparent">
                    <div className='flex items-center w-full m-2  max-w-[67rem] bg-blue-200 h-16 rounded-xl text-black'>{selectedname}</div>
                    <div className=" p-4 h-96 m-2 overflow-y-scroll rounded-2xl z-1 bg-blue-400 w-auto">
                        {selectedchats === '' ? <div></div> : (
                            <div className='flex flex-col justify-start'>
                                {/* <h1 className="text-2xl font-bold mb-4 relative">Messages</h1> */}
                                <div className='grid w-full' >
                                    {selectedChat.map((message) => (
                                        <div key={message.message_id} className=''>
                                            {message.sender_id === selectedchats && message.receiver_id === user.id ? (
                                                <div className="flex flex-col break-normal snap-end bg-blue-200 text-left rounded-lg justify-start w-1/3 p-2 mb-2">
                                                    <div className='font-bold'>{message.sender_name}</div>
                                                    <p className='max-w-full break-words'>{message.message_content}</p>
                                                </div>
                                            ) : (
                                                <div className='hidden'></div>
                                            )}
                                            {message.receiver_id === selectedchats && message.sender_id === user.id ? (
                                                <div className="flex flex-col break-normal snap-end bg-gray-300 text-right rounded-lg justify-end ml-auto w-1/3 p-2 mb-2">
                                                    <div className='font-bold'>{message.sender_name}</div>
                                                    <p className='max-w-full break-words'>{message.message_content}</p>
                                                </div>
                                            ) : (
                                                <div className='hidden'></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                    <form name='form2' onSubmit={handleSubmit} className='' >
                        <div className="flex w-full flex-row items-end gap- rounded-[99px] border overflow-hidden bg-white">
                            <Textarea
                                onChange={handleInput} name='content'
                                rows={1}
                                resize={true}
                                placeholder="Your Message"
                                className="min-h-full border-transparent focus:border-transparent"
                                containerProps={{
                                    className: "grid h-full",
                                }}
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }}
                            />
                            <div>
                                <IconButton variant="text" className="rounded-full">
                                    <button type='submit'>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            className="h-5 w-5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                                            />
                                        </svg>
                                    </button>
                                </IconButton>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chat;