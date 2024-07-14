import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineArrowRight, AiOutlineSend } from 'react-icons/ai';
import { TfiGallery } from 'react-icons/tfi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import socketIO from 'socket.io-client';
import { format } from 'timeago.js';
import Header from '../components/Layout/Header';
import { server } from '../server';
import styles from '../styles/styles';
import { getLocalStorage } from '../lib/localStorage'

const ENDPOINT = 'https://nwesextyrepo-chat.onrender.com/';
const socketId = socketIO(ENDPOINT, { transports: ['websocket'] });

const UserInbox = () => {
  const { user, loading } = useSelector((state) => state.user);
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userData, setUserData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [images, setImages] = useState();
  const [activeStatus, setActiveStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const scrollRef = useRef(null);




  // useEffect(() => {
  //   const getSellers = async function () {
  //     const { data } = await axios.get(`${server}/shop/getSeller`, {
  //       withCredentials: true,
  //     });
  //     console.log(data, 'data');
  //     setSellers(data.sellers);
  //   };

  //   getSellers();
  // }, [server]);

  useEffect(() => {
    socketId.on('getMessage', (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  const handleCreateConversation = async () => {
    try {
      const requestData = {
        groupTitle: 'Chat with a Therapist',
        userId: user._id,
        sellerId: '',
      };
      const response = await axios.post(`${server}/conversation/create-new-conversation`, requestData, {
        withCredentials: true,
      });
      setConversations([...conversations, response.data.conversation]);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  useEffect(() => {
    if (arrivalMessage && currentChat?.members.includes(arrivalMessage.sender)) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    const token = getLocalStorage("auth-token")

    if (user) {
      console.log('User ID:', user._id);
      const getConversation = async () => {
        try {
          const response = await axios.get(`${server}/conversation/get-all-conversation-user/${user._id}`, {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log('Full response:', response);  // Log the full response
          console.log('Conversations:', response.data.conversations);  // Log the conversations array
          setConversations(response.data.conversations);
        } catch (error) {
          console.log('Error fetching conversations:', error);  // Log any errors
        }
      };
      getConversation();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const sellerId = user._id;
      socketId.emit('addUser', sellerId);
      socketId.on('getUsers', (data) => {
        setOnlineUsers(data);
      });
    }
  }, [user]);

  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMembers);
    return online ? true : false;
  };

  useEffect(() => {
    if (currentChat) {
      const getMessages = async () => {
        try {
          const response = await axios.get(`${server}/message/get-all-messages/${currentChat._id}`);
          setMessages(response.data.messages);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
      getMessages();
    }
  }, [currentChat]);

  const sendMessageHandler = async (e) => {
    e.preventDefault();

    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };
    const receiverId = currentChat.members.find(
      (member) => member !== user._id);


    socketId.emit('sendMessage', {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });
    try {
      if (newMessage) {
        await axios.post(`${server}/message/create-new-message`, message)
          .then((res) => {
            setMessages([...messages, res.data.message]);
            updateLastMessage(res.data.message);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessage = async (message) => {
    socketId.emit('updateLastMessage', {
      lastMessage: message.text,
      lastMessageId: user._id,
    });
    await axios.put(`${server}/conversation/update-last-message/${currentChat._id}`, {
      lastMessage: message.text,
      lastMessageId: user._id,
    }).then((res) => {
      setNewMessage('');
    }).catch((error) => {
      console.log(error);
    });
  };

  const handleImageUpload = async (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImages(reader.result);
        imageSendingHandler(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const imageSendingHandler = async (image) => {
    const receiverId = currentChat.members.find((member) => member !== user._id);
    socketId.emit('sendMessage', {
      senderId: user._id,
      receiverId,
      images: image,
    });
    try {
      await axios.post(`${server}/message/create-new-message`, {
        images: image,
        sender: user._id,
        text: newMessage,
        conversationId: currentChat._id,
      }).then((res) => {
        setImages(null);
        setMessages([...messages, res.data.message]);
        updateLastMessageForImage();
      });
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessageForImage = async () => {
    await axios.put(`${server}/conversation/update-last-message/${currentChat._id}`, {
      lastMessage: 'Photo',
      lastMessageId: user._id,
    });
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  console.log('our con', conversations)

  return (
    <div className="w-full">
      {!open && (
        <>
          <Header />
          <div className="bg-[#fff] flex flex-col justify-center items-center m-auto md:w-1/2 p-8 md:p-20 rounded-lg mt-24">
            <h1 className="text-center text-[30px] py-3 font-Poppins">Start Conversation With a Therapist</h1>

            <button onClick={handleCreateConversation} className="bg-blue-500 text-white p-2 rounded-lg mb-4">
              Create New Conversation
            </button>
            {conversations.map((item, index) => (
              <MessageList
                key={index}
                data={item}
                index={index}
                setOpen={setOpen}
                setCurrentChat={setCurrentChat}
                me={user._id}
                setUserData={setUserData}
                userData={userData}
                online={onlineCheck(item)}
                setActiveStatus={setActiveStatus}
                loading={loading}
                user={user}
              />
            ))}
          </div>
        </>
      )}

      {open && (
        <>
          <SellerInbox
            setOpen={setOpen}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessageHandler={sendMessageHandler}
            messages={messages}
            sellerId={user._id}
            userData={userData}
            activeStatus={activeStatus}
            scrollRef={scrollRef}
            handleImageUpload={handleImageUpload}
            user={user}
          />
        </>
      )}
    </div>
  );
};

const MessageList = ({ data, index, setOpen, setCurrentChat, me, setUserData, userData, online, setActiveStatus, loading, createNewConversation, user }) => {
  const [active, setActive] = useState(0);
  const [currentUser, setCurrentUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setActiveStatus(online);
    const userId = data?.members.find((user) => user !== me);
    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/shop/get-shop-info/${userId}`);
        setCurrentUser(res.data.shop);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [me, data, online, setActiveStatus]);

  const handleClick = async (userId, sellerId) => {
    let conversation = data;
    if (!data) {
      conversation = await createNewConversation(userId, sellerId);
      if (conversation) {
        setCurrentChat(conversation);
        setUserData(currentUser);
        setOpen(true);
      }
    } else {
      navigate(`/inbox?${data._id}`);
      setOpen(true);
      setCurrentChat(data);
      setUserData(currentUser);
    }
  };

  return (
    <div className={`w-full flex p-3 px-3 ${active === index ? 'bg-[#00000010]' : 'bg-transparent'} cursor-pointer`} onClick={() => {
      setActive(index);
      handleClick(data._id);
      setCurrentChat(data);
      setUserData(user);
      setActiveStatus(online);
    }}>
      <div className="relative">
        <img src={`${user?.avatar?.url}`} alt="" className="w-[50px] h-[50px] rounded-full" />
        {online ? <div className="w-[12px] h-[12px] bg-green-400 rounded-full absolute top-[2px] right-[2px]" /> : <div className="w-[12px] h-[12px] bg-[#c7b9b9] rounded-full absolute top-[2px] right-[2px]" />}
      </div>
      <div className="pl-3">
        <h1 className="text-[18px]">{user?.name}</h1>
        <p className="text-[16px] text-[#000c]">
          {!loading && data?.lastMessageId !== userData?._id ? 'You:' : userData?.name.split(' ')[0] + ': '} {data?.lastMessage}
        </p>
      </div>
    </div>
  );
};

const SellerInbox = ({ setOpen, newMessage, setNewMessage, sendMessageHandler, messages, userData, activeStatus, scrollRef, handleImageUpload, user }) => {
  return (
    <div className="w-full min-h-full flex flex-col justify-between p-5">
      <div className="w-full flex p-3 items-center justify-between bg-pink-500">
        <div className="flex">
          <img src={`${userData?.avatar?.url}`} alt="" className="w-[60px] h-[60px] rounded-full" />
          <div className="pl-3">
            <h1 className="text-[18px] font-[600]" style={{ color: 'white' }}>{userData?.name}</h1>
            <h1>{activeStatus ? 'Active Now' : ''}</h1>
          </div>
        </div>
        <AiOutlineArrowRight size={20} className="cursor-pointer" onClick={() => setOpen(false)} />
      </div>
      <div className="px-3 h-[75vh] py-3 overflow-y-scroll">
        {messages &&
          messages.map((item, index) => (
            <div className={`flex w-full my-2 ${item.sender === user._id ? 'justify-end' : 'justify-start'}`} ref={scrollRef}>
              {item.sender !== user._id && <img src={`${userData?.avatar?.url}`} className="w-[40px] h-[40px] rounded-full mr-3" alt="" />}
              {item.images && <img src={`${item?.images?.url}`} className="w-[300px] h-[300px] object-cover rounded-[10px] ml-2 mb-2" />}
              {item.text !== '' && (
                <div>
                  <div className={`w-max p-2 rounded ${item.sender === user._id ? 'bg-pink-500' : 'bg-blue-500'} text-[#fff] h-min`}>
                    <p>{item?.text}</p>
                  </div>
                  <p className="text-[12px] text-[#000000d3] pt-1" style={{ color: 'white' }}>{format(item.createdAt)}</p>
                </div>
              )}
            </div>
          ))}
      </div>
      <form aria-required={true} className="p-3 relative w-full flex justify-between items-center" onSubmit={sendMessageHandler}>
        <div className="w-[30px]">
          <input type="file" name="" id="image" className="hidden" onChange={handleImageUpload} />
          <label htmlFor="image">
            <TfiGallery className="cursor-pointer" size={20} style={{ color: 'white' }} />
          </label>
        </div>
        <div className="w-full">
          <input type="text" required placeholder="Enter your message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className={`${styles.input}`} />
          <input type="submit" value="Send" className="hidden" id="send" />
          <label htmlFor="send">
            <AiOutlineSend size={20} className="absolute right-4 top-5 cursor-pointer" />
          </label>
        </div>
      </form>
    </div>
  );
};

export default UserInbox;
