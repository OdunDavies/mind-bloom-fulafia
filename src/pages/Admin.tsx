import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Calendar, BookOpen, Users, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [filter, setFilter] = useState<'all' | 'student' | 'counselor'>('all');

  useEffect(() => {
    // Load users from localStorage
    const savedUsers = localStorage.getItem('fulafia_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  // Simple admin check - in a real app, this would be more secure
  if (!user || user.userType !== 'counselor') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4">Access Restricted</h2>
          <p className="text-muted-foreground mb-6">This page is only accessible to counselors.</p>
          <Button onClick={() => navigate('/')}>
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(u => filter === 'all' || u.userType === filter);
  const studentCount = users.filter(u => u.userType === 'student').length;
  const counselorCount = users.filter(u => u.userType === 'counselor').length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary-accent bg-clip-text text-transparent mb-4">
            User Management
          </h1>
          <p className="text-xl text-muted-foreground">
            View and manage registered users
          </p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold text-primary">{users.length}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Students</p>
                  <p className="text-3xl font-bold text-secondary-accent">{studentCount}</p>
                </div>
                <User className="h-8 w-8 text-secondary-accent" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Counselors</p>
                  <p className="text-3xl font-bold text-accent">{counselorCount}</p>
                </div>
                <Shield className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-4 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All Users ({users.length})
          </Button>
          <Button
            variant={filter === 'student' ? 'default' : 'outline'}
            onClick={() => setFilter('student')}
          >
            Students ({studentCount})
          </Button>
          <Button
            variant={filter === 'counselor' ? 'default' : 'outline'}
            onClick={() => setFilter('counselor')}
          >
            Counselors ({counselorCount})
          </Button>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.map((userData) => (
            <Card key={userData.id} className="hover-lift transition-smooth">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary-accent rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{userData.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{userData.email}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={userData.userType === 'student' ? 'secondary' : 'default'}>
                    {userData.userType === 'student' ? 'Student' : 'Counselor'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Joined {formatDate(userData.createdAt)}</span>
                  </div>
                  
                  {userData.userType === 'student' && (
                    <>
                      {userData.age && (
                        <div className="text-sm">
                          <span className="font-medium">Age:</span> {userData.age}
                        </div>
                      )}
                      {userData.gender && (
                        <div className="text-sm">
                          <span className="font-medium">Gender:</span> {userData.gender}
                        </div>
                      )}
                      {userData.department && (
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{userData.department}</span>
                        </div>
                      )}
                    </>
                  )}
                  
                  {userData.userType === 'counselor' && (
                    <>
                      {userData.specialty && (
                        <div className="text-sm">
                          <span className="font-medium">Specialty:</span> {userData.specialty}
                        </div>
                      )}
                      {userData.availability && (
                        <div className="text-sm">
                          <span className="font-medium">Available:</span> {userData.availability}
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                {userData.userType === 'counselor' && userData.bio && (
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">{userData.bio}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Users Found</h3>
            <p className="text-muted-foreground">
              {filter === 'all' 
                ? 'No users have registered yet.' 
                : `No ${filter}s have registered yet.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;