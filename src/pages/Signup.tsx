import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Heart, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';

const Signup = () => {
  const [userType, setUserType] = useState<'student' | 'counselor'>('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Student fields
    age: '',
    gender: '',
    department: '',
    // Counselor fields
    specialty: '',
    bio: '',
    availability: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      return 'Please fill in all required fields.';
    }
    
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match.';
    }
    
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }
    
    if (userType === 'student' && (!formData.age || !formData.gender || !formData.department)) {
      return 'Please fill in all student information.';
    }
    
    if (userType === 'counselor' && (!formData.specialty || !formData.bio || !formData.availability)) {
      return 'Please fill in all counselor information.';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        userType,
        ...(userType === 'student' ? {
          age: parseInt(formData.age),
          gender: formData.gender,
          department: formData.department
        } : {
          specialty: formData.specialty,
          bio: formData.bio,
          availability: formData.availability
        })
      };

      const success = await signup(userData);
      if (success) {
        setSuccess('Account created successfully! Redirecting...');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError('An account with this email already exists.');
      }
    } catch (err) {
      setError('An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const departments = [
    'Computer Science',
    'Psychology',
    'Medicine',
    'Engineering',
    'Business Administration',
    'Law',
    'Education',
    'Arts',
    'Social Sciences',
    'Other'
  ];

  const specialties = [
    'Anxiety & Depression',
    'Academic Stress',
    'Relationship Counseling',
    'Career Guidance',
    'Trauma & PTSD',
    'Addiction Counseling',
    'Family Therapy',
    'Group Therapy',
    'General Counseling'
  ];

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary-accent rounded-full flex items-center justify-center shadow-soft">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-foreground">Join FULafia</h2>
          <p className="text-muted-foreground">
            Create your account and start your mental health journey with us.
          </p>
        </div>

        {/* User Type Selection */}
        <Card className="card-soft">
          <CardHeader>
            <CardTitle>I am a...</CardTitle>
            <CardDescription>
              Select your role to customize your experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant={userType === 'student' ? 'default' : 'outline'}
                onClick={() => setUserType('student')}
                className="h-auto p-6 flex flex-col space-y-2"
              >
                <span className="text-2xl">🎓</span>
                <span className="font-medium">Student</span>
                <span className="text-xs text-muted-foreground">
                  Seeking mental health support
                </span>
              </Button>
              <Button
                type="button"
                variant={userType === 'counselor' ? 'default' : 'outline'}
                onClick={() => setUserType('counselor')}
                className="h-auto p-6 flex flex-col space-y-2"
              >
                <span className="text-2xl">👨‍⚕️</span>
                <span className="font-medium">Counselor</span>
                <span className="text-xs text-muted-foreground">
                  Providing mental health support
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Registration Form */}
        <Card className="card-soft">
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              {userType === 'student' 
                ? 'Student registration - all fields are required'
                : 'Counselor registration - all fields are required'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-smooth"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-smooth"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Student-specific fields */}
              {userType === 'student' && (
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-medium text-foreground">Student Information</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age *</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="Your age"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        required
                        min="16"
                        max="100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender *</Label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department *</Label>
                      <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Counselor-specific fields */}
              {userType === 'counselor' && (
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-medium text-foreground">Counselor Information</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="specialty">Specialty *</Label>
                      <Select value={formData.specialty} onValueChange={(value) => handleInputChange('specialty', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          {specialties.map((specialty) => (
                            <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio *</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about your experience and approach to counseling..."
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        required
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="availability">Availability Schedule *</Label>
                      <Input
                        id="availability"
                        placeholder="e.g., Mon-Fri, 9AM-5PM"
                        value={formData.availability}
                        onChange={(e) => handleInputChange('availability', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full hero-gradient hover:shadow-soft transition-smooth"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-primary hover:text-primary-dark transition-smooth"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;