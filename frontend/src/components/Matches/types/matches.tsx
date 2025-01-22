export interface MatchDetails {
  matchId: number;
  firstTeamName: string;
  secondTeamName: string;
  venue: string;
  dateTime: string;
  isLive: boolean;
  isCompleted: boolean;
  result: string;
  scorecard: Scorecard;
}

export interface Scorecard {
  teamAScore: number;
  teamAWickets: number;
  teamAOvers: number;
  teamBScore: number;
  teamBWickets: number;
  teamBOvers: number;
  battingStats: BattingStats[];
  bowlingStats: BowlingStats[];
  extras: Extras;
}

export interface BattingStats {
  playerName: string;
  teamName: string;
  runs: number;
  balls: number;
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
