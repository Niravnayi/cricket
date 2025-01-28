import { Tournament } from "@/components/Dashboard/types/dashboard";
import axiosClient from "@/utils/axiosClient";

export const fetchAllTournaments = async () => {
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
export async function fetchOrganizerTournaments(organizerId: number) {
    const response = await axiosClient.get(`/organizers/tournaments/${organizerId}`);
    return Array.isArray(response.data) ? response.data : [response.data];
}

export async function fetchTournamentById(tournamentId: number) {
    const response = await axiosClient.get(`/tournaments/${tournamentId}`);
    return response.data;
}

export async function createTournament(tournament: Tournament) {
    await axiosClient.post("/tournaments/", tournament);
}

export async function updateTournament(tournamentId: number, tournament: Tournament) {
    await axiosClient.put(`/tournaments/${tournamentId}`, tournament);
}

export async function deleteTournament(tournamentId: number) {
    await axiosClient.delete(`/tournaments/${tournamentId}`);
}
