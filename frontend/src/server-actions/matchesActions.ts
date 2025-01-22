import axiosClient from "@/utils/axiosClient";

export async function fetchMatchById(id: number) {
    try {
        const response = await axiosClient.get(`/matches/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching match details:", error);
        throw new Error("Failed to fetch match details");
    }
}

export default fetchMatchById;
