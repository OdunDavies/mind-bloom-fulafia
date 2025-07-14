import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MessageSquare, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import ChatComponent from '@/components/Chat/ChatComponent';
import type { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;

const Contact = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [counselors, setCounselors] = useState<Profile[]>([]);
  const [criticalStudents, setCriticalStudents] = useState<Profile[]>([]);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    if (!user || !profile || loading) return;

    const fetchUsers = async () => {
      setChatLoading(true);
      
      if (profile.user_type === 'counselor') {
        // Load students with critical assessment results
        const { data: students } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_type', 'student')
          .eq('quiz_result', 'Critical')
          .order('quiz_timestamp', { ascending: false });

        if (students) {
          setCriticalStudents(students);
        }
      } else {
        // Load all counselors for students
        const { data: counselorData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_type', 'counselor')
          .order('name');

        if (counselorData) {
          setCounselors(counselorData);
        }
      }
      
      setChatLoading(false);
    };

    fetchUsers();
  }, [user, profile, loading]);

  const handleStartChat = (otherUser: Profile) => {
    setSelectedUser(otherUser);
  };

  const handleBackToList = () => {
    setSelectedUser(null);
  };

  if (loading || chatLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Access Restricted</h2>
          <p className="text-muted-foreground mb-6">Please log in to access chat functionality.</p>
          <Button onClick={() => navigate('/login')}>
            Login
          </Button>
        </div>
      </div>
    );
  }

  // Show chat interface if user is selected
  if (selectedUser) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <ChatComponent 
            otherUserId={selectedUser.id}
            otherUserName={selectedUser.name}
            onBack={handleBackToList}
          />
        </div>
      </div>
    );
  }

  // Show different content for counselors vs students
  if (profile?.user_type === 'counselor') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary-accent bg-clip-text text-transparent mb-4">
              Students Requiring Immediate Attention
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Students who have taken assessments with critical results and may need immediate support
            </p>
          </div>

          {criticalStudents.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-semibold text-muted-foreground mb-4">No Critical Cases</h3>
              <p className="text-muted-foreground">There are currently no students with critical assessment results requiring immediate attention.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
              {criticalStudents.map((student) => (
                <Card key={student.id} className="hover-lift transition-smooth border-destructive/20">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-destructive to-destructive/80 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-foreground">{student.name}</CardTitle>
                          <CardDescription className="text-sm">{student.email}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        Critical
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-primary mb-2 flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Department
                      </h4>
                      <p className="text-sm font-medium text-foreground">{student.department || 'Not specified'}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-primary mb-2 flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Assessment Details
                      </h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Score: {student.quiz_score || 'N/A'}/24</p>
                        <p>Result: <span className="text-destructive font-medium">{student.quiz_result || 'N/A'}</span></p>
                        <p>Date: {student.quiz_timestamp ? new Date(student.quiz_timestamp).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button 
                        onClick={() => handleStartChat(student)}
                        className="w-full bg-destructive hover:bg-destructive/90 text-white transition-smooth"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Start Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-4 text-foreground">Crisis Intervention Protocol</h3>
                <p className="text-muted-foreground mb-6">
                  These students have scored in the critical range and require immediate attention. 
                  Please prioritize reaching out to them as soon as possible.
                </p>
                <div className="space-y-2">
                  <div className="text-lg font-semibold text-primary">Emergency Contact: +234 809 877 6842</div>
                  <div className="text-sm text-muted-foreground">Available 24/7</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary-accent bg-clip-text text-transparent mb-4">
            Connect with Counselors
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our experienced counselors are here to support you through your mental health journey
          </p>
        </div>

        {counselors.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-muted-foreground mb-4">No Counselors Available</h3>
            <p className="text-muted-foreground">There are currently no counselors registered in the system.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {counselors.map((counselor) => (
              <Card key={counselor.id} className="hover-lift transition-smooth">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary-accent rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-foreground">{counselor.name}</CardTitle>
                        <CardDescription className="text-sm">{counselor.email}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Available
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-primary mb-2 flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Specialty
                    </h4>
                    <p className="text-sm font-medium text-foreground">{counselor.specialty || 'General Counseling'}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-primary mb-2">About</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{counselor.bio || 'Professional counselor available to help.'}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-primary mb-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Availability
                    </h4>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{counselor.availability || 'Contact for availability'}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => handleStartChat(counselor)}
                      className="w-full warm-gradient hover:shadow-accent transition-smooth"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Start Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-4 text-foreground">Need Immediate Help?</h3>
              <p className="text-muted-foreground mb-6">
                If you're experiencing a mental health emergency, please contact our crisis hotline 
                or visit the nearest emergency room.
              </p>
              <div className="space-y-2">
                <div className="text-lg font-semibold text-primary">Crisis Hotline: +234 809 877 6842</div>
                <div className="text-sm text-muted-foreground">Available 24/7</div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Contact;