import axiosClient from "@/utils/axiosClient";

export async function fetchTeamPlayers({ firstTeamId, secondTeamId }: { firstTeamId: number, secondTeamId: number }) {
    try {
        const firstTeam = await axiosClient.get(`/team-players/team/${firstTeamId}`);
        const firstTeamPlayers = firstTeam.data;

        const secondTeam = await axiosClient.get(`/team-players/team/${secondTeamId}`);
        const secondTeamPlayers = secondTeam.data;
        return {
            firstTeam: firstTeamPlayers,
            secondTeam: secondTeamPlayers,
        };
    } catch (error) {
        console.error("Error fetching team players:", error);
        return {
            firstTeam: [],
            secondTeam: [],
        };
    }
}