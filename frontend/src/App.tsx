import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CourseSalesVideo } from './components/CourseSalesVideo';
import { VideoPlayer } from './components/VideoPlayer';
import { Curriculum } from './components/Curriculum';
import { CareerMonetization } from './components/CareerMonetization';
import { Mentor } from './components/Mentor';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { PaymentModal } from './components/PaymentModal';
import { fetchCohortStats, CohortStats } from './api';

export default function App() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [stats, setStats] = useState<CohortStats>({
    registeredCount: 0,
    seatsRemaining: 35,
    database: 'MongoDB Atlas',
    totalRevenueInr: 0,
  });

  useEffect(() => {
    fetchCohortStats().then(setStats).catch(() => {});
  }, [isPaymentModalOpen]);

  const handleScrollToVideo = () => {
    const el = document.getElementById('video-overview');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 selection:bg-teal-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenPayment={() => setIsPaymentModalOpen(true)}
        seatsRemaining={stats.seatsRemaining}
      />

      {/* Main Content Sections */}
      <main>
        {/* Hero Section */}
        <Hero
          onOpenPayment={() => setIsPaymentModalOpen(true)}
          onScrollToVideo={handleScrollToVideo}
        />

        {/* Official Course Sales & Overview Video */}
        <CourseSalesVideo
          onOpenPayment={() => setIsPaymentModalOpen(true)}
        />

        {/* System Architecture Video Walkthrough */}
        <VideoPlayer />

        {/* Comprehensive 4-Week Live Curriculum */}
        <Curriculum />

        {/* The Career & Monetization Playbook */}
        <CareerMonetization />

        {/* Meet Your Mentor: Sachin Mishra */}
        <Mentor />

        {/* Transparent Pricing & Guarantees */}
        <Pricing
          onOpenPayment={() => setIsPaymentModalOpen(true)}
          seatsRemaining={stats.seatsRemaining}
        />

        {/* Frequently Asked Questions */}
        <FAQ />
      </main>

      {/* Footer */}
      <Footer
        onOpenPayment={() => setIsPaymentModalOpen(true)}
      />

      {/* Checkout & Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />
    </div>
  );
}
