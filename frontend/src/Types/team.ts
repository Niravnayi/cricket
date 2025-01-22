export interface Team {
  id: number;
  tournamentId: number;
  teamId: number;
  teamName:string
  team: {
    teamId: number;
    teamName: string;
  };
}