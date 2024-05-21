export type Event = {
	matchesById: Record<Match[`id`], Match>;
	name: string;
	participantsByBibId: Record<Participant[`bibId`], Participant>;
	roundsById: Record<Round[`id`], Round>;
};

export type Match = {
	id: number;
	roundId: Round[`id`];
	status: `complete` | `incomplete`;
	timesByBibId: Record<Participant[`bibId`], string>;
	winnerBibId: Participant[`bibId`] | undefined;
};

export type Participant = {
	bibId: string;
	nameFirst: string;
	nameLast: string;
	rank: number;
};

export type Round = {
	id: number;
};
