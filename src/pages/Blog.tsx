import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Heart, MessageSquare, Plus, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  timestamp: string;
  excerpt: string;
}

const Blog = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: ''
  });

  useEffect(() => {
    // Load blog posts from localStorage or create mock data
    const savedPosts = localStorage.getItem('fulafia_blog_posts');
    if (savedPosts) {
      setBlogPosts(JSON.parse(savedPosts));
    } else {
      // Create mock blog posts
      const mockPosts: BlogPost[] = [
        {
          id: '1',
          title: 'Dealing with Academic Burnout: My Journey to Recovery',
          content: `Academic burnout hit me during my third year at university. I found myself constantly exhausted, unable to concentrate, and feeling overwhelmed by even simple tasks. What started as typical student stress evolved into something much more serious.

The turning point came when I missed three consecutive exams because I couldn't get out of bed. I realized I needed help. Here's what worked for me:

**1. Acknowledging the Problem**
The first step was admitting that what I was experiencing wasn't just "normal" student stress. Burnout is real, and it affects both your mental and physical health.

**2. Seeking Professional Help**
I reached out to our campus counseling center. Speaking with a counselor helped me understand that burnout often stems from perfectionism and unrealistic expectations we place on ourselves.

**3. Creating Boundaries**
I learned to say no to additional commitments and started setting realistic study goals. Instead of studying for 12 hours straight, I broke my work into manageable chunks with regular breaks.

**4. Self-Care Routine**
I established a daily routine that included:
- 30 minutes of physical activity
- 7-8 hours of sleep
- Healthy meals at regular times
- 15 minutes of meditation or deep breathing

**5. Building a Support Network**
Connecting with classmates who understood my struggles made a huge difference. We formed a study group that focused on mutual support rather than competition.

Recovery wasn't linear. There were setbacks, but each small step forward built momentum. Today, I'm in my final year, managing my workload effectively, and actually enjoying my studies again.

Remember: seeking help isn't a sign of weakness—it's a sign of strength and self-awareness. Your mental health is just as important as your academic success.`,
          author: 'Anonymous Student',
          authorId: 'student1',
          timestamp: '2024-01-15T10:30:00Z',
          excerpt: 'My personal journey through academic burnout and the strategies that helped me recover and thrive again in my studies.'
        },
        {
          id: '2',
          title: 'Breaking the Stigma: Why I Started Talking About My Anxiety',
          content: `For years, I suffered in silence. Anxiety was my constant companion—the racing heart before presentations, the sleepless nights before exams, the overwhelming fear that everyone could see how "broken" I was.

Growing up in a culture where mental health issues are often dismissed as "weakness" or "attention-seeking," I learned to hide my struggles. I became an expert at wearing a mask, smiling through panic attacks, and making excuses for my limitations.

**The Breaking Point**
Everything changed during a group presentation in my sophomore year. As I stood in front of the class, my vision blurred, my hands shook uncontrollably, and I couldn't speak. I ran out of the classroom, embarrassed and ashamed.

That night, I called my mother. For the first time, I told her about my anxiety, my panic attacks, and how I'd been struggling. To my surprise, she didn't dismiss me. Instead, she shared her own struggles with anxiety and how she'd learned to manage it.

**Starting the Conversation**
I began opening up to close friends about my experiences. I discovered that many of them had similar struggles but were also suffering in silence. We started having regular check-ins, sharing coping strategies, and supporting each other through difficult times.

**What I've Learned**
1. **Anxiety is not a character flaw**—it's a medical condition that affects millions of people
2. **Talking about it reduces its power**—shame thrives in secrecy
3. **You're not alone**—more people understand than you think
4. **Professional help is invaluable**—therapy gave me tools I never knew existed
5. **Progress isn't linear**—bad days don't erase the progress you've made

**My Message to You**
If you're reading this and struggling with anxiety, depression, or any mental health challenge, please know:
- Your feelings are valid
- You deserve support and understanding
- Seeking help is brave, not weak
- There is hope, and things can get better

I'm sharing my story because I wish someone had shared theirs with me when I was at my lowest. Mental health affects all of us, and it's time we start treating it with the same importance as physical health.

Let's keep the conversation going. Let's break the stigma together.`,
          author: 'Sarah M.',
          authorId: 'student2',
          timestamp: '2024-01-10T14:20:00Z',
          excerpt: 'How opening up about my anxiety helped me heal and why sharing our mental health stories is crucial for breaking stigma.'
        }
      ];
      
      localStorage.setItem('fulafia_blog_posts', JSON.stringify(mockPosts));
      setBlogPosts(mockPosts);
    }
  }, []);

  const handleCreatePost = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.userType !== 'student') {
      toast({
        title: "Access Restricted",
        description: "Only students can create blog posts.",
        variant: "destructive"
      });
      return;
    }

    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both a title and content for your post.",
        variant: "destructive"
      });
      return;
    }

    const post: BlogPost = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      author: user.name,
      authorId: user.id,
      timestamp: new Date().toISOString(),
      excerpt: newPost.content.substring(0, 150) + '...'
    };

    const updatedPosts = [post, ...blogPosts];
    setBlogPosts(updatedPosts);
    localStorage.setItem('fulafia_blog_posts', JSON.stringify(updatedPosts));

    setNewPost({ title: '', content: '' });
    setShowCreateForm(false);

    toast({
      title: "Post Published",
      description: "Your story has been shared successfully.",
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => {
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        return (
          <h3 key={index} className="font-semibold text-foreground mt-6 mb-3">
            {paragraph.slice(2, -2)}
          </h3>
        );
      }
      return (
        <p key={index} className="text-muted-foreground leading-relaxed mb-4">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary-accent bg-clip-text text-transparent mb-4">
            Mental Health Stories
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Share your journey, inspire others, and build a supportive community
          </p>

          {user?.userType === 'student' && (
            <Button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="warm-gradient hover:shadow-accent transition-smooth"
            >
              <Plus className="h-4 w-4 mr-2" />
              Share Your Story
            </Button>
          )}
        </div>

        {/* Create Post Form */}
        {showCreateForm && user?.userType === 'student' && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Share Your Mental Health Story
              </CardTitle>
              <CardDescription>
                Your story could help someone else feel less alone
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="Give your story a meaningful title..."
                />
              </div>
              <div>
                <Label htmlFor="content">Your Story</Label>
                <Textarea
                  id="content"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="Share your experience, challenges, victories, and advice..."
                  className="min-h-[200px]"
                />
              </div>
              <div className="flex space-x-4">
                <Button onClick={handleCreatePost}>
                  Publish Story
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Blog Posts */}
        <div className="space-y-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="hover-lift transition-smooth">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{post.title}</CardTitle>
                    <CardDescription className="text-base mb-4">
                      {post.excerpt}
                    </CardDescription>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(post.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    Story
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {formatContent(post.content)}
                </div>
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm">
                      <Heart className="h-4 w-4 mr-1" />
                      Support
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Comment
                    </Button>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Thank you for sharing your story
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {blogPosts.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Stories Yet</h3>
            <p className="text-muted-foreground">
              Be the first to share your mental health journey
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;