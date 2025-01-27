import { Tournament } from "@/components/Dashboard/types/dashboard";
import { Match } from "@/components/Organizer/Tournament/types/tournamentType";
import axiosClient from "@/utils/axiosClient";

export async function fetchTeamData() {
    const response = await axiosClient.get("/teams");
    return response.data;
}

export async function fetchTournaments(organizerId:number) {
    const response = await axiosClient.get(`/organizers/tournaments/${organizerId}`);
    return Array.isArray(response.data) ? response.data : [response.data];
}

export async function fetchTournamentById(tournamentId: number) {
    const response = await axiosClient.get(`/tournaments/${tournamentId}`);
    return response.data;  
}

export async function createTournament(tournament:Tournament) {
    await axiosClient.post("/tournaments/", tournament);
}

export async function updateTournament(tournamentId:number, tournament:Tournament) {
    await axiosClient.put(`/tournaments/${tournamentId}`, tournament);
}

export async function deleteTournament(tournamentId:number) {
    await axiosClient.delete(`/tournaments/${tournamentId}`);
}



// Function to create a match
export const createMatch = async (matchData: Match) => {
  try {
    const { tournamentId, firstTeamId, secondTeamId, venue, dateTime } = matchData;
    
    const response = await axiosClient.post("/matches", {
      tournamentId,
      firstTeamId,
      secondTeamId,
      venue,
      dateTime,
    });

    if (response.status === 201) {
      return response.data;
    }
    throw new Error("Failed to create match");
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error creating match: ${error.message}`);
    } else {

      throw new Error("An unknown error occurred while creating match.");
    }
 }
};

// Function to update an existing match
export const updateMatch = async (matchId: number, matchData: Match) => {
  try {
    const { tournamentId, firstTeamId, secondTeamId, venue, dateTime, isLive } = matchData;

    const response = await axiosClient.put(`/matches/${matchId}`, {
      tournamentId,
      firstTeamId,
      secondTeamId,
      venue,
      dateTime,
      isLive,
    });

    if (response.status === 200) {
      return response.data;
    }
    throw new Error("Failed to update match");
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error creating match: ${error.message}`);
    } else {
      // Handle unexpected error types
      throw new Error("An unknown error occurred while creating match.");
    }
 }
};