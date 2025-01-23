import { BattingStats } from "@/app/matches/types";
import {  Scorecard } from "@/components/Matches/types/matchDetails";
import axiosClient from "@/utils/axiosClient";

export async function fetchMatchById(id: number) {
    try {
        const response = await axiosClient.get(`/matches/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching match details:", error);
        throw new Error("Failed to fetch match details");
    }
}

export async function fetchTeamPlayers({ firstTeamId, secondTeamId }: { firstTeamId: number, secondTeamId: number }) {
    try {
      // Fetch first team players
      const firstTeam = await axiosClient.get(`/team-players/team/${firstTeamId}`);
      const firstTeamPlayers = firstTeam.data;
  
      // Fetch second team players
      const secondTeam = await axiosClient.get(`/team-players/team/${secondTeamId}`);
      const secondTeamPlayers = secondTeam.data;
      return {
        firstTeam: firstTeamPlayers,
        secondTeam: secondTeamPlayers,
      };
    } catch (error) {
      console.error("Error fetching team players:", error);
      return {
        firstTeam: [],
        secondTeam: [],
      };
    }
  }

export async function updateBattingStats({updateBatting, battingStatsId}: { updateBatting: BattingStats, battingStatsId: number }){
    const response = await axiosClient.put(`/batting-stats/${battingStatsId}`,{

        updateBatting    })
    return response.data

}
export async function addBattingStats(battingStatsData: BattingStats) {
  try {
    const response = await axiosClient.post('/batting-stats', battingStatsData);
    return response.data;
  } catch (error) {
    throw new Error('Error creating batting stats: ' + error);
  }
}


export async function getBattingStats(){
  const response = await axiosClient.get('/batting-stats')
  return response.data
  
}


export async function updateMatchStats({ id , tournamentId, firstTeamId, secondTeamId, venue, dateTime, isLive}: { id: number,  tournamentId:number, firstTeamId:number, secondTeamId:number, venue:string, dateTime:Date, isLive:boolean }){
    const response = await axiosClient.put(`/matches/${id}`,{
      tournamentId, firstTeamId, secondTeamId, venue, dateTime, isLive
    })
    return response.data
}
export async function updateMatchState({matchId, currentBatter1Id, currentBatter2Id, currentBowlerId}: { matchId: number, currentBatter1Id: number, currentBatter2Id: number, currentBowlerId: number }){

  const response = await axiosClient.put(`/match-state/${matchId}`,{
    dismissedBatterId:currentBatter1Id,
    newBatterId:currentBatter2Id,
    newBowlerId:currentBowlerId
  })
  return response.data
}

export async function getMatchState({matchId}:{matchId:number}){
  const response = await axiosClient.get(`/match-state/${matchId}`)
  return response.data
}

export async function setScoreCard({matchId,Scorecard}:{matchId:number,Scorecard:Scorecard}){
  const {teamAScore,teamBScore,teamAWickets,teamBWickets,teamAOvers,teamBOvers} = Scorecard
  const response = await axiosClient.post('/scorecards',{
    matchId,teamAScore,teamBScore,teamAWickets,teamBWickets,teamAOvers,teamBOvers
  })
  return response.data
}

export async function updateScoreCard({scorecardId,Scorecard}:{scorecardId:number,Scorecard:Scorecard}){
  const {teamAScore,teamBScore,teamAWickets,teamBWickets,teamAOvers,teamBOvers} = Scorecard
  const response = await axiosClient.put(`/scorecards/${scorecardId}`,{
    scorecardId,teamAScore,teamBScore,teamAWickets,teamBWickets,teamAOvers,teamBOvers
  })
  return response.data
}


export default fetchMatchById;
