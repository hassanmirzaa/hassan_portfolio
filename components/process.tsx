"use client"

import { useEffect, useState } from "react"

export default function Process() {
  const [visibleSteps, setVisibleSteps] = useState<boolean[]>([])
  
  const steps = [
    {
      number: "01",
      icon: "✧",
      title: "Discovery Call",
      description: "We start with understanding your vision, requirements, and business goals. This initial consultation helps us map out the perfect strategy for your project.",
    },
    {
      number: "02",
      icon: "○",
      title: "Design",
      description: "Our UI/UX experts create intuitive wireframes and high-fidelity prototypes that capture your brand identity while ensuring exceptional user experience.",
    },
    {
      number: "03",
      icon: "◇",
      title: "Development",
      description: "Our skilled developers bring the designs to life using clean, scalable code. We follow industry best practices to ensure your application is robust and future-proof.",
    },
    {
      number: "04",
      icon: "□",
      title: "Testing",
      description: "Rigorous quality assurance across multiple devices and platforms ensures your application is bug-free, responsive, and delivers a seamless experience.",
    },
    {
      number: "05",
      icon: "△",
      title: "Deployment",
      description: "We handle the entire submission and release process to make your application available on app stores, followed by continuous support and maintenance.",
    },
  ]

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    
    steps.forEach((_, idx) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSteps((prev) => {
              const newState = [...prev]
              newState[idx] = true
              return newState
            })
          }
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -50px 0px",
        }
      )

      const element = document.getElementById(`process-step-${idx}`)
      if (element) {
        observer.observe(element)
        observers.push(observer)
      }
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [])

  return (
    <section id="process" className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-gradient-shift">
            How It Works
          </span>
        </h2>
        <p className="text-center text-foreground/60 mb-16 max-w-2xl mx-auto scroll-fade-in scroll-stagger-1">
          Our collaborative development process that turns your vision into reality.
        </p>

        <div className="relative max-w-5xl mx-auto">
          {/* Center Vertical Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-primary transform -translate-x-1/2 z-0"></div>

          {/* Steps Container */}
          <div className="space-y-16 md:space-y-24">
            {steps.map((step, idx) => {
              const isLeft = idx % 2 === 0
              
              return (
                <div
                  key={idx}
                  id={`process-step-${idx}`}
                  className="relative flex items-center min-h-[200px]"
                >
                  {/* Step Card - Left Side */}
                  {isLeft && (
                    <div className={`glass-effect card-hover p-5 rounded-lg border border-primary/30 w-full md:w-[calc(50%-60px)] md:mr-auto transition-all duration-1000 ease-out ${
                      visibleSteps[idx] 
                        ? "opacity-100 translate-x-0" 
                        : "opacity-0 -translate-x-20"
                    }`}>
                      <div className="flex items-start gap-4">
                        {/* Number Circle */}
                        <div className="relative flex-shrink-0">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/50 flex items-center justify-center text-lg font-bold text-primary">
                            {step.number}
                          </div>
                        </div>
                        {/* Content */}
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold mb-1 text-primary/80 uppercase tracking-wider">
                            Step {step.number}
                          </h3>
                          <h4 className="text-xl font-bold mb-2 text-foreground">
                            {step.title}
                          </h4>
                          <p className="text-sm text-foreground/70 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Center Node on Timeline */}
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 z-10 flex-shrink-0">
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-br from-primary to-secondary border-4 border-background shadow-lg shadow-primary/50 transition-all duration-700 ${
                      visibleSteps[idx] ? "scale-100 opacity-100" : "scale-0 opacity-0"
                    }`}></div>
                  </div>

                  {/* Connecting Horizontal Line - Left */}
                  {isLeft && (
                    <div className={`hidden md:block absolute left-1/2 top-1/2 transform -translate-y-1/2 h-0.5 bg-gradient-to-l from-primary/60 to-transparent transition-all duration-1000 ${
                      visibleSteps[idx] ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                    }`}
                    style={{ width: "calc(50% - 60px)", transform: "translate(-100%, -50%)" }}
                    ></div>
                  )}

                  {/* Connecting Horizontal Line - Right */}
                  {!isLeft && (
                    <div className={`hidden md:block absolute right-1/2 top-1/2 transform -translate-y-1/2 h-0.5 bg-gradient-to-r from-primary/60 to-transparent transition-all duration-1000 ${
                      visibleSteps[idx] ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                    }`}
                    style={{ width: "calc(50% - 60px)", transform: "translate(100%, -50%)" }}
                    ></div>
                  )}

                  {/* Step Card - Right Side */}
                  {!isLeft && (
                    <div className={`glass-effect card-hover p-5 rounded-lg border border-primary/30 w-full md:w-[calc(50%-60px)] md:ml-auto transition-all duration-1000 ease-out ${
                      visibleSteps[idx] 
                        ? "opacity-100 translate-x-0" 
                        : "opacity-0 translate-x-20"
                    }`}>
                      <div className="flex items-start gap-4">
                        {/* Number Circle */}
                        <div className="relative flex-shrink-0">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/50 flex items-center justify-center text-lg font-bold text-primary">
                            {step.number}
                          </div>
                        </div>
                        {/* Content */}
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold mb-1 text-primary/80 uppercase tracking-wider">
                            Step {step.number}
                          </h3>
                          <h4 className="text-xl font-bold mb-2 text-foreground">
                            {step.title}
                          </h4>
                          <p className="text-sm text-foreground/70 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <a
            href="#contact"
            className="btn-interactive inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg font-semibold"
          >
            Start your project
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  )
}

