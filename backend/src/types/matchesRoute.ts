export interface Match {
    tournamentId: number;
    firstTeamId: number;
    firstTeamName: string;
    secondTeamId: number;
    secondTeamName: string;
    dateTime: Date;
    venue: string;
    isLive: boolean;
    result: string;
    isCompleted: boolean
}
