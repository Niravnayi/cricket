export interface BattingStat {
    scorecardId: number;
    playerId: number;
    teamId: number;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    strikeRate: number;
    dismissal: string;
}
