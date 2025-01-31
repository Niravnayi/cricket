import axiosClient from "@/utils/axiosClient";

export async function fetchTeamData() {
    const response = await axiosClient.get("/teams");
    return response.data;
}