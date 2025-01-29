// types.ts

export interface Tournament {
  id: number;
  tournamentName: string;
}

export interface Player {
  id: number;
  playerId: number;
  playerName: string;
}

export interface Team {
  teamId: number;
  teamName: string;
  players: Player[];
  tournamentTeams: {
    tournament: Tournament;
  }[];
}
