import { Era } from "@/types";

export const eras: Era[] = [
  {
    id: "golden-era",
    name: "The Golden Era",
    years: "1950 – 1966",
    description:
      "The birth of Formula 1. Front-engine monsters raced on public roads and purpose-built circuits. Juan Manuel Fangio dominated with five world titles across four different teams.",
    keyInnovations: [
      "Front-engine layout",
      "Manual gearboxes",
      "Tubular frame chassis",
      "Disc brakes",
    ],
    dominantTeam: "Ferrari / Maserati",
    color: "#C9A94E",
    icon: "trophy",
  },
  {
    id: "ground-effect",
    name: "Ground Effect Era",
    years: "1967 – 1982",
    description:
      "Rear engines became the norm. Colin Chapman's Lotus pioneered aerodynamic ground effects, using shaped underbodies to generate enormous downforce. Safety standards were minimal — brave drivers like Gilles Villeneuve pushed the limits.",
    keyInnovations: [
      "Rear-engine revolution",
      "Ground effect aerodynamics",
      "Monocoque chassis",
      "Carbon-fibre composites",
    ],
    dominantTeam: "Lotus / Ferrari",
    color: "#FF5733",
    icon: "wrench",
  },
  {
    id: "turbo-era",
    name: "Turbo Era",
    years: "1983 – 1988",
    description:
      "1,000+ horsepower turbocharged engines turned F1 into a war of boost pressure and reliability. Prost vs Senna ignited a legendary rivalry. Manufacturer involvement transformed the sport into big business.",
    keyInnovations: [
      "Turbocharged engines",
      "Electronic fuel injection",
      "Active aerodynamics",
      "Data telemetry systems",
    ],
    dominantTeam: "McLaren / Williams",
    color: "#00F5D4",
    icon: "gauge",
  },
  {
    id: "v10-era",
    name: "The V10 Symphony",
    years: "1989 – 2005",
    description:
      "The screaming V10 engines became the soundtrack of F1. Schumacher's Ferrari dominance, dramatic title fights, and the rise of television broadcasting made this the most beloved era among fans.",
    keyInnovations: [
      "V10 naturally-aspirated engines",
      "Traction control",
      "Step-nose chassis design",
      "Carbon brake development",
    ],
    dominantTeam: "Ferrari / Williams",
    color: "#E5053A",
    icon: "zap",
  },
  {
    id: "hybrid-era",
    name: "Hybrid Era",
    years: "2014 – Present",
    description:
      "Complex power units combine V6 turbo engines with electric energy recovery. Mercedes' early dominance gave way to Red Bull's Verstappen-led resurgence. Sustainability became F1's north star.",
    keyInnovations: [
      "V6 Turbo-Hybrid power units",
      "ERS energy recovery",
      "HALO safety device",
      "Sustainable fuel programs",
    ],
    dominantTeam: "Mercedes / Red Bull",
    color: "#0600EF",
    icon: "battery",
  },
];
