import axiosClient from "@/utils/axiosClient";
import { Match } from "@/components/Organizer/Tournament/types/tournamentType";

export const fetchTournamentMatches = async (id: number): Promise<Match[]> => {
  try {
    const response = await axiosClient.get(`/tournaments/${id}`);
    if (response.status === 200) {
      return response.data.matches as Match[];
    }
    throw new Error(`Unexpected response: ${response.status}`);
  } catch (err) {
    throw new Error(`Failed to fetch tournament matches: ${err}`);
  }
};

export const createMatch = async (
  tournamentId: number,
  teamAId: number,
  teamBId: number,
  venue: string,
  date: string
) => {
  try {
    const response = await axiosClient.post("/matches", {
      tournamentId,
      firstTeamId: teamAId,
      secondTeamId: teamBId,
      venue,
      dateTime: date,
    });

    if (response?.status === 201) {
      return response.data;
    }
    throw new Error("Failed to create match");
  } catch (err) {
    throw new Error(`Error creating match: ${err}`);
  }
};

export const updateMatch = async (
  matchId: number,
  tournamentId: number,
  teamAId: number,
  teamBId: number,
  venue: string,
  date: string
) => {
  try {
    const response = await axiosClient.put(`/matches/${matchId}`, {
      tournamentId,
      firstTeamId: teamAId,
      secondTeamId: teamBId,
      venue,
      dateTime: date,
    });

    if (response?.status === 200) {
      return response.data;
    }
    throw new Error("Failed to update match");
  } catch (err) {
    throw new Error(`Error updating match: ${err}`);
  }
};

export const deleteMatch = async (matchId: number) => {
  try {
    await axiosClient.delete(`/matches/${matchId}`);
  } catch (err) {
    throw new Error(`Error deleting match: ${err}`);
  }
};



export const getTeams = async () => {
  try {
    const response = await axiosClient.get("/teams");
    if (response.status === 200) {
      return response.data;
    }
    throw new Error(`Unexpected response: ${response.status}`);
  } catch (err) {
    throw new Error(`Failed to fetch teams: ${err}`);
  }
};