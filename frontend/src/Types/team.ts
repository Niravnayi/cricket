export interface Team {
  id: number;
  tournamentId: number;
  teamId: number;
  team: {
    teamId: number;
    teamName: string;
  };
}