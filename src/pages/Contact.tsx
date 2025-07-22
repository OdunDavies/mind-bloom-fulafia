import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ChatWindow } from '@/components/ChatWindow';
import { getMessagesBetween, saveMessage } from '@/lib/chatUtils';
import { Message } from '@/models/Message';
import { v4 as uuidv4 } from 'uuid';

const Contact = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chatUser, setChatUser] = useState<any>(null); // You need to set this from outside or via navigation
  const [messages, setMessages] = useState<Message[]>([]);

  // Example: You might get chatUser from navigation state or props
  // useEffect(() => {
  //   if (location.state?.chatUser) {
  //     setChatUser(location.state.chatUser);
  //     setMessages(getMessagesBetween(user.email, location.state.chatUser.email));
  //   }
  // }, [location.state, user]);

  const handleSendMessage = (content: string) => {
    if (!chatUser) return;
    const msg: Message = {
      id: uuidv4(),
      from: user.email,
      to: chatUser.email,
      content,
      timestamp: new Date().toISOString(),
    };
    saveMessage(msg);
    setMessages(prev => [...prev, msg]);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Access Restricted</h2>
          <p className="text-muted-foreground mb-6">Please log in to access the chat room.</p>
          <Button onClick={() => navigate('/login')}>
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-lg mx-auto">
        {chatUser ? (
          <ChatWindow
            user={user}
            chatUser={chatUser}
            messages={messages}
            onSend={handleSendMessage}
            onClose={() => setChatUser(null)}
          />
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Select a user to start chatting</h2>
            {/* You need to implement user selection logic here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;