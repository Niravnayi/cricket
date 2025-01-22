
export type BattingStats = {
    playerName: string;
    scorecardId:string;
    playerId:string;
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
    firstTeamId:string;
    scorecard: {
      battingStats: BattingStats[];
      scorecardId:string
    };
  };
  