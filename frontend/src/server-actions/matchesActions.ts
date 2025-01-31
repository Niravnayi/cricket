import axiosClient from "@/utils/axiosClient";

export async function fetchMatchById(id: number) {
  try {
    const response = await axiosClient.get(`/matches/${id}`);
    return response.data;
  } 
  catch (error) {
    console.error("Error fetching match details:", error);
    throw new Error("Failed to fetch match details");
  }
}

export const fetchTournamentMatches = async (id: number) => {
  try {
    const response = await axiosClient.get(`/tournaments/${id}`);
    if (response.status === 200) {
      return response.data.matches;
    }
    throw new Error(`Unexpected response: ${response.status}`);
  } 
  catch (err) {
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
  } 
  catch (err) {
    throw new Error(`Error creating match: ${err}`);
  }
};

interface MatchUpdate {
  id: number;
  tournamentId: number;
  firstTeamId: number;
  secondTeamId: number;
  isLive:boolean;
  venue: string;
  dateTime: string;
}

export const updateMatch = async (matchDetails: MatchUpdate) => {
  try {
    const { id, tournamentId, firstTeamId, isLive,secondTeamId, venue, dateTime } = matchDetails;

    const response = await axiosClient.put(`/matches/${id}`, {
      tournamentId,
      firstTeamId,
      secondTeamId,
      isLive,
      venue,
      dateTime,
    });

    if (response?.status === 200) {
      return response.data;
    }
    throw new Error("Failed to update match");
  } 
  catch (err) {
    throw new Error(`Error updating match: ${err}`);
  }
};

export const deleteMatch = async (matchId: number) => {
  try {
    await axiosClient.delete(`/matches/${matchId}`);
  } 
  catch (err) {
    throw new Error(`Error deleting match: ${err}`);
  }
};


