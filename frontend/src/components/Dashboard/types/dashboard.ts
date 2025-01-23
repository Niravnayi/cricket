export interface Tournament {
  tournamentId?: number | null;
  tournamentName: string;
  organizerId: number;
  organizer?: Organizer
  teams?: Team[] | null
  teamIds: number[] | null
  matches?: Match[] | null
}

export interface Organizer {
  organizerId: number;
  organizerName: string;
  organizerEmail: string;
}

export interface Team {

  id: number;

  tournamentId: number;

  playerName: string;

  teamId: number;

  teamName: string;

  team: {

    teamId: number;

    teamName: string;

  };

}


export interface Match {
  matchId: number;
  firstTeamName: string;
  secondTeamName: string;
  venue: string;
  dateTime: string;
  result: string | null;
  isLive: boolean;
  isCompleted: boolean;
  scorecard?: Scorecard | null;
}

export interface Scorecard {
  scorecardId: number;
  teamAScore: number;
  teamBScore: number;
  teamAWickets: number;
  teamBWickets: number;
  teamAOvers: number;
  teamBOvers: number;
}