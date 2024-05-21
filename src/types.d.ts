export type Event = {
	matchesById: Record<Match[`id`], Match>;
	name: string;
	participantsByName: Record<Participant[`name`], Participant>;
	roundsById: Record<Round[`id`], Round>;
};

export type Match = {
	id: number;
	roundId: Round[`id`];
	status: `bye` | `complete` | `incomplete`;
	timesByParticipantName: Record<Participant[`name`], string>;
	winnerName: Participant[`name`] | undefined;
};

export type Participant = {
	name: string;
	rank: number;
};

export type Round = {
	id: number;
};
