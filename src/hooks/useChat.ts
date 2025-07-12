import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender_name?: string;
}

export interface Conversation {
  id: string;
  student_id: string;
  counselor_id: string;
  created_at: string;
  updated_at: string;
  student_name?: string;
  counselor_name?: string;
}

export const useChat = (conversationId?: string) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        student:profiles!conversations_student_id_fkey(id, name),
        counselor:profiles!conversations_counselor_id_fkey(id, name)
      `)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      return;
    }

    const formattedConversations = data.map((conv: any) => ({
      ...conv,
      student_name: conv.student?.name,
      counselor_name: conv.counselor?.name,
    }));

    setConversations(formattedConversations);
  }, [user]);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (convId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(name)
      `)
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    const formattedMessages = data.map((msg: any) => ({
      ...msg,
      sender_name: msg.sender?.name,
    }));

    setMessages(formattedMessages);
  }, []);

  // Send a message
  const sendMessage = useCallback(async (content: string, convId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: convId,
        sender_id: user.id,
        content,
      });

    if (error) {
      console.error('Error sending message:', error);
      return;
    }

    // Update conversation timestamp
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', convId);
  }, [user]);

  // Create a new conversation
  const createConversation = useCallback(async (counselorId: string) => {
    if (!user || user.userType !== 'student') return null;

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        student_id: user.id,
        counselor_id: counselorId,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
      return null;
    }

    return data;
  }, [user]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('chat-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          if (conversationId && payload.new.conversation_id === conversationId) {
            fetchMessages(conversationId);
          }
          fetchConversations(); // Update conversation list
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversations',
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, conversationId, fetchMessages, fetchConversations]);

  // Initial data fetch
  useEffect(() => {
    if (user) {
      fetchConversations();
      if (conversationId) {
        fetchMessages(conversationId);
      }
      setLoading(false);
    }
  }, [user, conversationId, fetchConversations, fetchMessages]);

  return {
    messages,
    conversations,
    loading,
    sendMessage,
    createConversation,
    fetchMessages,
  };
};