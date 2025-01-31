import { Scorecard } from "@/app/matches/types/types";

export interface Tournament {
    tournamentId: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    teams: Team[];
  }
  
  export interface Team {
    teamId: number;
    teamName: string;
    logo: string;
  }
  
  export interface Match {
    matchId: number;
    tournamentId: number;
    firstTeamId: number;
    secondTeamId: number;
    firstTeamName: string;
    secondTeamName: string;
    venue: string;
    dateTime: string;
    status: "Live" | "Scheduled" | "Completed";
    scorecard: Scorecard;
    isLive: boolean;
    isCompleted: boolean;
    result: string;
  }