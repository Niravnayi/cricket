import { BattingStats } from "@/components/Matches/types/matchDetails";
import axiosClient from "@/utils/axiosClient"

export async function getBattingStats() {
    const response = await axiosClient.get('/batting-stats')
    return response.data
}

export async function addBattingStats(battingStatsData: BattingStats[]) {
    try {
        const response = await axiosClient.post('/batting-stats', battingStatsData);
        return response.data;
    }
    catch (error) {
        throw new Error('Error creating batting stats: ' + error);
    }
}

export async function updateBattingStats({ scorecardId, playerId, teamId, runs, balls, fours, sixes, strikeRate, dismissal, battingStatsId }: { scorecardId: number, playerId: number, teamId: number, teamName: string, runs: number, balls: number, fours: number, sixes: number, strikeRate: number, dismissal: string, battingStatsId: number }) {
    const response = await axiosClient.put(`/batting-stats/${battingStatsId}`, {
        scorecardId,
        playerId,
        teamId,
        runs,
        balls,
        fours,
        sixes,
        strikeRate,
        dismissal,
    })
    return response.data
}