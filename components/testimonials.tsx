"use client"

import { useEffect, useState } from "react"

export default function Testimonials() {
  const [visibleTestimonials, setVisibleTestimonials] = useState<boolean[]>([])
  const testimonials = [
    {
      quote: "Hassan was very knowledgeable and resourceful about app development. He created the app for me based on my design, and he recommended adding features that augmented its functionality. Hassan also created a splash screen that fit perfectly with the app's theme. I will definitely work with Hassan again in the near future.",
      author: "Suzan",
      role: "CEO, Muzun Apps",
    },
    {
      quote: "I worked with him on multiple projects, including an AI Pizza Recipe Generator and a Music App MVP, and he delivered exceptional results — I rated him 10/10 in work quality, communication, cooperation, professionalism, and overall satisfaction",
      author: "Shahzaib",
      role: "Project Manager",
    },
  ]

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    
    testimonials.forEach((_, idx) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleTestimonials((prev) => {
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

      const element = document.getElementById(`testimonial-${idx}`)
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
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-gradient-shift">Testimonials</span>
        </h2>
        <p className="text-center text-foreground/60 mb-16 scroll-fade-in scroll-stagger-1">What clients and colleagues have to say.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              id={`testimonial-${idx}`}
              className={`glass-effect card-hover p-8 rounded-lg border border-primary/30 scroll-fade-in ${
                visibleTestimonials[idx] ? "visible" : ""
              } ${idx === 0 ? "scroll-stagger-1" : idx === 1 ? "scroll-stagger-2" : "scroll-stagger-3"}`}
            >
              <p className="text-lg text-foreground/80 mb-6 italic">"{testimonial.quote}"</p>
              <div className="border-t border-primary/20 pt-4">
                <p className="font-bold text-primary">{testimonial.author}</p>
                <p className="text-sm text-foreground/60">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
