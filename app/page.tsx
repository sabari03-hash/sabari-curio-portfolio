import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import Skills from "@/components/Skills";
import { InstagramShowcase, YouTubeShowcase } from "@/components/Socials";
import Testimonials from "@/components/Testimonials";
import Work from "@/components/Work";

export default function Home() {
  return (
    <>
      <div className="ambient" aria-hidden>
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="grain" />
        <div className="vignette" />
      </div>
      <Nav />
      <main>
        <Hero />
        <Work />
        <InstagramShowcase />
        <YouTubeShowcase />
        <Skills />
        <Contact />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
