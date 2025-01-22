// app/actions/fetchMatchDetails.ts
import axiosClient from "@/utils/axiosClient";
import { MatchDetails } from '@/app/organizer/matches/types/matchType';

export async function fetchMatchDetails(id: string): Promise<MatchDetails | null> {
  try {
    const response = await axiosClient.get<MatchDetails>(`/matches/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching match details:', error);
    return null;
  }
}

export async function fetchTeamData() {
    const response = await axiosClient.get("/teams");
    return response.data;
}

  
