import { fetchText } from '@robertakarobin/util/fetchText.ts';
import { keysOf } from '@robertakarobin/util/group/keysOf.ts';

import type * as Local from '@src/types.d.ts';

type Participant = {
	DisplayName: string;
	Event: string;
	QualifyingRank: number;
	r1Bye: boolean;
	r1MatchNumber: number;
	r2Bye: boolean;
	r2MatchNumber: number;
	r3Bye: boolean;
	r3MatchNumber: number;
	r4MatchNumber: number;
	TimeRound1: string;
	TimeRound2: string;
	TimeRound3: string;
	TimeRound4: string;
	WonRound1: boolean;
	WonRound2: boolean;
	WonRound3: boolean;
	WonRound4: boolean;
};

const apiKeysByLocalKey = {
	isBye: (roundId: number) => `r${roundId}Bye` as `r1Bye`,
	isWin: (roundId: number) => `WonRound${roundId}` as `WonRound1`,
	matchId: (roundId: number) => `r${roundId}MatchNumber` as `r1MatchNumber`,
	time: (roundId: number) => `TimeRound${roundId}` as `TimeRound1`,
} as const;

export function eventFromApi(input: Array<Participant>): Local.Event {
	const event: Local.Event = {
		matchesById: {},
		name: undefined as unknown as string,
		participantsByBibId: {},
		roundsById: {},
	};

	const nameMatch = /(\w+)\s(\w+)\((\d+)\)/;

	for (const apiParticipant of input) {
		if (typeof event.name === `undefined`) {
			event.name = apiParticipant.Event;
		}

		if (apiParticipant.Event !== event.name) {
			throw new Error(`${apiParticipant.DisplayName} event is '${apiParticipant.Event}'; expected '${event.name}'`);
		}

		const [_, nameFirst, nameLast, bibId] = apiParticipant.DisplayName.match(nameMatch)!;
		const participant: Local.Participant = {
			bibId,
			nameFirst,
			nameLast,
			rank: apiParticipant.QualifyingRank,
		};
		event.participantsByBibId[participant.bibId] = participant;

		let roundId = 0;
		while (true) {
			roundId += 1;

			const result = {
				isBye: apiParticipant[apiKeysByLocalKey.isBye(roundId)],
				isWin: apiParticipant[apiKeysByLocalKey.isWin(roundId)],
				matchId: apiParticipant[apiKeysByLocalKey.matchId(roundId)],
				time: apiParticipant[apiKeysByLocalKey.time(roundId)],
			};

			if (Object.values(result).every(value => value === undefined)) {
				break;
			}

			for (const key of keysOf(result)) {
				if (result[key] === undefined && key !== `isBye`) {
					throw new Error(`'${apiParticipant.DisplayName}' is missing '${apiKeysByLocalKey[key](roundId)}'`);
				}
			}

			if (result.matchId === 0) {
				continue;
			}

			if (roundId in event.roundsById === false) {
				event.roundsById[roundId] = {
					id: roundId,
				};
			}

			const match = event.matchesById[result.matchId] ??= {
				id: result.matchId,
				roundId,
				status: `incomplete`,
				timesByBibId: {},
				winnerBibId: undefined,
			};

			match.timesByBibId[participant.bibId] = result.time;

			if (result.isWin) {
				match.status = `complete`;
				match.winnerBibId = participant.bibId;
			}

			if (result.isBye) {
				match.timesByBibId[participant.bibId] = `bye`;
			}
		}
	}

	return event;
}

export const getEventByUrl = async(url: string) => {
	if (url.length === 0) {
		throw new Error(`Invalid URL`);
	}

	const request = await fetch(url.trim());
	const result = await request.json() as Array<Participant>;
	if (`error` in result) {
		throw new Error(`RaceResult returned invalid results. Is your URL correct?`);
	}

	return eventFromApi(result);
};

export const getEventMock = async() => {
	const result = JSON.parse(await fetchText(`/mock.json`)) as Array<Participant>;
	return eventFromApi(result);
};
