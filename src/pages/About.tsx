import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heart, Users, Shield, Award, Target, Lightbulb } from 'lucide-react';

const About = () => {
  const stats = [
    { number: '500+', label: 'Students Supported', icon: Users },
    { number: '95%', label: 'Satisfaction Rate', icon: Award },
    { number: '24/7', label: 'Crisis Support', icon: Heart },
    { number: '12', label: 'Professional Counselors', icon: Shield }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Empathy',
      description: 'We approach every interaction with genuine care and understanding, creating a safe space where students feel heard and valued.'
    },
    {
      icon: Shield,
      title: 'Confidentiality',
      description: 'Your privacy is paramount. All conversations and sessions are strictly confidential, ensuring you can share openly without fear.'
    },
    {
      icon: Lightbulb,
      title: 'Growth',
      description: 'We believe in every student\'s potential for growth and healing. Our goal is to empower you with tools for lasting positive change.'
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Counseling Unit Established',
      description: 'FULafia Mental Health Counseling Unit was founded to address the growing mental health needs of university students.'
    },
    {
      year: '2021',
      title: 'First 100 Students Reached',
      description: 'We celebrated supporting our first 100 students through individual counseling and group therapy sessions.'
    },
    {
      year: '2022',
      title: 'Crisis Intervention Program',
      description: 'Launched 24/7 crisis intervention services and established partnerships with local mental health organizations.'
    },
    {
      year: '2023',
      title: 'Peer Support Network',
      description: 'Introduced peer counseling program and mental health awareness workshops across all departments.'
    },
    {
      year: '2024',
      title: 'Digital Mental Health Platform',
      description: 'Launched this comprehensive platform to make mental health resources more accessible to all students.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary-accent rounded-full flex items-center justify-center">
              <Heart className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary-accent bg-clip-text text-transparent mb-4">
            About FULafia Mental Health Counseling
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Dedicated to supporting the mental health and well-being of Federal University Lafia students 
            through comprehensive counseling services, awareness programs, and community support.
          </p>
        </div>

        {/* Mission Statement */}
        <section className="mb-16">
          <Card className="border-none shadow-elegant">
            <CardContent className="p-12">
              <div className="text-center">
                <h2 className="text-3xl font-semibold mb-6 text-foreground">Our Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                  To provide accessible, culturally sensitive, and evidence-based mental health support 
                  that empowers FULafia students to overcome challenges, develop resilience, and achieve 
                  their full academic and personal potential in a supportive, stigma-free environment.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Impact Statistics */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-center mb-10 text-foreground">Our Impact</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover-lift transition-smooth">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    <stat.icon className="h-12 w-12 text-primary" />
                  </div>
                  <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Core Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-center mb-10 text-foreground">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="hover-lift transition-smooth">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary-accent rounded-full flex items-center justify-center">
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-primary">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Journey Timeline */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-center mb-10 text-foreground">Our Journey</h2>
          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-6 mb-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary-accent rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{milestone.year}</span>
                  </div>
                </div>
                <Card className="flex-1 hover-lift transition-smooth">
                  <CardHeader>
                    <CardTitle className="text-primary">{milestone.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section>
          <Card className="bg-gradient-to-r from-primary/10 to-secondary-accent/10 border-none">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-semibold mb-6 text-foreground">Ready to Start Your Journey?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Whether you're struggling with stress, anxiety, depression, or just need someone to talk to, 
                we're here for you. Your mental health matters, and taking the first step takes courage.
              </p>
              <div className="space-y-4">
                <div className="text-lg font-semibold text-primary">
                  Crisis Hotline: +234 809 877 6842
                </div>
                <div className="text-sm text-muted-foreground">
                  Available 24/7 • Confidential • Judgment-Free
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default About;