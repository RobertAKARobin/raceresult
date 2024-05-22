import { capitalize } from '@robertakarobin/util/string/capitalize.ts';
import { fetchText } from '@robertakarobin/util/fetchText.ts';
import { keysOf } from '@robertakarobin/util/group/keysOf.ts';
import { sortOn } from '@robertakarobin/util/group/sortOn.ts';

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
		participantsByName: {},
		roundsByIndex: [],
	};

	const namePattern = /(\w+)\s(\w+)\((\d+)\)/;

	const matchIdsByParticipantName = {} as Record<
		Local.Participant[`name`],
		Set<Local.Match[`id`]>
	>;

	matchIdsByParticipantName[`bye`] = new Set();

	for (const apiParticipant of input) {
		if (typeof event.name === `undefined`) {
			event.name = apiParticipant.Event;
		}

		if (apiParticipant.Event !== event.name) {
			throw new Error(`${apiParticipant.DisplayName} event is '${apiParticipant.Event}'; expected '${event.name}'`);
		}

		const [_, nameFirst, nameLast, bibId] = apiParticipant.DisplayName.match(namePattern)!;
		const participant: Local.Participant = {
			name: `${nameFirst} ${capitalize(nameLast)}`,
		};
		event.participantsByName[participant.name] = participant;

		const participantMatchIds = matchIdsByParticipantName[participant.name] ??= new Set();

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

			const matchId = `${result.matchId}`;

			const match = event.matchesById[result.matchId] ??= {
				bibIdsByName: {},
				id: matchId,
				roundId: -1,
				timesByName: {},
				winnerName: undefined as unknown as Local.Participant[`name`],
			};

			match.bibIdsByName[participant.name] = bibId;
			match.timesByName[participant.name] = result.time;
			participantMatchIds.add(match.id);

			if (result.isWin) {
				match.winnerName = participant.name;
			}

			if (result.isBye) {
				match.timesByName[participant.name] = `bye`;
				match.winnerName = participant.name;
				matchIdsByParticipantName[`bye`].add(match.id);
			}
		}
	}

	const participantsRemaining = new Set(
		Object.keys(matchIdsByParticipantName).sort(
			sortOn(name => matchIdsByParticipantName[name].size)
		)
	);

	const roundIndexByMatchId = {} as Record<Local.Match[`id`], Local.Round[`index`]>;
	let roundIndex = 0;
	while (true) {
		const matchIdsByIndex = new Set<Local.Match[`id`]>();
		const round: Local.Round = event.roundsByIndex[roundIndex] = {
			index: roundIndex,
			matchIdsByIndex: [],
		};

		for (const name of participantsRemaining) {
			const matchIds = matchIdsByParticipantName[name];
			if (matchIds.size === 1) {
				const matchId = [...matchIds][0];
				roundIndexByMatchId[matchId] = roundIndex;
				matchIdsByIndex.add(matchId);
				participantsRemaining.delete(name);
			} else {
				for (const matchId of keysOf(roundIndexByMatchId)) {
					matchIds.delete(matchId);
				}
			}
		}

		round.matchIdsByIndex.push(...matchIdsByIndex);

		if (participantsRemaining.size === 0) {
			break;
		}

		roundIndex += 1;
	}

	for (let index = event.roundsByIndex.length - 2; index >= 0; index -= 1) {
		const round = event.roundsByIndex[index];
		const roundNext = event.roundsByIndex[index + 1];
		const nextMatchIndexByName = {} as Record<Local.Participant[`name`], number>;
		const nextMatchIndexByWinnerName = {} as Record<Local.Match[`winnerName`], number>;
		roundNext.matchIdsByIndex.forEach((matchId, matchIndex) => {
			const match = event.matchesById[matchId];

			nextMatchIndexByWinnerName[match.winnerName] = matchIndex;

			for (const name in match.timesByName) {
				nextMatchIndexByName[name] = matchIndex;
			}
		});

		round.matchIdsByIndex.sort(sortOn(matchId => {
			const match = event.matchesById[matchId];
			const name = match.winnerName;
			const matchNextIndex = nextMatchIndexByName[name];
			const matchNextId = roundNext.matchIdsByIndex[matchNextIndex];
			const matchNext = event.matchesById[matchNextId];
			return matchNextIndex - (matchNext.winnerName === name ? 0.1 : 0);
		}));
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
