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
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Comprehensive support and resources for your mental health journey
          </p>
          <div className="bg-card border rounded-lg p-6 max-w-4xl mx-auto text-left">
            <h3 className="font-semibold text-lg mb-3">Important Information</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Emergency:</strong> If you're having thoughts of self-harm or suicide, please call emergency services (199) or visit your nearest hospital immediately.
              </p>
              <p>
                <strong className="text-foreground">Confidentiality:</strong> All mental health services listed here maintain strict confidentiality. Your privacy and safety are paramount.
              </p>
              <p>
                <strong className="text-foreground">Free Services:</strong> Most NGOs and hotlines listed provide free counseling and support services. Don't let financial concerns prevent you from seeking help.
              </p>
              <p>
                <strong className="text-foreground">24/7 Support:</strong> Many of the hotlines operate round the clock. You're never alone, and help is always available.
              </p>
            </div>
          </div>
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

        {/* Professional Help Information */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-foreground">When to Seek Professional Help</h2>
          <Card className="hover-lift transition-smooth">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-primary mb-3">Warning Signs</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Persistent feelings of sadness or hopelessness</li>
                    <li>• Loss of interest in activities you once enjoyed</li>
                    <li>• Changes in sleep or appetite patterns</li>
                    <li>• Difficulty concentrating on studies</li>
                    <li>• Increased irritability or mood swings</li>
                    <li>• Social withdrawal from friends and family</li>
                    <li>• Thoughts of self-harm or suicide</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-3">What to Expect</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Initial assessment and goal setting</li>
                    <li>• Confidential one-on-one sessions</li>
                    <li>• Evidence-based therapeutic approaches</li>
                    <li>• Coping strategies and skill development</li>
                    <li>• Regular progress monitoring</li>
                    <li>• Referrals to specialists if needed</li>
                    <li>• Medication evaluation when appropriate</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Self-Improvement Techniques */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-foreground">Daily & Weekly Techniques</h2>
          <p className="text-muted-foreground mb-6 max-w-3xl">
            These evidence-based techniques can help improve your mental well-being when practiced consistently. Start small and gradually build these habits into your routine.
          </p>
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

        {/* Campus Mental Health Services */}
        <section>
          <h2 className="text-3xl font-semibold mb-6 text-foreground">FULafia Campus Support</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover-lift transition-smooth">
              <CardHeader>
                <CardTitle className="text-primary">Student Counseling Center</CardTitle>
                <CardDescription>On-campus mental health support</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    <strong>Location:</strong> Student Affairs Building, 2nd Floor
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Hours:</strong> Monday - Friday, 8:00 AM - 5:00 PM
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Services:</strong> Individual counseling, group therapy, crisis intervention, academic support
                  </p>
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift transition-smooth">
              <CardHeader>
                <CardTitle className="text-primary">Peer Support Network</CardTitle>
                <CardDescription>Student-led mental health initiatives</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    <strong>WhatsApp Group:</strong> Mental Wellness Community
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Weekly Meetings:</strong> Thursdays, 6:00 PM - 7:00 PM
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Activities:</strong> Support circles, mindfulness sessions, wellness workshops
                  </p>
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4 mr-2" />
                    Join Community
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Resources;