import { BattingStat } from "./battingStatsRoute";
import { BowlingStat } from "./bowlingStatsRoute";
import { Extras } from "./extrasRoute";
export interface Scorecard {
    scorecardId: number;
    matchId: number;
    battingStats: BattingStat[];
    bowlingStats: BowlingStat[];
    extras: Extras[];
    teamAScore: number;
    teamBScore: number;
    teamAWickets: number;
    teamBWickets: number;
    teamAName:string;
    teamBName:string;
    teamAOvers: number;
    teamBOvers: number;
}