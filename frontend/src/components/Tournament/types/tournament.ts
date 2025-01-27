export interface Team {
    teamId: number;
    teamName: string;
  }
  
  export interface Tournament {
    tournamentId: number;
    tournamentName: string;
    organizerId: number;
    teams: { team: Team, teamId: number }[];
  }
  