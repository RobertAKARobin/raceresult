import { html } from '@robertakarobin/util/string/template.ts';
import { sortOn } from '@robertakarobin/util/group/sortOn.ts';
import { tryCatch } from '@robertakarobin/util/tryCatch.ts';

import type * as Local from '@src/types.d.ts';
import { getEventByUrl } from '@src/api.ts';

const querystring = new URLSearchParams(window.location.search);
if (querystring.has(`url`) === false) {
	throw new Error(`No URL provided`);
}

const url = querystring.get(`url`) as string;

const inputEl = document.getElementById(`input`) as HTMLInputElement;
const submitEl = document.getElementById(`submit`) as HTMLButtonElement;
inputEl.value = url;
inputEl.disabled = true;
submitEl.disabled = true;

const event = await tryCatch(async() => await getEventByUrl(url));
if (event instanceof Error) {
	const error = event;
	const errorsEl = document.getElementById(`errors`)!;

	let message = ``;
	if (error instanceof SyntaxError) {
		message = `That URL didn't seem to work.${url}`;
	} else if (error instanceof TypeError) {
		inputEl.value = url;
		message = `You're sending too many requests to RaceResult.\nWait a second, then try again.`;
	} else {
		message = `Error: ${error.message}`;
	}

	errorsEl.innerHTML = message;

	inputEl.disabled = false;
	submitEl.disabled = false;

	throw error;
}

document.title = event.name;

const Match = (match: Local.Match) => html`
<div class="cell _matchWrap">
	<div class="_match">
		<h3 class="_head">M ${match.id}</h3>

		<table>
			${Object.entries(match.timesByName)
				.sort(sortOn(([_nil, time]) => time))
				.map(
					([name, time]) => {
						const participant = event.participantsByName[name];
						return html`
							<tr
								class="_participant ${name === match.winnerName ? `-winner` : ``} ${time === `bye` ? `-bye` : ``}"
							>
								<td class="_bib">#${match.bibIdsByName[name]}</td>
								<td class="_name">${participant.name}</td>
								<td class="numeric _time">${time ?? ``}</td>
							</tr>
						`;
					}
				)}
		</table>
	</div>
</div>
`;

const Event = (event: Local.Event) => html`
<div class="_event">
	<header class="_head">
		<h1 class="_title">${event.name}</h1>

		<a href="/" target="_top">Clear</a>

		<a href="${url}" target="_blank">Data source</a>
	</header>

	<div class="_rounds">
		${event.roundsByIndex.map(round => html`
			<div class="_round">
				<h2 class="cell _head">Round ${round.index + 1}</h2>

				<div class="_matches">
					${[...round.matchIdsByIndex].map(matchId => {
						const match = event.matchesById[matchId];
						return Match(match);
					})}
				</div>
			</div>
		`)}
	</div>
</div>
`;

document.body.innerHTML = Event(event);
