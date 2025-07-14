import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Brain, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const Quiz = () => {
  const { user, profile, updateQuizResult } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{ score: number; result: string; description: string } | null>(null);

  const questions = [
    {
      id: 1,
      question: "How often have you been feeling down, depressed, or hopeless in the past two weeks?",
      options: [
        { text: "Not at all", value: 0 },
        { text: "Several days", value: 1 },
        { text: "More than half the days", value: 2 },
        { text: "Nearly every day", value: 3 }
      ]
    },
    {
      id: 2,
      question: "How often have you had little interest or pleasure in doing things?",
      options: [
        { text: "Not at all", value: 0 },
        { text: "Several days", value: 1 },
        { text: "More than half the days", value: 2 },
        { text: "Nearly every day", value: 3 }
      ]
    },
    {
      id: 3,
      question: "How often have you been feeling nervous, anxious, or on edge?",
      options: [
        { text: "Not at all", value: 0 },
        { text: "Several days", value: 1 },
        { text: "More than half the days", value: 2 },
        { text: "Nearly every day", value: 3 }
      ]
    },
    {
      id: 4,
      question: "How often have you had trouble falling or staying asleep, or sleeping too much?",
      options: [
        { text: "Not at all", value: 0 },
        { text: "Several days", value: 1 },
        { text: "More than half the days", value: 2 },
        { text: "Nearly every day", value: 3 }
      ]
    },
    {
      id: 5,
      question: "How often have you been feeling tired or having little energy?",
      options: [
        { text: "Not at all", value: 0 },
        { text: "Several days", value: 1 },
        { text: "More than half the days", value: 2 },
        { text: "Nearly every day", value: 3 }
      ]
    },
    {
      id: 6,
      question: "How often have you had poor appetite or been overeating?",
      options: [
        { text: "Not at all", value: 0 },
        { text: "Several days", value: 1 },
        { text: "More than half the days", value: 2 },
        { text: "Nearly every day", value: 3 }
      ]
    },
    {
      id: 7,
      question: "How often have you been feeling bad about yourself or that you are a failure?",
      options: [
        { text: "Not at all", value: 0 },
        { text: "Several days", value: 1 },
        { text: "More than half the days", value: 2 },
        { text: "Nearly every day", value: 3 }
      ]
    },
    {
      id: 8,
      question: "How often have you had trouble concentrating on things, such as reading or watching TV?",
      options: [
        { text: "Not at all", value: 0 },
        { text: "Several days", value: 1 },
        { text: "More than half the days", value: 2 },
        { text: "Nearly every day", value: 3 }
      ]
    }
  ];

  const calculateResult = (totalScore: number) => {
    if (totalScore <= 7) {
      return {
        result: 'Mild',
        description: 'Your responses suggest mild stress levels. This is normal and manageable with self-care practices.',
        color: 'text-secondary-accent',
        bgColor: 'bg-secondary-accent/10',
        recommendations: [
          'Practice regular exercise and maintain a healthy routine',
          'Try mindfulness or meditation techniques',
          'Ensure adequate sleep (7-9 hours per night)',
          'Connect with friends and family regularly'
        ]
      };
    } else if (totalScore <= 15) {
      return {
        result: 'Moderate',
        description: 'Your responses indicate moderate stress or emotional concerns that may benefit from additional support.',
        color: 'text-accent',
        bgColor: 'bg-accent/10',
        recommendations: [
          'Consider speaking with a counselor or therapist',
          'Implement stress management techniques',
          'Maintain social connections and seek support',
          'Consider joining support groups or wellness programs'
        ]
      };
    } else {
      return {
        result: 'Critical',
        description: 'Your responses suggest significant emotional distress. It\'s important to seek professional help.',
        color: 'text-destructive',
        bgColor: 'bg-destructive/10',
        recommendations: [
          'Seek immediate professional counseling support',
          'Contact your healthcare provider or counseling center',
          'Consider reaching out to mental health crisis lines if needed',
          'Inform trusted friends or family about how you\'re feeling'
        ]
      };
    }
  };

  const handleAnswerSelect = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitQuiz = () => {
    const totalScore = answers.reduce((sum, answer) => sum + answer, 0);
    const resultData = calculateResult(totalScore);
    
    const finalResult = {
      score: totalScore,
      result: resultData.result as 'Mild' | 'Moderate' | 'Critical',
      timestamp: new Date().toISOString()
    };

    setResult({
      score: totalScore,
      result: resultData.result,
      description: resultData.description
    });

    // Save result to user profile
    if (user) {
      updateQuizResult(finalResult);
    }

    setShowResult(true);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentAnswer = answers[currentQuestion];

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto card-soft">
          <CardHeader className="text-center">
            <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to take the mental health assessment.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="hero-gradient">
              <a href="/login">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (profile?.user_type !== 'student') {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto card-soft">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-accent mx-auto mb-4" />
            <CardTitle>Student Access Only</CardTitle>
            <CardDescription>
              Mental health assessments are available for students only.
            </CardDescription>
          </CardHeader>
          <CardContent>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResult && result) {
    const resultData = calculateResult(result.score);
    
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto animate-fade-in">
          <Card className="card-soft">
            <CardHeader className="text-center">
              <div className={`w-20 h-20 rounded-full ${resultData.bgColor} flex items-center justify-center mx-auto mb-4`}>
                <CheckCircle className={`h-10 w-10 ${resultData.color}`} />
              </div>
              <CardTitle className="text-3xl">Assessment Complete</CardTitle>
              <CardDescription>Your mental health assessment results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className={`inline-block px-6 py-3 rounded-full ${resultData.bgColor}`}>
                  <span className={`text-2xl font-bold ${resultData.color}`}>
                    {result.result}
                  </span>
                </div>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {result.description}
                </p>
                <div className="text-sm text-muted-foreground">
                  Score: {result.score}/24 | Completed on {new Date().toLocaleDateString()}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Recommended Next Steps:</h3>
                <ul className="space-y-2">
                  {resultData.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-secondary-accent mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {result.result !== 'Mild' && (
                <Alert className="border-primary bg-primary/5">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Remember:</strong> This assessment is not a diagnosis. If you're experiencing persistent emotional distress, please consider reaching out to a mental health professional.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => window.location.reload()} variant="outline">
                  Retake Assessment
                </Button>
                <Button asChild className="hero-gradient">
                  <a href="/contact">Find a Counselor</a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/resources">View Resources</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Mental Health Assessment</h1>
          <p className="text-muted-foreground">
            This brief assessment will help evaluate your current mental well-being
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="text-xl leading-relaxed">
              {questions[currentQuestion].question}
            </CardTitle>
            <CardDescription>
              Select the option that best describes your experience in the past two weeks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={currentAnswer?.toString()} 
              onValueChange={(value) => handleAnswerSelect(parseInt(value))}
              className="space-y-4"
            >
              {questions[currentQuestion].options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-smooth">
                  <RadioGroupItem value={option.value.toString()} id={`option-${index}`} />
                  <Label 
                    htmlFor={`option-${index}`} 
                    className="flex-1 cursor-pointer text-base leading-relaxed"
                  >
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between mt-8">
              <Button
                onClick={previousQuestion}
                disabled={currentQuestion === 0}
                variant="outline"
                className="hover-lift"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              {currentQuestion === questions.length - 1 ? (
                <Button
                  onClick={submitQuiz}
                  disabled={currentAnswer === undefined}
                  className="hero-gradient hover:shadow-soft transition-smooth"
                >
                  Submit Assessment
                  <CheckCircle className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={nextQuestion}
                  disabled={currentAnswer === undefined}
                  className="hero-gradient hover:shadow-soft transition-smooth"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Alert className="mt-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Disclaimer:</strong> This assessment is for educational purposes only and does not replace professional medical advice, diagnosis, or treatment. If you're experiencing a mental health crisis, please contact emergency services or a mental health professional immediately.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default Quiz;