export type BattingStats = {
    playerName: string;
    teamName: string;
    runs: number;
    balls: number;
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
    runsConceded: number;
    wickets: number;
    economy: number;
  };
  
  export type Scorecard = {
    teamAScore: number;
    teamBScore: number;
    teamAWickets: number;
    teamBWickets: number;
    teamAOvers: number;
    teamBOvers: number;
    battingStats?: BattingStats[];
    bowlingStats?: BowlingStats[];
  };
  
  export type matchDetails = {
    matchDetails:{
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
  };
  