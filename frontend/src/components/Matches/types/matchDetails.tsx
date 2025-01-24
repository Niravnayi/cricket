export interface MatchDetails {
  matchId: number;
  firstTeamName?: string;
  secondTeamName?: string;
  venue: string;
  dateTime: string;
  isLive: boolean;
  tournamentId?:number;
  firstTeamId:number;
  secondTeamId:number;
  isCompleted: boolean;
  currentBowlerId?:number;
  result: string;
  scorecard?: Scorecard | null;
}
export interface PlayerStats {
  playerName: string;  
  teamName: string;    
  runs: number;        
  balls: number;      
  dismissal?: string;  
  sixes?: number;
  fours?: number;
  teamId?: number;
}


export interface Scorecard {
  teamAScore: number;
  scorecardId?: number;
  teamAWickets: number;
  teamAOvers: number;
  teamBScore: number;
  teamBWickets: number;
  teamBOvers: number;
  battingStats?: BattingStats[];
  bowlingStats?: BowlingStats[];
  extras?: Extras;
}



// Define the BattingStats type to match the expected shape
export interface BattingStats {
  scorecardId: number;
  playerId: number;
  teamId: number;
  playerName: string;
  teamName: string;
  runs: number;
  balls: number;
  battingStatsId:number;
  fours: number;
  sixes: number;
  strikeRate: number;
  dismissal: string;
}


export interface Team {
  id: number;
  tournamentId: number;
  playerName:string;
  playerId?:number,
  teamId: number;
  teamName:string
  team: {
    teamId: number;
    teamName: string;
  };
}

export interface BowlingStats {
  playerName: string;
  teamName: string;
  overs: number;
  wickets: number;
  runsConceded: number;
}

export interface Extras {
  teamAExtras: number;
  teamBExtras: number;
}
