import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { socket } from '../libs/socket';
import { IoIosSend } from 'react-icons/io';



export default function Chat() {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<
    { senderId: number | null; receiverId: number; content: string }[]
  >([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const params = new URLSearchParams(window.location.search);
  const receiverId = Number(params.get('userId'));
  const userId = user?.userId ? Number(user?.userId) : null;

  useEffect(() => {
    socket.on('typing', (data) => {
      setIsTyping(true);
      console.log(data.userId);
    });
    socket.on('stopTyping', () => {
      setIsTyping(false);
    });

    socket.on('sendMessage', (message) => {
      console.log('new message:', message);

      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('typing');
      socket.off('stopTyping');
      socket.off('sendMessage');
    };
  }, []);

  const handleTyping = () => {
    socket.emit('typing', {
      senderId: userId,
      receiverId,
    });

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      socket.emit('stopTyping', {
        senderId: userId,
        receiverId,
      });
    }, 1500);
  };

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit('stopTyping', {
      senderId: userId,
      receiverId: receiverId,
    });
    socket.emit('sendMessage', {
      senderId: userId,
      receiverId: receiverId,
      content: message,
    });
    setMessages((prev) => [
      ...prev,
      {
        senderId: userId,
        receiverId: receiverId,
        content: message,
      },
    ]);

    setMessage('');
  };

  return (
    <div className="w-full bg-[#F7F7F7] flex flex-col items-center h-screen py-5 relative ">
      {/* <h1>Chat</h1> */}

      <div className="w-full flex flex-col gap-2 px-2 h-full overflow-y-auto pb-24">
        {messages.map((message, index) => {
          const isMe = message.senderId == userId;
          return (
            <div
              key={index}
              className={`flex  ${isMe ? 'justify-end ' : 'justify-start'}`}
            >
              <div
                className={`px-8 relative py-2 text-[#2a2a2a] ${isMe ? 'bg-[#56c3e7] text-white after:content-[""] after:bg-[#56c3e7] after:h-7 after:w-5 after:bottom-[-0.8px] after:rounded-bl-full after:rounded-br-xs after:rounded-tl-xs after:rounded-tr-full after:right-1 after:absolute' : 'bg-[#e3e3e3] after:content-[""] after:bg-[#e3e3e3] after:h-7 after:w-5 after:bottom-[-0.8px] after:rounded-br-full after:rounded-bl-xs after:rounded-tr-xs after:rounded-tl-full after:left-1 after:absolute'} rounded-full `}
              >
                {message.content}
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="animate-pulse duration-75 flex justify-start">
            <div className=" text-[#2a2a2a] py-2 px-8 rounded-full italic ">
              typing ...
            </div>
          </div>
        )}
      </div>
      <form
        onSubmit={sendMessage}
        className="fixed bottom-0 py-5 px-2 flex items-center justify-center w-full gap-2 bg-[#BDBEC2]"
      >
        <input
          className="w-full focus:outline-0 bg-[#f7f7f7cd] rounded-2xl p-4"
          value={message}
          placeholder="Type Here..."
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
        />
        <button
          type="submit"
          className="p-4 bg-[#007AFF] text-white rounded-full active:bg-[#569ee7b9]"
        >
          <IoIosSend size={20} />
        </button>
      </form>
    </div>
  );
}
