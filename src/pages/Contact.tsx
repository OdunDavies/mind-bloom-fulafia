import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, Profile } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { User, Mail, MessageSquare, Send, Users, Search, Circle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<Profile[]>([]);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [conversationMessages, setConversationMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || authLoading) return;
    loadUsers();
  }, [user, authLoading]);

  const loadUsers = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Determine which user type to fetch based on current user
      const targetUserType = user.userType === 'student' ? 'counselor' : 'student';
      
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', targetUserType)
        .order('is_online', { ascending: false })
        .order('last_seen', { ascending: false });

      if (error) {
        console.error('Error loading users:', error);
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive"
        });
        return;
      }

      setUsers(profiles || []);
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

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStartConversation = (targetUser: Profile) => {
    setSelectedUser(targetUser);
    toast({
      title: "Conversation Started",
      description: `You can now chat with ${targetUser.name}. Real-time messaging will be available soon.`
    });
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.department && u.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.specialty && u.specialty.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

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
                      onClick={() => handleStartConversation(userData)}
                      className={`p-3 rounded-lg border cursor-pointer transition-smooth hover:bg-muted/50 ${
                        selectedUser?.id === userData.id ? 'bg-primary/10 border-primary' : 'border-border'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary-accent rounded-full flex items-center justify-center relative">
                            <User className="h-5 w-5 text-white" />
                            {userData.is_online && (
                              <Circle className="absolute -bottom-1 -right-1 h-3 w-3 fill-green-500 text-green-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{userData.name}</p>
                            <p className="text-sm text-muted-foreground truncate">{userData.email}</p>
                            {userData.user_type === 'student' && userData.department && (
                              <p className="text-xs text-muted-foreground">{userData.department}</p>
                            )}
                            {userData.user_type === 'counselor' && userData.specialty && (
                              <p className="text-xs text-muted-foreground">{userData.specialty}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge variant={userData.user_type === 'student' ? 'secondary' : 'default'} className="text-xs">
                            {userData.user_type === 'student' ? 'Student' : 'Counselor'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {userData.is_online ? 'Online' : `Last seen ${formatDate(userData.last_seen)}`}
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
                          <Badge variant={selectedUser.user_type === 'student' ? 'secondary' : 'default'}>
                            {selectedUser.user_type === 'student' ? 'Student' : 'Counselor'}
                          </Badge>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${selectedUser.is_online ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <span className="text-sm text-muted-foreground">
                        {selectedUser.is_online ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                  {selectedUser.user_type === 'counselor' && selectedUser.availability && (
                    <p className="text-sm text-muted-foreground">Available: {selectedUser.availability}</p>
                  )}
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4">
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-semibold mb-2">Real-time Chat Coming Soon</h3>
                    <p className="text-muted-foreground mb-4">
                      You've selected {selectedUser.name} for conversation. 
                      Real-time messaging functionality will be available in the next update.
                    </p>
                    <div className="bg-muted/50 rounded-lg p-4 text-left">
                      <h4 className="font-medium mb-2">Contact Information:</h4>
                      <p className="text-sm text-muted-foreground mb-1">
                        <strong>Email:</strong> {selectedUser.email}
                      </p>
                      {selectedUser.user_type === 'counselor' && selectedUser.specialty && (
                        <p className="text-sm text-muted-foreground mb-1">
                          <strong>Specialty:</strong> {selectedUser.specialty}
                        </p>
                      )}
                      {selectedUser.user_type === 'counselor' && selectedUser.availability && (
                        <p className="text-sm text-muted-foreground mb-1">
                          <strong>Availability:</strong> {selectedUser.availability}
                        </p>
                      )}
                      {selectedUser.user_type === 'counselor' && selectedUser.bio && (
                        <p className="text-sm text-muted-foreground">
                          <strong>Bio:</strong> {selectedUser.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>

                {/* Contact Actions */}
                <div className="border-t p-4">
                  <div className="flex space-x-2 justify-center">
                    <Button variant="outline" asChild>
                      <a href={`mailto:${selectedUser.email}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </a>
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedUser(null)}>
                      Back to List
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Select a {user.userType === 'counselor' ? 'Student' : 'Counselor'}</h3>
                  <p className="text-muted-foreground">
                    Choose someone from the list to view their contact information
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
                All interactions are private and confidential. Please maintain professional boundaries 
                and respect in all communications. Real-time messaging will be available soon.
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