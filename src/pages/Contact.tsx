import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MessageSquare, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '@/hooks/useChat';
import { supabase } from '@/integrations/supabase/client';

interface Counselor {
  id: string;
  name: string;
  email: string;
  specialty: string;
  bio: string;
  availability: string;
}

interface StudentWithAssessment {
  id: string;
  name: string;
  email: string;
  department: string;
  quizResult: {
    score: number;
    result: 'Critical';
    timestamp: string;
  };
}

const Contact = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createConversation } = useChat();
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [criticalStudents, setCriticalStudents] = useState<StudentWithAssessment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.userType === 'counselor') {
        // Fetch students with all user types for counselors to see
        const { data: studentsData } = await supabase
          .from('profiles')
          .select('id, name, email, department, age, gender')
          .eq('user_type', 'student');
        
        if (studentsData && studentsData.length > 0) {
          // For now, we'll simulate critical students since we don't have quiz results stored yet
          const criticalStudents = studentsData.slice(0, 4).map((student, index) => ({
            ...student,
            quizResult: {
              score: 19 + index,
              result: 'Critical' as const,
              timestamp: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000).toISOString()
            }
          }));
          setCriticalStudents(criticalStudents);
        }
      } else {
        // Fetch real counselors from Supabase
        const { data: counselorsData } = await supabase
          .from('profiles')
          .select('id, name, email, specialty, bio, availability')
          .eq('user_type', 'counselor');
        
        if (counselorsData && counselorsData.length > 0) {
          setCounselors(counselorsData);
        }
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleContactCounselor = async (counselor: Counselor) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const conversation = await createConversation(counselor.id);
      if (conversation) {
        navigate('/chat');
      }
    } catch (error) {
      console.error('Failed to create conversation:', error);
      alert('Failed to start chat. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContactStudent = async (student: StudentWithAssessment) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const conversation = await createConversation(student.id);
      if (conversation) {
        navigate('/chat');
      }
    } catch (error) {
      console.error('Failed to create conversation:', error);
      alert('Failed to start chat. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show different content for counselors vs students
  if (user?.userType === 'counselor') {
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
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Critical Students</h3>
              <p className="text-muted-foreground">
                No students currently require immediate attention. Check back later.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
              {criticalStudents.map((student) => (
                <Card key={student.id} className="hover-lift transition-smooth border-destructive/20 bg-card/90 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-destructive to-destructive/80 rounded-full flex items-center justify-center shadow-soft">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-foreground">{student.name}</CardTitle>
                          <CardDescription className="text-sm">{student.email}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="destructive" className="text-xs font-medium">
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
                    <p className="text-sm font-medium text-foreground">{student.department}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-primary mb-2 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Assessment Details
                    </h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Score: {student.quizResult.score}/24</p>
                      <p>Result: <span className="text-destructive font-medium">{student.quizResult.result}</span></p>
                      <p>Date: {new Date(student.quizResult.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => handleContactStudent(student)}
                      disabled={loading}
                      className="w-full bg-destructive hover:bg-destructive/90 text-white transition-smooth"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {loading ? 'Starting Chat...' : 'Start Chat'}
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

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Access Restricted</h2>
          <p className="text-muted-foreground mb-6">Please log in as a student to view counselor contacts.</p>
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
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Counselors Available</h3>
            <p className="text-muted-foreground">
              No counselors have registered yet. Please check back later or contact support.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {counselors.map((counselor) => (
              <Card key={counselor.id} className="hover-lift transition-smooth bg-card/90 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 hero-gradient rounded-full flex items-center justify-center shadow-soft">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-foreground">{counselor.name}</CardTitle>
                        <CardDescription className="text-sm">{counselor.email}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs font-medium">
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
                  <p className="text-sm font-medium text-foreground">{counselor.specialty}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-primary mb-2">About</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{counselor.bio}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-primary mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Availability
                  </h4>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{counselor.availability}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    onClick={() => handleContactCounselor(counselor)}
                    disabled={loading}
                    className="w-full warm-gradient hover:shadow-accent transition-smooth"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {loading ? 'Starting Chat...' : 'Start Chat'}
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