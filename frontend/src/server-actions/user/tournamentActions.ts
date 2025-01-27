import axiosClient from "@/utils/axiosClient";
import { Tournament } from "@/components/Tournament/types/tournament";

export const fetchTournaments = async (): Promise<Tournament[]> => {
  try {
    const response = await axiosClient.get("/tournaments");
    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Unexpected response:", response);
      throw new Error("Failed to fetch tournaments");
    }
  } catch (err) {
    console.error("Error fetching tournaments:", err);
    throw new Error("Error fetching tournaments");
  }
};