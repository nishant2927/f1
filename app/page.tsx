import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CarVisualizer from "@/components/CarVisualizer";
import ConstructorsShowcase from "@/components/ConstructorsShowcase";
import DriversVault from "@/components/DriversVault";
import EraTimeline from "@/components/EraTimeline";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/SectionDivider";

export default function Home() {
  return (
    <main className="min-h-screen bg-obsidian">
      <Navbar />
      <Hero />
      <SectionDivider />
      <CarVisualizer />
      <SectionDivider />
      <ConstructorsShowcase />
      <SectionDivider />
      <DriversVault />
      <SectionDivider />
      <EraTimeline />
      <SectionDivider />
      <Footer />
    </main>
  );
}
