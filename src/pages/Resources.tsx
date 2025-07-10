import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Globe, BookOpen, Heart, Brain, Sunrise } from 'lucide-react';

const Resources = () => {
  const ngos = [
    {
      name: "Mentally Aware Nigeria Initiative (MANI)",
      description: "Advocating for mental health awareness and support across Nigeria",
      contact: "+234 809 877 6842",
      website: "https://mani.org.ng"
    },
    {
      name: "She Writes Woman",
      description: "Supporting women's mental health and empowerment",
      contact: "+234 703 291 5555",
      website: "https://shewriteswoman.org"
    },
    {
      name: "Asido Foundation",
      description: "Mental health advocacy and suicide prevention",
      contact: "+234 809 210 6484",
      website: "https://asido.org.ng"
    }
  ];

  const hotlines = [
    { name: "National Suicide Prevention Lifeline", number: "18001273255" },
    { name: "Mental Health Nigeria", number: "+234 809 877 6842" },
    { name: "Lagos State Domestic Violence Hotline", number: "08000333333" },
    { name: "Suicide Prevention Nigeria", number: "+234 806 210 6493" }
  ];

  const books = [
    {
      title: "The Anxiety and Worry Workbook",
      author: "David A. Clark",
      description: "Practical strategies for overcoming anxiety and worry",
      link: "#"
    },
    {
      title: "Feeling Good: The New Mood Therapy",
      author: "David D. Burns",
      description: "Evidence-based approach to treating depression",
      link: "#"
    },
    {
      title: "The Mindful Way Through Depression",
      author: "Williams, Teasdale, Segal, Kabat-Zinn",
      description: "Using mindfulness to break free from depression",
      link: "#"
    },
    {
      title: "Emotional Intelligence",
      author: "Daniel Goleman",
      description: "Understanding and managing emotions effectively",
      link: "#"
    }
  ];

  const techniques = [
    {
      icon: Brain,
      title: "Daily Mindfulness",
      description: "5-10 minutes of meditation or breathing exercises",
      frequency: "Daily"
    },
    {
      icon: BookOpen,
      title: "Journaling",
      description: "Write down thoughts, feelings, and gratitude",
      frequency: "Daily"
    },
    {
      icon: Heart,
      title: "Gratitude Practice",
      description: "List 3 things you're grateful for each day",
      frequency: "Daily"
    },
    {
      icon: Sunrise,
      title: "Morning Routine",
      description: "Consistent wake-up time with positive activities",
      frequency: "Daily"
    },
    {
      icon: Phone,
      title: "Social Connection",
      description: "Reach out to friends or family members",
      frequency: "Weekly"
    },
    {
      icon: Globe,
      title: "Nature Walks",
      description: "Spend time outdoors for mental clarity",
      frequency: "Weekly"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary-accent bg-clip-text text-transparent mb-4">
            Mental Health Resources
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive support and resources for your mental health journey
          </p>
        </div>

        {/* NGOs and Help Centers */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-foreground">NGOs & Help Centers</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ngos.map((ngo, index) => (
              <Card key={index} className="hover-lift transition-smooth">
                <CardHeader>
                  <CardTitle className="text-primary">{ngo.name}</CardTitle>
                  <CardDescription>{ngo.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{ngo.contact}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a href={ngo.website} className="text-primary hover:underline">
                        Visit Website
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Emergency Hotlines */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-foreground">Emergency Hotlines</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {hotlines.map((hotline, index) => (
              <Card key={index} className="hover-lift transition-smooth">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{hotline.name}</h3>
                      <p className="text-2xl font-bold text-primary">{hotline.number}</p>
                    </div>
                    <Phone className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Self-Help Books */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-foreground">Recommended Books</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {books.map((book, index) => (
              <Card key={index} className="hover-lift transition-smooth">
                <CardHeader>
                  <CardTitle className="text-primary">{book.title}</CardTitle>
                  <CardDescription>by {book.author}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{book.description}</p>
                  <Button variant="outline" size="sm">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Self-Improvement Techniques */}
        <section>
          <h2 className="text-3xl font-semibold mb-6 text-foreground">Daily & Weekly Techniques</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techniques.map((technique, index) => (
              <Card key={index} className="hover-lift transition-smooth">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <technique.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{technique.title}</h3>
                      <p className="text-muted-foreground text-sm mb-2">{technique.description}</p>
                      <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {technique.frequency}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Resources;