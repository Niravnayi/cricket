import axiosClient from "@/utils/axiosClient"
import { Scorecard } from "@/components/Organizer/Matches/types/matchDetails"

export async function getScoreCard() {
    const response = await axiosClient.get('/scorecards')
    return response.data
}

export async function getScoreCardbyId({ scorecardId }: { scorecardId: number }) {
    const response = await axiosClient.get(`/scorecards/${scorecardId}`)
    return response.data
}
export async function setScoreCard({ matchId, Scorecard }: { matchId: number, Scorecard: Scorecard }) {
    const { teamAScore, teamBScore, teamAWickets, teamBWickets, teamAOvers, teamBOvers } = Scorecard
    const response = await axiosClient.post('/scorecards', {
        matchId, teamAScore, teamBScore, teamAWickets, teamBWickets, teamAOvers, teamBOvers
    })
    return response.data
}

export async function updateScoreCard({ scorecardId, Scorecard }: { scorecardId: number, Scorecard: Scorecard }) {
    const { teamAScore, teamBScore, teamAWickets, teamBWickets, teamAOvers, teamBOvers } = Scorecard
    const response = await axiosClient.put(`/scorecards/${scorecardId}`, {
        scorecardId, teamAScore, teamBScore, teamAWickets, teamBWickets, teamAOvers, teamBOvers
    })
    return response.data
}

