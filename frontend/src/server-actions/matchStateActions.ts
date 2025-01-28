import axiosClient from "@/utils/axiosClient"

export async function updateMatchState({ matchId, currentBatter1Id, currentBatter2Id, currentBowlerId }: { matchId: number, currentBatter1Id: number, currentBatter2Id: number, currentBowlerId: number }) {

    const response = await axiosClient.put(`/match-state/${matchId}`, {
      dismissedBatterId: currentBatter1Id,
      newBatterId: currentBatter2Id,
      newBowlerId: currentBowlerId
    })
    return response.data
  }
  
  export async function getMatchState({ matchId }: { matchId: number }) {
    const response = await axiosClient.get(`/match-state/${matchId}`)
    return response.data
  }