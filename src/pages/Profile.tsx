import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Calendar, BookOpen, Clock, MapPin, FileText, Award, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, quizResult, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Access Restricted</h2>
          <p className="text-muted-foreground mb-6">Please log in to view your profile.</p>
          <Button onClick={() => navigate('/login')}>
            Login
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'Mild': return 'bg-green-100 text-green-800 border-green-200';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'Mild': return <Heart className="h-4 w-4" />;
      case 'Moderate': return <Clock className="h-4 w-4" />;
      case 'Critical': return <Award className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary-accent bg-clip-text text-transparent mb-2">
              {user.name}
            </h1>
            <Badge variant="secondary" className="text-sm">
              {user.userType === 'student' ? 'Student' : 'Counselor'}
            </Badge>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      <p className="text-foreground font-medium">{user.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p className="text-foreground">{user.email}</p>
                      </div>
                    </div>
                    {user.userType === 'student' && (
                      <>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Age</label>
                          <p className="text-foreground">{user.age}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Gender</label>
                          <p className="text-foreground">{user.gender}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-muted-foreground">Department</label>
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                            <p className="text-foreground">{user.department}</p>
                          </div>
                        </div>
                      </>
                    )}
                    {user.userType === 'counselor' && (
                      <>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Specialty</label>
                          <p className="text-foreground">{user.specialty}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Availability</label>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <p className="text-foreground">{user.availability}</p>
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-muted-foreground">Bio</label>
                          <p className="text-foreground leading-relaxed">{user.bio}</p>
                        </div>
                      </>
                    )}
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p className="text-foreground">{formatDate(user.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quiz Results for Students */}
              {user.userType === 'student' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Mental Health Assessment
                    </CardTitle>
                    <CardDescription>
                      Your latest assessment results and recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {quizResult ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`px-3 py-1 rounded-full border flex items-center space-x-2 ${getResultColor(quizResult.result)}`}>
                              {getResultIcon(quizResult.result)}
                              <span className="font-medium">{quizResult.result}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Score: {quizResult.score}/24
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(quizResult.timestamp)}
                          </div>
                        </div>
                        
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <h4 className="font-medium mb-2 text-foreground">Recommendations:</h4>
                          {quizResult.result === 'Mild' && (
                            <p className="text-sm text-muted-foreground">
                              Your mental health appears to be in a good state. Continue practicing self-care 
                              and maintain healthy coping strategies. Consider our resources for ongoing wellness.
                            </p>
                          )}
                          {quizResult.result === 'Moderate' && (
                            <p className="text-sm text-muted-foreground">
                              You may be experiencing some mental health challenges. Consider speaking with 
                              a counselor and explore our self-help resources. Remember, seeking help is a sign of strength.
                            </p>
                          )}
                          {quizResult.result === 'Critical' && (
                            <p className="text-sm text-muted-foreground">
                              Your responses indicate you may be struggling significantly. We strongly recommend 
                              reaching out to a mental health professional immediately. Crisis support is available 24/7.
                            </p>
                          )}
                        </div>
                        
                        <Button 
                          variant="outline" 
                          onClick={() => navigate('/quiz')}
                          className="w-full"
                        >
                          Retake Assessment
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h4 className="font-medium mb-2 text-foreground">No Assessment Taken</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Take our mental health assessment to get personalized insights and recommendations.
                        </p>
                        <Button onClick={() => navigate('/quiz')}>
                          Take Assessment
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {user.userType === 'student' && (
                    <>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => navigate('/quiz')}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Take Assessment
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => navigate('/contact')}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Find Counselor
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => navigate('/blog')}
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Share Story
                      </Button>
                    </>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/resources')}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    View Resources
                  </Button>
                </CardContent>
              </Card>

              {/* Account Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="destructive" 
                    onClick={logout}
                    className="w-full"
                  >
                    Logout
                  </Button>
                </CardContent>
              </Card>

              {/* Crisis Support */}
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-800">Need Immediate Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-red-700 mb-3">
                    If you're in crisis or having thoughts of self-harm, please reach out immediately.
                  </p>
                  <div className="space-y-2">
                    <div className="font-semibold text-red-800">Crisis Hotline:</div>
                    <div className="text-lg font-bold text-red-900">+234 809 877 6842</div>
                    <div className="text-xs text-red-600">Available 24/7</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;