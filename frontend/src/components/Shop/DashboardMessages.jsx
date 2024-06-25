import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
import { server } from "../../server";
import styles from "../../styles/styles";

const ENDPOINT = "https://nwesextyrepo-chat.onrender.com/";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const DashboardMessages = () => {
  const { seller, isLoading } = useSelector((state) => state.seller);
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [images, setImages] = useState();
  const [open, setOpen] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    socketId.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  const createNewConversation = async (userId, sellerId) => {
    try {
      const requestData = {
        groupTitle: "Chat with a Therapist",
        userId,
        sellerId,
      };
      const response = await axios.post(`${server}/conversation/create-new-conversation`, requestData, {
        withCredentials: true,
      });

      console.log('New conversation created:', response.data);
      setConversations(prev => [...prev, response.data.conversation]);
      return response.data.conversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null; 
    }
  };

  const handleCreateConversation = async () => {
    const userId = '';
    const sellerId = JSON.parse(localStorage.getItem("user"))._id;
    createNewConversation(userId, sellerId);
  };

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        const response = await axios.get(
          `${server}/conversation/get-all-conversation-seller/${JSON.parse(localStorage.getItem("user"))._id}`,
          { withCredentials: true }
        );
        setConversations(response.data.conversations);
      } catch (error) {
        console.log(error);
      }
    };
    getConversation();
  }, [seller, messages]);

  useEffect(() => {
    if (seller) {
      const sellerId = seller._id;
      socketId.emit("addUser", sellerId);
      socketId.on("getUsers", (data) => {
        setOnlineUsers(data);
      });
    }
  }, [seller]);

  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find(
      (member) => member !== JSON.parse(localStorage.getItem("user"))._id
    );
    const online = onlineUsers.find((user) => user.userId === chatMembers);

    return online ? true : false;
  };

  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await axios.get(
          `${server}/message/get-all-messages/${currentChat?._id}`
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.log(error);
      }
    };
    if (currentChat) {
      getMessage();
    }
  }, [currentChat]);

  const sendMessageHandler = async (e) => {
    e.preventDefault();

    const message = {
      sender: JSON.parse(localStorage.getItem("user"))._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member.id !== JSON.parse(localStorage.getItem("user"))._id
    );

    socketId.emit("sendMessage", {
      senderId: JSON.parse(localStorage.getItem("user"))._id,
      receiverId,
      text: newMessage,
    });

    try {
      if (newMessage !== "") {
        await axios
          .post(`${server}/message/create-new-message`, message)
          .then((res) => {
            setMessages([...messages, res.data.message]);
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
    socketId.emit("updateLastMessage", {
      lastMessage: newMessage,
      lastMessageId: JSON.parse(localStorage.getItem("user"))._id,
    });

    await axios
      .put(`${server}/conversation/update-last-message/${currentChat._id}`, {
        lastMessage: newMessage,
        lastMessageId: JSON.parse(localStorage.getItem("user"))._id,
      })
      .then((res) => {
        console.log(res.data.conversation);
        setNewMessage("");
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
    const receiverId = currentChat.members.find(
      (member) => member !== JSON.parse(localStorage.getItem("user"))._id
    );

    socketId.emit("sendMessage", {
      senderId: JSON.parse(localStorage.getItem("user"))._id,
      receiverId,
      images: e,
    });

    try {
      await axios
        .post(`${server}/message/create-new-message`, {
          images: e,
          sender: JSON.parse(localStorage.getItem("user"))._id,
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

  const updateLastMessageForImage = async () => {
    await axios.put(
      `${server}/conversation/update-last-message/${currentChat._id}`,
      {
        lastMessage: "Photo",
        lastMessageId: JSON.parse(localStorage.getItem("user"))._id,
      }
    );
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchUserData = async (userId) => {
    try {
      const res = await axios.get(`${server}/user/user-info/${userId}`);
      setUserData((prevData) => ({
        ...prevData,
        [userId]: res.data.user,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    conversations.forEach((conversation) => {
      const userId = conversation.members.find(
        (user) => user !== seller._id
      );
      if (!userData[userId]) {
        fetchUserData(userId);
      }
    });
  }, [conversations, seller]);

  console.log('conv log', conversations);

  return (
    <div className="w-[90%] bg-white m-5 h-[85vh] overflow-y-scroll rounded">
      <h1 className="text-center text-[30px] py-3 font-Poppins">
        All Messages
      </h1>

      <button onClick={handleCreateConversation} className="bg-blue-500 text-white p-2 rounded-lg mb-4">
        Create New Conversation For Therapists Users
      </button>

      {/* All messages list */}
      {conversations.map((conversation) => {
        const userId = conversation.members.find(
          (user) => user !== JSON.parse(localStorage.getItem("user"))._id
        );
        return (
          <MessageList
            key={conversation._id}
            userData={userData[userId]}
            conversation={conversation}
            setCurrentChat={setCurrentChat}
            setOpen={setOpen}
            online={onlineCheck(conversation)}
            isLoading={isLoading}
          />
        );
      })}

      {open && currentChat && (
        <SellerInbox
          setOpen={setOpen}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          sellerId={JSON.parse(localStorage.getItem("user"))._id}
          userData={userData[currentChat.members.find((member) => member !== JSON.parse(localStorage.getItem("user"))._id)]}
          activeStatus={activeStatus}
          scrollRef={scrollRef}
          setMessages={setMessages}
          handleImageUpload={handleImageUpload}
          currentChat={currentChat}
        />
      )}
    </div>
  );
};

const MessageList = ({
  userData,
  conversation,
  setCurrentChat,
  setOpen,
  online,
  isLoading,
}) => {
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/dashboard-messages?${id}`);
    setOpen(true);
  };
  const [active, setActive] = useState(0);

  return (
    <div
      className={`w-full flex p-3 px-3 ${
        active === conversation._id ? "bg-[#00000010]" : "bg-transparent"
      } cursor-pointer`}
      onClick={(e) => {
        setActive(conversation._id);
        handleClick(conversation._id);
        setCurrentChat(conversation);
      }}
    >
      <div className="relative">
        <img
          src={`${userData?.avatar?.url}`}
          alt=""
          className="w-[50px] h-[50px] rounded-full"
        />
        {online ? (
          <div className="w-[12px] h-[12px] bg-green-400 rounded-full absolute top-[2px] right-[2px]" />
        ) : (
          <div className="w-[12px] h-[12px] bg-[#c7b9b9] rounded-full absolute top-[2px] right-[2px]" />
        )}
      </div>
      <div className="pl-3">
        <h1 className="text-[18px]">{userData?.name}</h1>
        <p className="text-[16px] text-[#000c]">
          {!isLoading && conversation?.lastMessageId !== userData?._id
            ? "You:"
            : userData?.name.split(" ")[0] + ": "}{" "}
          {conversation?.lastMessage}
        </p>
      </div>
    </div>
  );
};

const SellerInbox = ({
  scrollRef,
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  sellerId,
  userData,
  activeStatus,
  handleImageUpload,
}) => {
  return (
    <div className="w-full min-h-full flex flex-col justify-between">
      {/* message header */}
      <div className="w-full flex p-3 items-center justify-between bg-slate-200">
        <div className="flex">
          <img
            src={`${userData?.avatar?.url}`}
            alt=""
            className="w-[60px] h-[60px] rounded-full"
          />
          <div className="pl-3">
            <h1 className="text-[18px] font-[600]">{userData?.name}</h1>
            <h1>{activeStatus ? "Active Now" : ""}</h1>
          </div>
        </div>
        <AiOutlineArrowRight
          size={20}
          className="cursor-pointer"
          onClick={() => setOpen(false)}
        />
      </div>

      {/* messages */}
      <div className="px-3 h-[65vh] py-3 overflow-y-scroll">
        {messages &&
          messages.map((item, index) => {
            return (
              <div
                className={`flex w-full my-2 ${
                  item.sender === sellerId ? "justify-end" : "justify-start"
                }`}
                ref={scrollRef}
                key={index}
              >
                {item.sender !== sellerId && (
                  <img
                    src={`${userData?.avatar?.url}`}
                    className="w-[40px] h-[40px] rounded-full mr-3"
                    alt=""
                  />
                )}
                {item.images && (
                  <img
                    alt="seller"
                    src={`${item.images?.url}`}
                    className="w-[300px] h-[300px] object-cover rounded-[10px] mr-2"
                  />
                )}
                {item.text !== "" && (
                  <div>
                    <div
                      className={`w-max p-2 rounded ${
                        item.sender === sellerId ? "bg-pink-500" : "bg-blue-500"
                      } text-[#fff] h-min`}
                    >
                      <p>{item.text}</p>
                    </div>

                    <p className="text-[12px] text-[#000000d3] pt-1">
                      {format(item.createdAt)}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* send message input */}
      <form
        required={true}
        className="p-3 relative w-full flex justify-between items-center"
        onSubmit={sendMessageHandler}
      >
        <div className="w-[30px]">
          <input
            type="file"
            name=""
            id="image"
            className="hidden"
            onChange={handleImageUpload}
          />
          <label htmlFor="image">
            <TfiGallery className="cursor-pointer" size={20} />
          </label>
        </div>
        <div className="w-full">
          <input
            type="text"
            required
            placeholder="Enter your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className={`${styles.input}`}
          />
          <input type="submit" value="Send" className="hidden" id="send" />
          <label htmlFor="send">
            <AiOutlineSend
              size={20}
              className="absolute right-4 top-5 cursor-pointer"
            />
          </label>
        </div>
      </form>
    </div>
  );
};

export default DashboardMessages;
