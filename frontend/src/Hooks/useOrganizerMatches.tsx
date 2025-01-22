'use client'
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axiosClient from '@/utils/axiosClient';
import { BattingStats, MatchDetails } from '@/app/organizer/matches/types/matchType';
export const useOrganizerMatches = () => {
    const [match, setMatch] = useState<MatchDetails | null>(null);
    const [editing, setEditing] = useState<{ [key: string]: boolean }>({});
    const [updatedStats, setUpdatedStats] = useState<{ [key: string]: Partial<BattingStats> }>({});
    const params = useParams();
    const id = params?.slug;
  
    useEffect(() => {
      async function fetchData() {
        if (id) {
          try {
            const response = await axiosClient.get(`/matches/${id}`);
            
            setMatch(response.data);
          } catch (error) {
            console.error('Error fetching match:', error);
          }
        }
      }
      fetchData();
    }, [id]);
  
    const handleEditClick = (playerName: string) => {
      setEditing((prev) => ({ ...prev, [playerName]: !prev[playerName] }));
    };
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, playerName: string, field: keyof BattingStats) => {
      setUpdatedStats((prev) => ({
        ...prev,
        [playerName]: {
          ...prev[playerName],
          [field]: Number(e.target.value),
        },
      }));
    };
  
    const handleSave = (playerName: string) => async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const updatedPlayerStats = updatedStats[playerName];
      try {
        await axiosClient.put(`/batting-stats/${match?.scorecard?.scorecardId}`, {
          playerName,
          updatedPlayerStats,
        });
  
        setMatch((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            scorecard: {
              ...prev.scorecard,
              battingStats: prev.scorecard.battingStats.map((b) =>
                b.playerName === playerName
                  ? { ...b, ...updatedPlayerStats }
                  : b
              ),
            },
          };
        });
  
        setEditing((prev) => ({ ...prev, [playerName]: false }));
      } catch (error) {
        console.error('Error updating stats:', error);
      }
    };
    return{
        match,
        setMatch,
        setEditing,
        editing,
        updatedStats,
        setUpdatedStats,
        handleEditClick,
        handleChange,
        handleSave,
    }
  };
  