import SiteHeader from "@/components/site-header"
import Hero from "@/components/hero"
import Work from "@/components/work"
import Process from "@/components/process"
import About from "@/components/about"
import Stack from "@/components/stack"
import BlogSection from "@/components/blog-section"
import Contact from "@/components/contact"
import Chatbot from "@/components/chatbot"
import { getProjects } from "@/lib/projects"
import { getBlogs } from "@/lib/blogs"
import { getSettings } from "@/lib/settings"

export const revalidate = 60

export default async function Home() {
  const [projects, blogs, settings] = await Promise.all([getProjects(), getBlogs(3), getSettings()])
  return (
    <>
      <SiteHeader settings={settings} home />
      <main id="main">
        <Hero />
        <Work projects={projects} />
        <Process />
        <About />
        <Stack />
        <BlogSection blogs={blogs} />
        <Contact settings={settings} />
      </main>
      <Chatbot />
    </>
  )
}
