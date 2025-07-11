import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Assessment', href: '/quiz', icon: '📝' },
    { name: 'Resources', href: '/resources', icon: '📚' },
    { name: 'Contact', href: '/contact', icon: '👥' },
    { name: 'Blog', href: '/blog', icon: '✍️' },
    { name: 'About', href: '/about', icon: 'ℹ️' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const NavigationItems = () => (
    <>
      {navigation
        .filter(item => {
          // Hide assessment page for counselors
          if (user?.userType === 'counselor' && item.href === '/quiz') {
            return false;
          }
          return true;
        })
        .map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-smooth hover-lift ${
            isActive(item.href)
              ? 'bg-primary text-primary-foreground shadow-soft'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <span className="text-lg">{item.icon}</span>
          <span className="font-medium">{item.name}</span>
        </Link>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg group-hover:shadow-accent transition-smooth overflow-hidden">
                <img 
                  src="/lovable-uploads/9d747166-554d-4138-a753-d06cba952ebe.png" 
                  alt="FULafia Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary-accent bg-clip-text text-transparent">
                FULafia
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              <NavigationItems />
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-2">
              {user ? (
                <div className="flex items-center space-x-2">
                  <Link to="/profile">
                    <Button variant="ghost" size="sm" className="hover-lift">
                      <User className="h-4 w-4 mr-2" />
                      {user.name}
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={logout} className="hover-lift">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="hover-lift">Login</Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm" className="warm-gradient hover:shadow-accent transition-smooth">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col space-y-4 mt-8">
                    <NavigationItems />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/9d747166-554d-4138-a753-d06cba952ebe.png" 
                alt="FULafia Logo" 
                className="h-5 w-5 object-contain"
              />
              <span className="text-sm text-muted-foreground">
                © 2025 FULafia. Supporting mental health awareness.
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Confidential • Safe • Supportive
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;