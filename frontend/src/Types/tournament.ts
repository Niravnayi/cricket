import { Team } from "./team";
import { Match } from "./match";

export interface Tournament {
  tournamentId?: number  | null;
  tournamentName: string;
  organizerId: number;
  teams?: Team[]  | null
  teamIds:number[]  | null
  matches?: Match[] | null
}

