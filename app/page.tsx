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
    <div className="page">
      <Header />

      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-title">
          Transform Your Body, <span className="highlight">Elevate Your Life</span>
        </h1>
        <p className="hero-text">
          Join RCG Fitness and experience world-class training facilities, expert guidance, and a
          community that pushes you to achieve your fitness goals.
        </p>

        {!user && (
          <div className="hero-actions">
            <Button asChild className="primary-button">
              <a href="/auth">Start Your Journey Today</a>
            </Button>

            <div className="hero-links">
              <a href="#facilities" className="link">Facilities</a>
              <a href="#membership" className="link">Membership</a>
            </div>
          </div>
        )}
      </section>

      {/* Facilities */}
      <section id="facilities" className="section facilities">
        <h2 className="section-title">
          Our <span className="highlight">Facilities</span>
        </h2>

        <div className="card-grid">
          <Card className="card">
            <CardContent className="card-content">
              <Dumbbell className="icon" />
              <h3 className="card-title">Strength Training</h3>
              <p className="card-text">State-of-the-art equipment</p>
            </CardContent>
          </Card>

          <Card className="card">
            <CardContent className="card-content">
              <Users className="icon" />
              <h3 className="card-title">Group Classes</h3>
              <p className="card-text">Dynamic group sessions</p>
            </CardContent>
          </Card>

          <Card className="card">
            <CardContent className="card-content">
              <Clock className="icon" />
              <h3 className="card-title">24/7 Access</h3>
              <p className="card-text">Train anytime</p>
            </CardContent>
          </Card>

          <Card className="card">
            <CardContent className="card-content">
              <Award className="icon" />
              <h3 className="card-title">Personal Training</h3>
              <p className="card-text">Tailored coaching</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Membership Plans */}
      <section id="membership" className="section membership">
        <h2 className="section-title">
          Membership <span className="highlight">Plans</span>
        </h2>

        <div className="card-grid">
          <Card className="card">
            <CardContent className="card-content">
              <Star className="icon" />
              <h3 className="card-title">Basic</h3>
              <p className="card-text">Perfect for beginners</p>
              <p className="price">₱499 / month</p>
              <ul className="list">
                <li>Unlimited Gym Access</li>
                <li>Basic Equipment</li>
                <li>Locker Room Access</li>
              </ul>
              <Button className="full-button" onClick={() => goToPayment("Basic", 499)}>
                Choose Plan
              </Button>
            </CardContent>
          </Card>

          <Card className="card">
            <CardContent className="card-content">
              <Award className="icon" />
              <h3 className="card-title">Standard</h3>
              <p className="card-text">Best for active members</p>
              <p className="price">₱999 / month</p>
              <ul className="list">
                <li>Unlimited Gym Access</li>
                <li>Group Classes</li>
                <li>Priority Locker</li>
                <li>Trainer Assistance</li>
              </ul>
              <Button className="full-button" onClick={() => goToPayment("Standard", 999)}>
                Choose Plan
              </Button>
            </CardContent>
          </Card>

          <Card className="card">
            <CardContent className="card-content">
              <Users className="icon" />
              <h3 className="card-title">Premium</h3>
              <p className="card-text">Full experience for serious lifters</p>
              <p className="price">₱1,499 / month</p>
              <ul className="list">
                <li>24/7 Gym Access</li>
                <li>All Group Classes</li>
                <li>Free Personal Training (2 sessions)</li>
                <li>Sauna & Premium Locker</li>
              </ul>
              <Button className="full-button" onClick={() => goToPayment("Premium", 1499)}>
                Choose Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 RCG Fitness. All rights reserved.</p>
      </footer>
    </div>
  );
}
