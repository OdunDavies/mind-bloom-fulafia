import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/hooks/useSocket';
import { apiService, User as ApiUser, Message as ApiMessage } from '@/services/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { User, Mail, MessageSquare, Send, Users, Search, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

const Contact = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    isConnected, 
    sendMessage, 
    messages: socketMessages, 
    onlineUsers, 
    typingUsers,
    setTyping 
  } = useSocket();
  
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);
  const [conversationMessages, setConversationMessages] = useState<ApiMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadUsers();
  }, [user]);

  // Load conversation when user is selected
  useEffect(() => {
    if (selectedUser && user) {
      loadConversation(user.id, selectedUser._id);
    }
  }, [selectedUser, user]);

  // Handle new socket messages
  useEffect(() => {
    if (selectedUser && socketMessages.length > 0) {
      const relevantMessages = socketMessages.filter(msg => 
        (msg.from._id === selectedUser._id && msg.to === user?.id) ||
        (msg.from._id === user?.id && msg.to === selectedUser._id)
      );
      
      if (relevantMessages.length > 0) {
        setConversationMessages(prev => [...prev, ...relevantMessages]);
      }
    }
  }, [socketMessages, selectedUser, user]);

  const loadUsers = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const fetchedUsers = await apiService.getUsers(user.userType);
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadConversation = async (userId1: string, userId2: string) => {
    try {
      const messages = await apiService.getMessages(userId1, userId2);
      setConversationMessages(messages);
      
      // Mark messages as read
      await apiService.markMessagesAsRead(userId1, userId2);
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  const handleSendMessage = () => {
    if (!user || !selectedUser || !newMessage.trim()) return;

    // Send via socket
    sendMessage(selectedUser._id, newMessage.trim());
    setNewMessage('');
    setIsTyping(false);
    setTyping(selectedUser._id, false);

    toast({
      title: "Message Sent",
      description: `Your message has been sent to ${selectedUser.name}`
    });
  };

  const handleTyping = (value: string) => {
    setNewMessage(value);
    
    if (selectedUser && user) {
      const typing = value.length > 0;
      if (typing !== isTyping) {
        setIsTyping(typing);
        setTyping(selectedUser._id, typing);
      }
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.department && u.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.specialty && u.specialty.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4">Access Restricted</h2>
          <p className="text-muted-foreground mb-6">Please log in to access the communication platform.</p>
          <Button onClick={() => navigate('/login')}>
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary-accent bg-clip-text text-transparent mb-4">
            Communication Hub
          </h1>
          <p className="text-xl text-muted-foreground">
            {user.userType === 'counselor' 
              ? 'Connect with students who need support'
              : 'Connect with professional counselors for guidance'
            }
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Users List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  {user.userType === 'counselor' ? 'Students' : 'Counselors'}
                </CardTitle>
                <CardDescription>
                  {filteredUsers.length} {user.userType === 'counselor' ? 'students' : 'counselors'} available
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Users List */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredUsers.map((userData) => (
                    <div
                      key={userData._id}
                      onClick={() => setSelectedUser(userData)}
                      className={`p-3 rounded-lg border cursor-pointer transition-smooth hover:bg-muted/50 ${
                        selectedUser?._id === userData._id ? 'bg-primary/10 border-primary' : 'border-border'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary-accent rounded-full flex items-center justify-center relative">
                            <User className="h-5 w-5 text-white" />
                            {onlineUsers.has(userData._id) && (
                              <Circle className="absolute -bottom-1 -right-1 h-3 w-3 fill-green-500 text-green-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{userData.name}</p>
                            <p className="text-sm text-muted-foreground truncate">{userData.email}</p>
                            {userData.userType === 'student' && userData.department && (
                              <p className="text-xs text-muted-foreground">{userData.department}</p>
                            )}
                            {userData.userType === 'counselor' && userData.specialty && (
                              <p className="text-xs text-muted-foreground">{userData.specialty}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge variant={userData.userType === 'student' ? 'secondary' : 'default'} className="text-xs">
                            {userData.userType === 'student' ? 'Student' : 'Counselor'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {onlineUsers.has(userData._id) ? 'Online' : `Last seen ${formatDate(userData.lastSeen)}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      {searchTerm ? 'No users found matching your search.' : `No ${user.userType === 'counselor' ? 'students' : 'counselors'} available.`}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {selectedUser ? (
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary-accent rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle>{selectedUser.name}</CardTitle>
                      <CardDescription className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>{selectedUser.email}</span>
                        <Badge variant={selectedUser.userType === 'student' ? 'secondary' : 'default'}>
                          {selectedUser.userType === 'student' ? 'Student' : 'Counselor'}
                        </Badge>
                      </CardDescription>
                    </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="text-sm text-muted-foreground">
                        {isConnected ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>
                  </div>
                  {selectedUser.userType === 'counselor' && selectedUser.availability && (
                    <p className="text-sm text-muted-foreground">Available: {selectedUser.availability}</p>
                  )}
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {conversationMessages.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      conversationMessages.map((message) => (
                        <div
                          key={message._id}
                          className={`flex ${message.from._id === user.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.from._id === user.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-foreground'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.from._id === user.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                            }`}>
                              {formatDate(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                    
                    {/* Typing indicator */}
                    {typingUsers.has(selectedUser._id) && (
                      <div className="flex justify-start">
                        <div className="bg-muted text-foreground px-4 py-2 rounded-lg">
                          <p className="text-sm italic">{selectedUser.name} is typing...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <Textarea
                      placeholder={`Send a message to ${selectedUser.name}...`}
                      value={newMessage}
                      onChange={(e) => handleTyping(e.target.value)}
                      className="flex-1 min-h-[60px] resize-none"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="self-end"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Press Enter to send, Shift+Enter for new line
                  </p>
                </div>
              </Card>
            ) : (
              <Card className="h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Select a {user.userType === 'counselor' ? 'Student' : 'Counselor'}</h3>
                  <p className="text-muted-foreground">
                    Choose someone from the list to start a conversation
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Information Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Privacy & Confidentiality</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                All conversations are private and confidential. Messages are stored securely and only 
                accessible to the participants. Please maintain professional boundaries and respect 
                in all communications.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Emergency Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                If you're experiencing a mental health crisis, please contact:
              </p>
              <div className="space-y-1 text-sm">
                <p><strong>Crisis Hotline:</strong> +234 809 877 6842</p>
                <p><strong>Emergency:</strong> 199</p>
                <p className="text-xs text-muted-foreground">Available 24/7</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;