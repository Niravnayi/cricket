import { BowlingStats } from "@/components/Matches/types/matchDetails";
import axiosClient from "@/utils/axiosClient";

export async function getBowlingStats() {
    const response = await axiosClient.get('/bowling-stats')
    return response.data
}

export async function addBowlingStats({ bowlingStatsData }: { bowlingStatsData: BowlingStats }) {
    const { scorecardId, playerId, teamId, overs, maidens, runsConceded, wickets, economyRate } = bowlingStatsData;
    const response = await axiosClient.post('/bowling-stats', {
        scorecardId, playerId, teamId, overs, maidens, runsConceded, wickets, economyRate
    })
    return response.data
}

export async function updateBowlingStats({ bowlingStatsData, bowlingStatsId }: { bowlingStatsData: BowlingStats, bowlingStatsId: number }) {
    const { scorecardId, playerId, teamId, overs, maidens, runsConceded, wickets, economyRate } = bowlingStatsData;
    const response = await axiosClient.post('/bowling-stats', {
        bowlingStatsId, scorecardId, playerId, teamId, overs, maidens, runsConceded, wickets, economyRate
    })
    return response.data
}