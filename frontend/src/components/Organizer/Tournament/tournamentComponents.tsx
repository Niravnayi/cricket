"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Match } from "@/components/Organizer/Tournament/types/tournamentType";
import MatchModal from "@/components/Organizer/Tournament/MatchModal";
import Link from "next/link";
import { deleteMatch, fetchTournamentMatches } from "@/server-actions/matchesActions";

export default function TournamentComponent({ tournamentId }: { tournamentId: number }) {
  const [matches, setMatches] = useState<Match[] | "Unauthorized">([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("scheduled");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const fetchedData = await fetchTournamentMatches(tournamentId);
        setMatches(fetchedData);
      } catch (error) {
        console.error("Error fetching tournament matches:", error);
        setMatches("Unauthorized"); 
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, [tournamentId]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleDelete = async (matchId: number) => {
    try {
      await deleteMatch(matchId);
      setMatches((prevMatches) =>
        prevMatches !== "Unauthorized" ? prevMatches.filter((match) => match.matchId !== matchId) : prevMatches
      );
    } catch (error) {
      console.error("Error deleting match:", error);
    }
  };

  const handleEditMatch = (matchId: number) => {
    if (matches === "Unauthorized") return;
    const matchToEdit = matches.find((match) => match.matchId === matchId);
    if (matchToEdit) {
      setEditingMatch(matchToEdit);
      setIsModalOpen(true);
    }
  };

  const renderMatches = (status: string) => {
    if (matches === "Unauthorized") return null; // Prevent errors
    return matches
      .filter((match) => {
        if (status === "live") return match.isLive;
        if (status === "scheduled") return !match.isLive && !match.isCompleted;
        if (status === "completed") return match.isCompleted;  
        return false;
      })
      .map((match) => (
        <div key={match.matchId} className="bg-white shadow-lg rounded-lg p-4 mb-4 border">
          <Link href={`/matches/${match.matchId}`}>
            <h5 className="text-lg font-semibold text-gray-800">{`${match.firstTeamName} vs ${match.secondTeamName}`}</h5>
          </Link>
          <p className="text-sm text-gray-600">{`Venue: ${match.venue}`}</p>
          <p className="text-sm text-gray-600">{`Date: ${new Date(match.dateTime).toLocaleString()}`}</p>
          <p className="text-sm text-gray-600">{`Result: ${match.result}`}</p>
          <div className="flex space-x-2 mt-2">
            <Button className="bg-blue-500 text-white" onClick={() => handleEditMatch(match.matchId)}>
              Edit
            </Button>
            <Button className="bg-red-500 text-white" onClick={() => handleDelete(match.matchId)}>
              Delete
            </Button>
          </div>
        </div>
      ));
  };

  if (matches === "Unauthorized") {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-red-600">Unauthorized Access</h1>
        <p className="text-gray-700">You do not have permission to view this tournament's matches.</p>
        <Link href="/">
          <Button className="mt-4 bg-gray-500 text-white">Go Back</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold mb-6">Matches for Tournament ID: {tournamentId}</h3>

      {/* Tab Controls */}
      <div className="mb-4 flex space-x-4">
        <Button
          className={`px-4 py-2 rounded-md ${activeTab === "live" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
          onClick={() => handleTabChange("live")}
        >
          Live
        </Button>
        <Button
          className={`px-4 py-2 rounded-md ${activeTab === "scheduled" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
          onClick={() => handleTabChange("scheduled")}
        >
          Scheduled
        </Button>
        <Button
          className={`px-4 py-2 rounded-md ${activeTab === "completed" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
          onClick={() => handleTabChange("completed")}
        >
          Completed
        </Button>
      </div>

      {/* Match Listing */}
      {loading ? (
        <div className="text-center text-lg font-semibold">Loading matches...</div>
      ) : (
        <div className="space-y-4">
          {activeTab === "live" && renderMatches("live")}
          {activeTab === "scheduled" && renderMatches("scheduled")}
          {activeTab === "completed" && renderMatches("completed")}
        </div>
      )}

      {/* Create Match Button */}
      <Button
        className="mt-6 px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600"
        onClick={() => {
          setEditingMatch(null);
          setIsModalOpen(true);
        }}
      >
        Create Match
      </Button>

      {/* Match Modal */}
      {isModalOpen && (
        <MatchModal
          tournamentId={tournamentId}
          editingMatch={editingMatch}
          onClose={() => setIsModalOpen(false)}
          onSave={() => {
            setIsModalOpen(false);
            fetchTournamentMatches(tournamentId).then((fetchedData) => setMatches(fetchedData));
          }}
        />
      )}
    </div>
  );
}
