import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { ConversationList } from '@/components/chat/ConversationList';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { Conversation } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';

export const Chat: React.FC = () => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  const getPartnerName = (conversation: Conversation) => {
    return user?.userType === 'student' 
      ? conversation.counselor_name || 'Counselor'
      : conversation.student_name || 'Student';
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {selectedConversation ? (
            <ChatInterface
              conversationId={selectedConversation.id}
              partnerName={getPartnerName(selectedConversation)}
              onBack={handleBackToList}
            />
          ) : (
            <ConversationList onSelectConversation={handleSelectConversation} />
          )}
        </div>
      </div>
    </Layout>
  );
};