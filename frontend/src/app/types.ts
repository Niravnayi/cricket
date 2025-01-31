export interface Match {
    matchId: string;
    matchName: string;
    matchDate: string;
    venue: string;
    firstTeamName: string;
    secondTeamName: string;
    dateTime: string;
    isLive: boolean;
    result: string;
    scorecard: {
      teamAScore: number;
      teamAWickets: number;
      teamAOvers: number;
      teamBScore: number;
      teamBWickets: number;
      teamBOvers: number;
    };
  }
  
  export interface Player {
    playerId: string;
    playerName: string;
    playerRole: string;
  }
  
  export interface TournamentTeam {
    id: string;
    tournament: Tournament;
  }
  
  export interface Team {
    teamId: string;
    teamName: string;
    players: Player[];
    tournamentTeams: TournamentTeam[];
  }
  
  export interface Tournament {
    tournamentId: string;
    tournamentName: string;
    teams: { team: Team }[];
  }