import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useChat, Conversation } from '@/hooks/useChat';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface ConversationListProps {
  onSelectConversation: (conversation: Conversation) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  onSelectConversation,
}) => {
  const { user } = useAuth();
  const { conversations, createConversation } = useChat();
  const [counselors, setCounselors] = useState<any[]>([]);
  const [selectedCounselor, setSelectedCounselor] = useState<string>('');
  const [creating, setCreating] = useState(false);

  // Fetch counselors for students
  useEffect(() => {
    if (user?.userType === 'student') {
      const fetchCounselors = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('id, name, specialty')
          .eq('user_type', 'counselor');
        
        if (data) setCounselors(data);
      };
      fetchCounselors();
    }
  }, [user]);

  const handleCreateConversation = async () => {
    if (!selectedCounselor || creating) return;

    setCreating(true);
    const conversation = await createConversation(selectedCounselor);
    if (conversation) {
      // Find the counselor name
      const counselor = counselors.find(c => c.id === selectedCounselor);
      onSelectConversation({
        ...conversation,
        counselor_name: counselor?.name,
        student_name: user?.name,
      });
    }
    setCreating(false);
    setSelectedCounselor('');
  };

  const getPartnerName = (conversation: Conversation) => {
    return user?.userType === 'student' 
      ? conversation.counselor_name 
      : conversation.student_name;
  };

  return (
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Chat Conversations
        </CardTitle>
        
        {user?.userType === 'student' && (
          <div className="space-y-2">
            <Select value={selectedCounselor} onValueChange={setSelectedCounselor}>
              <SelectTrigger>
                <SelectValue placeholder="Select a counselor to chat with" />
              </SelectTrigger>
              <SelectContent>
                {counselors.map((counselor) => (
                  <SelectItem key={counselor.id} value={counselor.id}>
                    {counselor.name} {counselor.specialty && `(${counselor.specialty})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleCreateConversation}
              disabled={!selectedCounselor || creating}
              className="w-full"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Start New Chat
            </Button>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          {conversations.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No conversations yet
            </p>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {getPartnerName(conversation)?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {getPartnerName(conversation)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(conversation.updated_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};