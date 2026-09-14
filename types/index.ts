export interface DriverSkillMetrics {
  qualifyingPace: number;
  racecraft: number;
  tireManagement: number;
  wetWeather: number;
  overtaking: number;
  consistency: number;
}

export interface Driver {
  id: string;
  name: string;
  number: number;
  nationality: string;
  team: string;
  teamColor: string;
  dateOfBirth: string;
  worldChampionships: number;
  raceWins: number;
  podiums: number;
  polePositions: number;
  fastestLaps: number;
  careerStart: number;
  active: boolean;
  skills: DriverSkillMetrics;
  imageUrl?: string;
}

export interface Constructor {
  id: string;
  name: string;
  fullName: string;
  color: string;
  accentColor: string;
  engineSupplier: string;
  worldChampionships: number;
  raceWins: number;
  polePositions: number;
  founded: number;
  country: string;
  base: string;
  currentDrivers: string[];
  history: string;
}

export type TelemetryMode = "drs" | "topSpeed" | "highDownforce" | "quali" | "default";

export interface TelemetryState {
  mode: TelemetryMode;
  speed: number;
  rpm: number;
  downforce: number;
  dragReduction: number;
  enginePower: number;
  brakeBias: number;
  ersDeployment: number;
}

export interface Era {
  id: string;
  name: string;
  years: string;
  description: string;
  keyInnovations: string[];
  dominantTeam: string;
  color: string;
  icon: string;
}

export interface RaceEvent {
  round: number;
  name: string;
  location: string;
  country: string;
  circuit: string;
  date: string;
  length: string;
  laps: number;
  flag: string;
}

export interface StandingEntry {
  position: number;
  driver: string;
  driverNumber: number;
  team: string;
  teamColor: string;
  points: number;
  wins: number;
}
