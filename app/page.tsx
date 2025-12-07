"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, Users, Clock, Award, Star } from "lucide-react";

interface User {
  id: number;
  email: string;
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = await res.json();
        if (data.loggedIn) setUser(data.user);
      } catch {
        setUser(null);
      }
    };
    checkSession();
  }, []);

  const goToPayment = (plan: string, price: number) => {
    router.push(`/payment?plan=${plan}&price=${price}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
          Transform Your Body, <span className="text-primary">Elevate Your Life</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
          Join RCG Fitness and experience world-class training facilities, expert guidance, and a community
          that pushes you to achieve your fitness goals.
        </p>
        {!user && (
          <Button
            asChild
            className="px-8 py-6 text-lg font-semibold bg-primary text-white hover:bg-primary/90"
          >
            <a href="/auth">Start Your Journey Today</a>
          </Button>
        )}
      </section>

      {/* Facilities */}
      <section id="facilities" className="py-20 px-4 bg-card text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-12">
          Our <span className="text-primary">Facilities</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="bg-secondary border-border hover:border-primary transition-colors">
            <CardContent className="p-6 text-center">
              <Dumbbell className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Strength Training</h3>
              <p className="text-muted-foreground">State-of-the-art equipment</p>
            </CardContent>
          </Card>
          <Card className="bg-secondary border-border hover:border-primary transition-colors">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Group Classes</h3>
              <p className="text-muted-foreground">Dynamic group sessions</p>
            </CardContent>
          </Card>
          <Card className="bg-secondary border-border hover:border-primary transition-colors">
            <CardContent className="p-6 text-center">
              <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">24/7 Access</h3>
              <p className="text-muted-foreground">Train anytime</p>
            </CardContent>
          </Card>
          <Card className="bg-secondary border-border hover:border-primary transition-colors">
            <CardContent className="p-6 text-center">
              <Award className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Personal Training</h3>
              <p className="text-muted-foreground">Tailored coaching</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Membership Plans */}
      <section id="membership" className="py-20 px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-12">
          Membership <span className="text-primary">Plans</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {/* Basic */}
          <Card className="border-border bg-secondary hover:border-primary transition-colors">
            <CardContent className="p-8 text-center">
              <Star className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Basic</h3>
              <p className="text-muted-foreground mb-4">Perfect for beginners</p>
              <p className="text-4xl font-bold mb-6">₱499<span className="text-lg font-normal">/month</span></p>
              <ul className="space-y-2 text-muted-foreground mb-6">
                <li>✔ Unlimited Gym Access</li>
                <li>✔ Basic Equipment</li>
                <li>✔ Locker Room Access</li>
              </ul>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white" onClick={() => goToPayment("Basic", 499)}>
                Choose Plan
              </Button>
            </CardContent>
          </Card>

          {/* Standard */}
          <Card className="border-border bg-secondary hover:border-primary transition-colors">
            <CardContent className="p-8 text-center">
              <Award className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Standard</h3>
              <p className="text-muted-foreground mb-4">Best for active members</p>
              <p className="text-4xl font-bold mb-6">₱999<span className="text-lg font-normal">/month</span></p>
              <ul className="space-y-2 text-muted-foreground mb-6">
                <li>✔ Unlimited Gym Access</li>
                <li>✔ Group Classes</li>
                <li>✔ Priority Locker</li>
                <li>✔ Trainer Assistance</li>
              </ul>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white" onClick={() => goToPayment("Standard", 999)}>
                Choose Plan
              </Button>
            </CardContent>
          </Card>

          {/* Premium */}
          <Card className="border-border bg-secondary hover:border-primary transition-colors">
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <p className="text-muted-foreground mb-4">Full experience for serious lifters</p>
              <p className="text-4xl font-bold mb-6">₱1,499<span className="text-lg font-normal">/month</span></p>
              <ul className="space-y-2 text-muted-foreground mb-6">
                <li>✔ 24/7 Gym Access</li>
                <li>✔ All Group Classes</li>
                <li>✔ Free Personal Training (2 sessions)</li>
                <li>✔ Sauna & Premium Locker</li>
              </ul>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white" onClick={() => goToPayment("Premium", 1499)}>
                Choose Plan
              </Button>
            </CardContent>
          </Card>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border text-center">
        <p className="text-muted-foreground">© 2025 RCG Fitness. All rights reserved.</p>
      </footer>
    </div>
  );
}
