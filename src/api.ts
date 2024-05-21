import { apiFactory } from '@robertakarobin/util/web/api.ts';
import { fetchText } from '@robertakarobin/util/fetchText.ts';
import { keysOf } from '@robertakarobin/util/group/keysOf.ts';

import type * as Local from '@src/types.d.ts';

type Particpant = {
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

export function eventFromApi(input: Array<Particpant>): Local.Event {
	const event: Local.Event = {
		matchesById: {},
		name: undefined as unknown as string,
		participantsByName: {},
		roundsById: {},
	};

	for (const apiParticipant of input) {
		if (typeof event.name === `undefined`) {
			event.name = apiParticipant.Event;
		}

		if (apiParticipant.Event !== event.name) {
			throw new Error(`Event name was '${apiParticipant.Event}'; expected ${event.name}`);
		}

		const participant: Local.Participant = {
			name: apiParticipant.DisplayName,
			rank: apiParticipant.QualifyingRank,
		};
		event.participantsByName[participant.name] = participant;

		let roundId = 0;
		while (true) {
			roundId += 1;

			const result = {
				isBye: apiParticipant[`r${roundId}Bye` as keyof Particpant] as Particpant[`r1Bye`],
				isWin: apiParticipant[`WonRound${roundId}` as keyof Particpant] as Particpant[`WonRound1`],
				matchId: apiParticipant[`r${roundId}MatchNumber` as keyof Particpant] as Particpant[`r1MatchNumber`],
				time: apiParticipant[`TimeRound${roundId}` as keyof Particpant] as Particpant[`TimeRound1`],
			};

			if (Object.values(result).every(value => value === undefined)) {
				break;
			}

			for (const key of keysOf(result)) {
				if (result[key] === undefined && key !== `isBye`) {
					throw new Error(`Round ${roundId} is missing data for '${key}'`);
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
				timesByParticipantName: {},
				winnerName: undefined,
			};

			match.timesByParticipantName[participant.name] = result.time;

			if (result.isWin) {
				match.status = `complete`;
				match.winnerName = participant.name;
			}

			if (result.isBye) {
				match.status = `bye`;
				match.winnerName = participant.name;
			}
		}
	}

	return event;
}

export const raceResultApi = apiFactory(`https://api.raceresult.com/`, {
	preprocess: params => delete params.headers, // Throws CORS error if headers are sent
});

export const getEventById = async(param1: string, param2: string) => {
	const result: Array<Particpant> = await raceResultApi({
		at: `${param1}/${param2}`,
		format: `json`,
		method: `GET`,
	});
	return eventFromApi(result);
};

export const getEventMock = async() => {
	const result = JSON.parse(await fetchText(`/mock.json`)) as Array<Particpant>;
	return eventFromApi(result);
};
