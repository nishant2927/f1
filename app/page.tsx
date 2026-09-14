import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CarVisualizer from "@/components/CarVisualizer";
import StatsSection from "@/components/StatsSection";
import Standings from "@/components/Standings";
import ConstructorsShowcase from "@/components/ConstructorsShowcase";
import DriversVault from "@/components/DriversVault";
import RaceCalendar from "@/components/RaceCalendar";
import EraTimeline from "@/components/EraTimeline";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/SectionDivider";
import CustomCursor from "@/components/CustomCursor";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#080a0f] grid-bg racing-stripe">
      <CustomCursor />
      <Navbar />
      <Hero />
      <SectionDivider />
      <StatsSection />
      <SectionDivider />
      <CarVisualizer />
      <SectionDivider />
      <Standings />
      <SectionDivider />
      <ConstructorsShowcase />
      <SectionDivider />
      <DriversVault />
      <SectionDivider />
      <RaceCalendar />
      <SectionDivider />
      <EraTimeline />
      <SectionDivider />
      <Footer />
    </main>
  );
}
