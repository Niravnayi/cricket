import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axiosClient from "@/utils/axiosClient";
import { Tournament } from "@/Types/tournament";

export const useTournamentDetails = () => {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "live" | "scheduled" | "completed"
  >("live");
  const params = useParams();
  const id = params?.slug;

  useEffect(() => {
    async function fetchTournament() {
      if (!id) {
        setError("No ID provided for fetching tournaments");
        return;
      }

      try {
        const response = await axiosClient.get(`/tournaments/${id}`);
        if (response.status === 200) {
          setTournament(response.data);
        } else {
          setError(`Unexpected response: ${response.status}`);
        }
      } catch (err) {
        setError(`Failed to fetch tournament: ${err}`);
      }
    }

    fetchTournament();
  }, [id]);

  const liveMatches = tournament?.matches.filter((match) => match.isLive) || [];
  const scheduledMatches =
    tournament?.matches.filter(
      (match) => !match.isLive && !match.isCompleted
    ) || [];
  const completedMatches =
    tournament?.matches.filter((match) => match.isCompleted) || [];

  return {
    tournament,
    activeTab,
    setActiveTab,
    liveMatches,
    scheduledMatches,
    completedMatches,
    error,
  };
};
