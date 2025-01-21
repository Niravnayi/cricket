
export type BattingStats = {
    playerName: string;
    scorecardId:string
    teamName: string;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    strikeRate: number;
    dismissal: string;
  };
  
export type MatchDetails = {
    matchId: number;
    firstTeamName: string;
    scorecard: {
      battingStats: BattingStats[];
      scorecardId:string
    };
  };
  