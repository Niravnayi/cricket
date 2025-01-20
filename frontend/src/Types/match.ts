import { Scorecard } from "./scorecard";
export interface Match {
    matchId: number;
    firstTeamName: string;
    secondTeamName: string;
    venue: string;
    dateTime: string;
    result: string | null;
    isLive: boolean;
    isCompleted: boolean;
    scorecard?: Scorecard | null;
  }