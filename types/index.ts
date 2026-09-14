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
}

export interface Constructor {
  id: string;
  name: string;
  fullName: string;
  color: string;
  engineSupplier: string;
  worldChampionships: number;
  raceWins: number;
  polePositions: number;
  founded: number;
  country: string;
  base: string;
  currentDrivers: string[];
  history: string;
  logo: string;
}

export type TelemetryMode = "drs" | "topSpeed" | "highDownforce" | "default";

export interface TelemetryState {
  mode: TelemetryMode;
  speed: number;
  rpm: number;
  downforce: number;
  dragReduction: number;
  enginePower: number;
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
