// hooks/useMatchData.ts
import { useState, useEffect } from "react";
import axiosClient from "@/utils/axiosClient";
import { useParams } from "next/navigation";
import { MatchDetails } from "@/app/matches/types";

export const useMatchData = () => {
  const [match, setMatch] = useState<MatchDetails[]>([]);
  const params = useParams();
  const id = params?.slug;

  useEffect(() => {
    async function fetchData() {
      if (id) {
        try {
          const response = await axiosClient.get(`/matches/${id}`);
          const data = Array.isArray(response.data)
            ? response.data
            : [response.data];
          setMatch(data);
        } catch (error) {
          console.error("Error fetching matches:", error);
        }
      }
    }
    fetchData();
  }, [id]);

  return { match };
};
