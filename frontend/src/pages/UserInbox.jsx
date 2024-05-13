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
  const [sellers, setSellers] = useState({});

  useEffect(() => {
    const getSellers = async function () {
      const { data } = await axios.get(`${server}/shop/getSeller`, {
        withCredentials: true,
      });
      console.log(data, 'data');
      setSellers(data.seller);
    };

    getSellers();
  }, []);

  useEffect(() => {
    socketId.on('getMessage', (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        const response = await axios.get(`${server}/conversation/get-all-conversation-user/${user?._id}`, {
          withCredentials: true,
        });
        console.log(response, 'response');

        setConversations(response.data.conversations);
      } catch (error) {
        // console.log(error);
      }
    };
    getConversation();
  }, [user, messages]);

  useEffect(() => {
    if (user) {
      const sellerId = user?._id;
      socketId.emit('addUser', sellerId);
      socketId.on('getUsers', (data) => {
        setOnlineUsers(data);
      });
    }
  }, [user]);

  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find((member) => member !== user?._id);
    const online = onlineUsers.find((user) => user.userId === chatMembers);

    return online ? true : false;
  };

  // get messages
  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await axios.get(`${server}/message/get-all-messages/${currentChat?._id}`);
        setMessages(response?.data?.messages);
      } catch (error) {
        console.log(error);
      }
    };
    getMessage();
  }, [currentChat]);

  // create new message
  const sendMessageHandler = async (e) => {
    e.preventDefault();

    const message = {
      sender: user?._id,
      text: newMessage,
      conversationId: currentChat?._id,
    };
    const receiverId = currentChat?.members?.find((member) => member !== user?._id);

    socketId.emit('sendMessage', {
      senderId: user?._id,
      receiverId,
      text: newMessage,
    });

    try {
      if (newMessage !== '') {
        await axios
          .post(`${server}/message/create-new-message`, message)
          .then((res) => {
            setMessages([...messages, res?.data?.message]);
            updateLastMessage();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessage = async () => {
    socketId.emit('updateLastMessage', {
      lastMessage: newMessage,
      lastMessageId: user._id,
    });

    await axios
      .put(`${server}/conversation/update-last-message/${currentChat._id}`, {
        lastMessage: newMessage,
        lastMessageId: user._id,
      })
      .then((res) => {
        setNewMessage('');
      })
      .catch((error) => {
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

  const imageSendingHandler = async (e) => {
    const receiverId = currentChat.members.find((member) => member !== user._id);

    socketId.emit('sendMessage', {
      senderId: user._id,
      receiverId,
      images: e,
    });

    try {
      await axios
        .post(`${server}/message/create-new-message`, {
          images: e,
          sender: user._id,
          text: newMessage,
          conversationId: currentChat._id,
        })
        .then((res) => {
          setImages();
          setMessages([...messages, res.data.message]);
          updateLastMessageForImage();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSellerClick = (seller) => {
    const chatRoomId = `seller_${seller._id}`; // Concatenate the seller's ID with a prefix
    console.log('Opening chat room:', chatRoomId);
    
    // Open the SellerInbox with the unique chat room ID
    setOpen(true);
    setCurrentChat(chatRoomId); // Set the chat room ID
    setUserData(seller); // Set the seller data
  };
  
  

  const updateLastMessageForImage = async () => {
    await axios.put(`${server}/conversation/update-last-message/${currentChat._id}`, {
      lastMessage: 'Photo',
      lastMessageId: user?._id,
    });
  };

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ beahaviour: 'smooth' });
  }, [messages]);

  return (
<div className="w-full ">
  {!open && (
    <>
      <Header />
      <div className="bg-[#fff] flex flex-col justify-center items-center m-auto md:w-1/2 p-8 md:p-20 rounded-lg mt-24">
        <h1 className="text-center text-[30px] py-3 font-Poppins">Choose Therapists To Message</h1>
        {/* All messages list here*/}

        <div>
          {sellers && Array.isArray(sellers) && sellers.length > 0 ? (
            sellers.map(seller => (
              <div key={seller._id} className="border border-gray-400 p-2 mb-4" onClick={() => handleSellerClick(seller)}>
                <div>{seller.name}</div>
                <div>{seller.email}</div>
              </div>
            ))
          ) : (
            <div className="text-center">No Therapist Available</div>
          )}
        </div>

        
        {conversations &&
          conversations.map((item, index) => {
            console.log('Rendering MessageList:', item);
            return (
              <MessageList
                data={item}
                key={index}
                index={index}
                setOpen={setOpen}
                setCurrentChat={setCurrentChat}
                me={user?._id}
                setUserData={setUserData}
                userData={userData}
                online={onlineCheck(item)}
                setActiveStatus={setActiveStatus}
                loading={loading}
              />
            );
          })}
      </div>
    </>
  )}

  {open && (
    <>
      {console.log('Rendering SellerInbox:', {
        newMessage,
        messages,
        sellerId: user._id,
        userData,
        activeStatus,
      })}
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
      />
       {/* Add the VoiceCall component here */}
    </>
  )}
</div>

      

  );
};

const MessageList = ({ data, index, setOpen, setCurrentChat, me, setUserData, userData, online, setActiveStatus, loading }) => {
  const [active, setActive] = useState(0);
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/inbox?${id}`);
    setOpen(true);
  };

  useEffect(() => {
    setActiveStatus(online);
    const userId = data.members.find((user) => user !== me);
    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/shop/get-shop-info/${userId}`);
        setUser(res.data.shop);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [me, data]);

  return (
    <div className={`w-full flex p-3 px-3 ${active === index ? 'bg-[#00000010]' : 'bg-transparent'}  cursor-pointer`} onClick={(e) => setActive(index) || handleClick(data._id) || setCurrentChat(data) || setUserData(user) || setActiveStatus(online)}>
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

const SellerInbox = ({ setOpen, newMessage, setNewMessage, sendMessageHandler, messages, sellerId, userData, activeStatus, scrollRef, handleImageUpload }) => {
  return (
    <div className="w-[full]  min-h-full flex flex-col justify-between p-5">
      {/* message header */}
      <div className="w-full flex p-3 items-center justify-between bg-pink-500">
        <div className="flex">
          <img src={`${userData?.avatar?.url}`} alt="" className="w-[60px] h-[60px] rounded-full" />
          <div className="pl-3">
            <h1 className="text-[18px] font-[600]" style={{color: 'white'}}>{userData?.name}</h1>
            <h1>{activeStatus ? 'Active Now' : ''}</h1>
          </div>
        </div>
        <AiOutlineArrowRight size={20} className="cursor-pointer" onClick={() => setOpen(false)} />
      </div>

      {/* messages */}
      <div className="px-3 h-[75vh] py-3 overflow-y-scroll">
        {messages &&
          messages.map((item, index) => (
            <div className={`flex w-full my-2 ${item.sender === sellerId ? 'justify-end' : 'justify-start'}`} ref={scrollRef}>
              {item.sender !== sellerId && <img src={`${userData?.avatar?.url}`} className="w-[40px] h-[40px] rounded-full mr-3" alt="" />}
              {item.images && <img src={`${item?.images?.url}`} className="w-[300px] h-[300px] object-cover rounded-[10px] ml-2 mb-2" />}
              {item.text !== '' && (
                <div>
                  <div className={`w-max p-2 rounded ${item.sender === sellerId ? 'bg-[#000]' : 'bg-[#38c776]'} text-[#fff] h-min`}>
                    <p>{item?.text}</p>
                  </div>

                  <p className="text-[12px] text-[#000000d3] pt-1" style={{color: 'white'}}>{format(item.createdAt)}</p>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* send message input */}
      <form aria-required={true} className="p-3 relative w-full flex justify-between items-center" onSubmit={sendMessageHandler}>
        <div className="w-[30px]">
          <input type="file" name="" id="image" className="hidden" onChange={handleImageUpload} />
          <label htmlFor="image">
            <TfiGallery className="cursor-pointer" size={20} style={{color: 'white'}}/>
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
