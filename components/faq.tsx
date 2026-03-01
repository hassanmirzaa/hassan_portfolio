"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    q: "How long does it take to build a mobile app?",
    a: "It depends on complexity. A simple MVP can be ready in 2–4 weeks, while a full-featured production app typically takes 6–12 weeks. I focus on rapid delivery without cutting corners — pixel-perfect UI, clean architecture, and thorough testing.",
  },
  {
    q: "Do you build apps for both iOS and Android?",
    a: "Yes! I use Flutter, which compiles to native code for both platforms from a single codebase. You get native performance on iOS and Android without paying for two separate development teams.",
  },
  {
    q: "Can you integrate AI features into my app?",
    a: "Absolutely. I've built multiple AI-powered apps using OpenAI, Gemini, and custom ML models — from recipe generators to workout planners. Whether it's chatbots, image recognition, or smart recommendations, I can plug AI into your app seamlessly.",
  },
  {
    q: "What's the difference between a mobile app and a SaaS product?",
    a: "A mobile app runs on phones (iOS/Android), while a SaaS product is a cloud-based software accessed via web or app on a subscription model. Many businesses benefit from both — a web dashboard for admins and a mobile app for end users. I can help plan the right approach.",
  },
  {
    q: "How much does it cost to build an app?",
    a: "Every project is different. A basic MVP might start from a few thousand dollars, while enterprise-grade apps with real-time features, payment systems, and AI can cost more. I'd rather hop on a quick call to understand your scope and give you a real number instead of a generic range.",
  },
  {
    q: "Do you offer post-launch support and maintenance?",
    a: "Yes. After launch I offer ongoing support packages covering bug fixes, OS updates, feature additions, and performance monitoring. Your app doesn't stop at deployment — it evolves with your business.",
  },
  {
    q: "What backend technologies do you work with?",
    a: "I primarily work with Firebase and Supabase for backend services — authentication, real-time databases, cloud storage, and serverless functions. For more complex needs, I also integrate with Laravel, Node.js, and custom REST APIs.",
  },
  {
    q: "Can you help turn my idea into a product roadmap?",
    a: "Definitely. I start every project with a discovery call to understand your vision, target audience, and business goals. From there I help define the MVP scope, feature priority, and technical architecture so you ship the right thing first.",
  },
  {
    q: "What is Flutter and why do you use it?",
    a: "Flutter is Google's UI toolkit for building natively compiled apps for mobile, web, and desktop from one codebase. I use it because it delivers near-native performance, beautiful UIs, and cuts development time almost in half compared to building separate iOS and Android apps.",
  },
  {
    q: "Can you build a SaaS product or web application too?",
    a: "My core expertise is mobile, but I can build companion web dashboards and admin panels using Next.js and React. For full SaaS products, I focus on the mobile side and can collaborate with web specialists if needed — or handle it end-to-end for smaller scopes.",
  },
  {
    q: "How do you handle app store submission?",
    a: "I handle the entire process — from preparing screenshots and metadata to configuring signing certificates and submitting to both Google Play Store and Apple App Store. I also optimize your listing for better discoverability.",
  },
  {
    q: "What if I already have a design — can you just develop it?",
    a: "Absolutely. Send me your Figma, Adobe XD, or any design files and I'll convert them into a pixel-perfect, fully functional app. I pay close attention to spacing, animations, and micro-interactions to match your vision exactly.",
  },
]

export default function FAQ() {
  return (
    <section id="faq" className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-gradient-shift">
            Frequently Asked Questions
          </span>
        </h2>
        <p className="text-center text-foreground/60 mb-12 max-w-2xl mx-auto">
          Quick answers to common questions about app development, AI integration, and working together.
        </p>

        <div className="glass-effect rounded-lg border border-primary/30 px-6 md:px-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`faq-${idx}`}
                className="border-primary/20"
              >
                <AccordionTrigger className="text-base text-foreground hover:text-primary hover:no-underline transition-colors">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
