import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  from: {
    _id: string;
    name: string;
    email: string;
    userType: string;
  };
  to: string;
  content: string;
  timestamp: string;
}

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  sendMessage: (to: string, content: string) => void;
  messages: Message[];
  onlineUsers: Set<string>;
  typingUsers: Map<string, boolean>;
  setTyping: (to: string, isTyping: boolean) => void;
}

export const useSocket = (): UseSocketReturn => {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<Map<string, boolean>>(new Map());

  useEffect(() => {
    if (!user) return;

    // Initialize socket connection
    const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
    socketRef.current = io(serverUrl);

    const socket = socketRef.current;

    // Connection events
    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join', user.id);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Message events
    socket.on('newMessage', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('messageDelivered', (data) => {
      console.log('Message delivered:', data);
    });

    socket.on('messageError', (error) => {
      console.error('Message error:', error);
    });

    // Online status events
    socket.on('userOnline', (userId: string) => {
      setOnlineUsers(prev => new Set([...prev, userId]));
    });

    socket.on('userOffline', (userId: string) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });

    // Typing events
    socket.on('userTyping', ({ from, isTyping }) => {
      setTypingUsers(prev => {
        const newMap = new Map(prev);
        if (isTyping) {
          newMap.set(from, true);
        } else {
          newMap.delete(from);
        }
        return newMap;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const sendMessage = (to: string, content: string) => {
    if (socketRef.current && user) {
      socketRef.current.emit('sendMessage', {
        from: user.id,
        to,
        content
      });
    }
  };

  const setTyping = (to: string, isTyping: boolean) => {
    if (socketRef.current && user) {
      socketRef.current.emit('typing', {
        from: user.id,
        to,
        isTyping
      });
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    sendMessage,
    messages,
    onlineUsers,
    typingUsers,
    setTyping
  };
};