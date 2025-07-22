import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { User, Mail, MessageSquare, Send, Users, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface StoredUser {
  id: string;
  name: string;
  email: string;
  userType: 'student' | 'counselor';
  age?: number;
  gender?: string;
  department?: string;
  specialty?: string;
  bio?: string;
  availability?: string;
  createdAt: string;
}

interface Message {
  id: string;
  from: string;
  to: string;
  fromName: string;
  toName: string;
  content: string;
  timestamp: string;
}

const Contact = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<StoredUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) return;

    // Load users from localStorage
    const savedUsers = localStorage.getItem('fulafia_users');
    if (savedUsers) {
      const allUsers = JSON.parse(savedUsers) as StoredUser[];
      // Filter out current user and show appropriate users based on role
      const filteredUsers = allUsers.filter(u => {
        if (u.id === user.id) return false; // Don't show current user
        
        if (user.userType === 'counselor') {
          return u.userType === 'student'; // Counselors see students
        } else {
          return u.userType === 'counselor'; // Students see counselors
        }
      });
      setUsers(filteredUsers);
    }
  }, [user]);

  useEffect(() => {
    if (selectedUser && user) {
      loadMessages(user.id, selectedUser.id);
    }
  }, [selectedUser, user]);

  const loadMessages = (userId1: string, userId2: string) => {
    const savedMessages = localStorage.getItem('fulafia_messages');
    if (savedMessages) {
      const allMessages = JSON.parse(savedMessages) as Message[];
      const conversation = allMessages.filter(msg => 
        (msg.from === userId1 && msg.to === userId2) || 
        (msg.from === userId2 && msg.to === userId1)
      ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      setMessages(conversation);
    }
  };

  const sendMessage = () => {
    if (!user || !selectedUser || !newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      from: user.id,
      to: selectedUser.id,
      fromName: user.name,
      toName: selectedUser.name,
      content: newMessage.trim(),
      timestamp: new Date().toISOString()
    };

    // Save message to localStorage
    const savedMessages = localStorage.getItem('fulafia_messages');
    const allMessages = savedMessages ? JSON.parse(savedMessages) : [];
    allMessages.push(message);
    localStorage.setItem('fulafia_messages', JSON.stringify(allMessages));

    // Update local state
    setMessages(prev => [...prev, message]);
    setNewMessage('');

    toast({
      title: "Message Sent",
      description: `Your message has been sent to ${selectedUser.name}`,
    });
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
                      key={userData.id}
                      onClick={() => setSelectedUser(userData)}
                      className={`p-3 rounded-lg border cursor-pointer transition-smooth hover:bg-muted/50 ${
                        selectedUser?.id === userData.id ? 'bg-primary/10 border-primary' : 'border-border'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary-accent rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
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
                        <Badge variant={userData.userType === 'student' ? 'secondary' : 'default'} className="text-xs">
                          {userData.userType === 'student' ? 'Student' : 'Counselor'}
                        </Badge>
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
                  {selectedUser.userType === 'counselor' && selectedUser.availability && (
                    <p className="text-sm text-muted-foreground">Available: {selectedUser.availability}</p>
                  )}
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.from === user.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.from === user.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-foreground'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.from === user.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                            }`}>
                              {formatDate(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <Textarea
                      placeholder={`Send a message to ${selectedUser.name}...`}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 min-h-[60px] resize-none"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                    <Button 
                      onClick={sendMessage}
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