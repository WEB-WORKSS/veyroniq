import { Hero } from "../components/sections/Hero.jsx";
import { Highlights, Problem, Features, HowItWorks } from "../components/sections/Story.jsx";
import { Showcase } from "../components/sections/Showcase.jsx";
import { Solutions, Pricing, AwsSection } from "../components/sections/Commercial.jsx";
import { Progress, Team, Faq, Contact } from "../components/sections/Company.jsx";

export default function Home() {
  return (
    <>
      <Hero />
      <Highlights />
      <Problem />
      <Features />
      <HowItWorks />
      <Showcase />
      <Solutions />
      <Pricing />
      <AwsSection />
      <Progress />
      <Team />
      <Faq />
      <Contact />
    </>
  );
}
