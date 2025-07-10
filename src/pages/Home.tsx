import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Shield, Users, BookOpen, Brain, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Home = () => {
  const mentalHealthVideos = [
    {
      id: 1,
      title: "Understanding Anxiety",
      videoId: "F2hc2FLOdhI", // YouTube video ID
      description: "Learn about anxiety disorders and coping strategies"
    },
    {
      id: 2,
      title: "Depression Awareness",
      videoId: "z-IR48Mb3W0", // YouTube video ID
      description: "Understanding depression and seeking help"
    },
    {
      id: 3,
      title: "Stress Management",
      videoId: "hnpQrMqDoqE", // YouTube video ID
      description: "Effective techniques for managing stress"
    },
    {
      id: 4,
      title: "Building Resilience",
      videoId: "NWH8N-BvhAw", // YouTube video ID
      description: "Developing mental resilience and strength"
    }
  ];

  const wellnessStrategies = [
    {
      icon: <Brain className="h-6 w-6 text-primary" />,
      title: "Mindfulness & Meditation",
      description: "Practice being present and reducing mental clutter through guided meditation and breathing exercises."
    },
    {
      icon: <Sun className="h-6 w-6 text-secondary-accent" />,
      title: "Positive Thinking",
      description: "Cultivate optimism and positive self-talk to improve your mental outlook and resilience."
    },
    {
      icon: <Users className="h-6 w-6 text-accent" />,
      title: "Social Connection",
      description: "Build and maintain healthy relationships with friends, family, and support networks."
    },
    {
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      title: "Continuous Learning",
      description: "Engage in activities that challenge your mind and promote personal growth."
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative hero-gradient text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Your Mental Health
              <span className="block text-accent-light">Matters</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto">
              Welcome to FULafia - a safe space for mental health awareness, counseling, and support for students.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/quiz">
                <Button size="lg" className="warm-gradient hover:shadow-accent transition-smooth text-lg px-8">
                  Take Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-smooth text-lg px-8">
                  Find a Counselor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mental Health Awareness Section */}
      <section className="container mx-auto px-4">
        <div className="text-center space-y-8 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Understanding Mental Health
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Mental health is just as important as physical health. It affects how we think, feel, and act in our daily lives.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <Card className="hover-lift transition-smooth card-soft">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Types of Mental Health Disorders</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Common mental health conditions include anxiety disorders, depression, bipolar disorder, PTSD, and eating disorders. Each affects individuals differently and requires understanding and support.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover-lift transition-smooth card-soft">
            <CardHeader>
              <div className="w-12 h-12 bg-secondary-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-secondary-accent" />
              </div>
              <CardTitle className="text-xl">Prevention Techniques</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Regular exercise, healthy eating, adequate sleep, stress management, and maintaining social connections are key prevention strategies for mental health issues.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover-lift transition-smooth card-soft">
            <CardHeader>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-xl">Improving Well-being</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Practice mindfulness, maintain a gratitude journal, set realistic goals, seek professional help when needed, and remember that seeking help is a sign of strength.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Video Carousel Section */}
      <section className="gentle-gradient py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Mental Health Education Videos
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn from experts about various mental health topics through these educational videos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mentalHealthVideos.map((video) => (
              <Card key={video.id} className="hover-lift transition-smooth card-soft">
                <CardContent className="p-0">
                  <div className="aspect-video rounded-t-lg overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${video.videoId}`}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{video.title}</h3>
                    <p className="text-sm text-muted-foreground">{video.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Wellness Strategies Section */}
      <section className="container mx-auto px-4">
        <div className="text-center space-y-8 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Ways to Improve Mental Well-being
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Small daily practices can make a significant difference in your mental health journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {wellnessStrategies.map((strategy, index) => (
            <Card key={index} className="hover-lift transition-smooth card-soft text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  {strategy.icon}
                </div>
                <CardTitle className="text-lg">{strategy.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {strategy.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="warm-gradient text-white py-16">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Take the First Step?
          </h2>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto">
            Your mental health journey starts with understanding yourself. Take our assessment or connect with a counselor today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/quiz">
              <Button size="lg" className="bg-white text-accent hover:bg-gray-100 transition-smooth text-lg px-8">
                Start Assessment
              </Button>
            </Link>
            <Link to="/resources">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 transition-smooth text-lg px-8">
                Explore Resources
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;