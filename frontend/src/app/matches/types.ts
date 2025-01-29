export type BattingStats = {
  playerName: string;
  teamName: string;
  runs: number;
  balls: number;
  scorecardId:number;
  matchId:number;

  fours: number;
  sixes: number;
  strikeRate: number;
  dismissal: string;
};

export type BowlingStats = {
  playerName: string;
  teamName: string;
  overs: number;
  maidens: number;
  teamId:number;
  scorecardId:number;
  playerId?:number;
  runsConceded: number;
  economyRate?: number;
  wickets: number;
};

export type Scorecard = {
  teamAScore: number;
  teamBScore: number;
  teamAWickets: number;
  teamBWickets: number;
  teamAOvers: number;
  teamBOvers: number;
  battingStats: BattingStats[];
  bowlingStats: BowlingStats[];
};

export type matchDetails = {
  matchId: number;
  firstTeamName: string;
  secondTeamName: string;
  venue: string;
  dateTime: string;
  isLive: boolean;
  isCompleted: boolean;
  result: string;
  scorecard: Scorecard;
};

export interface Match {
  matchId: string;
  firstTeamName: string;
  secondTeamName: string;
  venue: string;
  dateTime: string;
  isLive: boolean;
  result: string;
  scorecard: {
    teamAScore: number;
    teamAWickets: number;
    teamAOvers: number;
    teamBScore: number;
    teamBWickets: number;
    teamBOvers: number;
  };
}

