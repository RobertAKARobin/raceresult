export type Event = {
	matchesById: Record<Match[`id`], Match>;
	name: string;
	participantsByName: Record<Participant[`name`], Participant>;
	roundsByIndex: Array<Round>;
};

export type Match = {
	bibIdsByName: Record<Participant[`name`], string>;
	id: string;
	roundId: Round[`index`];
	timesByName: Record<Participant[`name`], string>;
	winnerName: Participant[`name`];
};

export type Participant = {
	name: string;
};

export type Round = {
	index: number;
	matchIdsByIndex: Array<Match[`id`]>;
};
