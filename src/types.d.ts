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


/*
{
	"DisplayName": "Henry BRANDOW(55)",
	"Event": "Beginners - Boys 14 & Under",
	"QualifyingRank": 1,
	"r1MatchNumber": 1,
	"r2MatchNumber": 9,
	"r3MatchNumber": 13,
	"r4MatchNumber": 15,
	"r1Bye": true,
	"r2Bye": false,
	"r3Bye": false,
	"WonRound1": false,
	"WonRound2": true,
	"WonRound3": true,
	"WonRound4": false,
	"TimeRound1": "",
	"TimeRound2": "0:42.8",
	"TimeRound3": "0:41.4",
	"TimeRound4": "0:43.3"
}
*/
