import { Team } from "./team";
import { Match } from "./match";

export interface Tournament {
  tournamentId: number;
  tournamentName: string;
  organizerId: number;
  teams: Team[];
  matches: Match[]
}

