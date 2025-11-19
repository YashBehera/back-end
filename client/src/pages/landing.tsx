import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, Utensils, Sparkles, Zap, Target, TrendingUp } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10"></div>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"></div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-lg mb-8">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Fitness Assistant</span>
          </div>

          <h1 className="font-heading font-bold text-4xl md:text-6xl lg:text-7xl mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
            Your AI-Powered
            <br />
            Fitness Journey Starts Here
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            Get personalized workout routines and diet plans tailored to your goals, 
            fitness level, and preferences. Powered by advanced AI with photorealistic visualizations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/onboarding">
              <Button size="lg" className="text-base px-8 h-12" data-testid="button-get-started">
                Get Started Free
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span>Personalized Plans</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>Results-Driven</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-5xl mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Advanced AI technology meets fitness expertise to deliver personalized results
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover-elevate active-elevate-2">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Dumbbell className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-xl mb-3">
                  Custom Workout Plans
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  AI-generated workout routines tailored to your fitness level, goals, and available equipment. 
                  Each exercise comes with photorealistic demonstrations.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate active-elevate-2">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Utensils className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-xl mb-3">
                  Personalized Nutrition
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Delicious meal plans designed for your dietary preferences and fitness goals. 
                  Visualize every dish with stunning AI-generated food imagery.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate active-elevate-2">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-xl mb-3">
                  AI-Powered Insights
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Leverage cutting-edge AI to optimize your training and nutrition. 
                  Get smarter recommendations that adapt to your progress.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-2">
            <CardContent className="p-12 text-center">
              <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
                Ready to Transform Your Fitness?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of users achieving their goals with AI-powered personalized fitness plans
              </p>
              <Link href="/onboarding">
                <Button size="lg" className="text-base px-8 h-12" data-testid="button-start-journey">
                  Start Your Journey
                  <Zap className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
