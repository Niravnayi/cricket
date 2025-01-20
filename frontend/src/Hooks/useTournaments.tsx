import { useState, useEffect } from "react";
import axiosClient from "@/utils/axiosClient";
import { Tournament } from "@/Types/tournament";

export const useTournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTournaments() {
      try {
        const response = await axiosClient.get("/tournaments");
        if (response.status === 200) {
          setTournaments(response.data);
          console.log("Fetched Tournaments:", response.data);
        } else {
          console.error("Unexpected response:", response);
        }
      } catch (err) {
        console.error("Error fetching tournaments:", err);
        setError("Failed to fetch tournaments");
      }
    }

    fetchTournaments();
  }, []);

  return { tournaments, error };
};
