import React, { useState, useEffect, useRef } from 'react';
import { Send, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

interface Message extends Tables<'messages'> {}
interface Conversation extends Tables<'conversations'> {}

interface ChatComponentProps {
  otherUserId: string;
  otherUserName: string;
  onBack: () => void;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ otherUserId, otherUserName, onBack }) => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!user || !profile) return;

    const initializeConversation = async () => {
      try {
        // Check if conversation exists
        const { data: existingConversation } = await supabase
          .from('conversations')
          .select('*')
          .or(`and(student_id.eq.${user.id},counselor_id.eq.${otherUserId}),and(student_id.eq.${otherUserId},counselor_id.eq.${user.id})`)
          .single();

        if (existingConversation) {
          setConversation(existingConversation);
        } else {
          // Create new conversation
          const studentId = profile.user_type === 'student' ? user.id : otherUserId;
          const counselorId = profile.user_type === 'counselor' ? user.id : otherUserId;

          const { data: newConversation } = await supabase
            .from('conversations')
            .insert({
              student_id: studentId,
              counselor_id: counselorId,
            })
            .select()
            .single();

          if (newConversation) {
            setConversation(newConversation);
          }
        }
      } catch (error) {
        console.error('Error initializing conversation:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeConversation();
  }, [user, profile, otherUserId]);

  useEffect(() => {
    if (!conversation) return;

    const fetchMessages = async () => {
      const { data: messagesData } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: true });

      if (messagesData) {
        setMessages(messagesData);
      }
    };

    fetchMessages();

    // Subscribe to real-time message updates
    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversation.id}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversation]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation || !user) return;

    try {
      await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          sender_id: user.id,
          content: newMessage.trim(),
        });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="border-b flex-shrink-0">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary-accent rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <CardTitle className="text-lg">{otherUserName}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                    message.sender_id === user?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.created_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t p-4 flex-shrink-0">
          <form onSubmit={sendMessage} className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatComponent;