
import { Tournament } from "@/components/Dashboard/types/dashboard";
import axiosClient from "@/utils/axiosClient";

export async function fetchTeamData() {
    const response = await axiosClient.get("/teams");
    return response.data;
}

export async function fetchTournaments(organizerId:number) {
    const response = await axiosClient.get(`/organizers/tournaments/${organizerId}`);
    return Array.isArray(response.data) ? response.data : [response.data];
}

export async function createTournament(tournament:Tournament) {
    await axiosClient.post("/tournaments/", tournament);
}

export async function updateTournament(tournamentId:number, tournament:Tournament) {
    await axiosClient.put(`/tournaments/${tournamentId}`, tournament);
}

export async function deleteTournament(tournamentId:number) {
    await axiosClient.delete(`/tournaments/${tournamentId}`);
}