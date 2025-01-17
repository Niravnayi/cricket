import axios from "axios";

const API_BASE = "http://localhost:4000"; 

// Tournament APIs
export const fetchTournaments = async () => axios.get(`${API_BASE}/tournaments`);
export const createTournament = async (data: any) => axios.post(`${API_BASE}/tournaments`, data);
export const fetchTournamentById = async (id: string) =>
  axios.get(`${API_BASE}/tournaments/${id}`);

// Match APIs
export const fetchMatchesByTournament = async (tournamentId: string) =>
  axios.get(`${API_BASE}/matches/${tournamentId}`);
export const createMatch = async (data: any) => axios.post(`${API_BASE}/matches`, data);
