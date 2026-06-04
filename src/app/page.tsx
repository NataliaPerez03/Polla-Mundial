import { Navbar } from '@/components/landing/Navbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { WhatIsSection } from '@/components/landing/WhatIsSection'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'
import { PointsSection } from '@/components/landing/PointsSection'
import { PreviewSection } from '@/components/landing/PreviewSection'
import { FAQSection } from '@/components/landing/FAQSection'
import { Footer } from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar />
      <HeroSection />
      <WhatIsSection />
      <HowItWorksSection />
      <PointsSection />
      <PreviewSection />
      <FAQSection />
      <Footer />
    </div>
  )
}
