import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MessageSquare, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Counselor {
  id: string;
  name: string;
  email: string;
  specialty: string;
  bio: string;
  availability: string;
}

const Contact = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [counselors, setCounselors] = useState<Counselor[]>([]);

  useEffect(() => {
    // Redirect counselors to home page
    if (user?.userType === 'counselor') {
      navigate('/');
      return;
    }

    // Load counselors from localStorage or create mock data
    const savedCounselors = localStorage.getItem('fulafia_counselors');
    if (savedCounselors) {
      setCounselors(JSON.parse(savedCounselors));
    } else {
      // Create mock counselor data
      const mockCounselors: Counselor[] = [
        {
          id: '1',
          name: 'Dr. Amina Ibrahim',
          email: 'dr.amina@fulafia.edu.ng',
          specialty: 'Anxiety & Stress Management',
          bio: 'Specialized in helping students manage academic stress and anxiety disorders. Over 8 years of experience in cognitive behavioral therapy.',
          availability: 'Monday - Friday, 9:00 AM - 4:00 PM'
        },
        {
          id: '2',
          name: 'Dr. Chukwuemeka Okafor',
          email: 'dr.chukwuemeka@fulafia.edu.ng',
          specialty: 'Depression & Mood Disorders',
          bio: 'Expert in treating depression and mood disorders in young adults. Focuses on solution-focused therapy and mindfulness techniques.',
          availability: 'Tuesday - Saturday, 10:00 AM - 5:00 PM'
        },
        {
          id: '3',
          name: 'Dr. Fatima Abubakar',
          email: 'dr.fatima@fulafia.edu.ng',
          specialty: 'Relationship & Social Issues',
          bio: 'Helps students navigate relationships, social anxiety, and interpersonal challenges. Specializes in group therapy and peer support.',
          availability: 'Monday - Thursday, 11:00 AM - 6:00 PM'
        },
        {
          id: '4',
          name: 'Dr. Samuel Adebayo',
          email: 'dr.samuel@fulafia.edu.ng',
          specialty: 'Academic Performance & Motivation',
          bio: 'Supports students with academic challenges, procrastination, and motivation issues. Expert in educational psychology.',
          availability: 'Wednesday - Friday, 8:00 AM - 3:00 PM'
        }
      ];
      
      localStorage.setItem('fulafia_counselors', JSON.stringify(mockCounselors));
      setCounselors(mockCounselors);
    }
  }, [user, navigate]);

  const handleContactCounselor = (counselor: Counselor) => {
    // In a real app, this would open a chat or booking system
    alert(`Contact feature coming soon! You can reach ${counselor.name} at ${counselor.email}`);
  };

  if (user?.userType === 'counselor') {
    return null; // Will redirect
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
                    className="w-full warm-gradient hover:shadow-accent transition-smooth"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Counselor
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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