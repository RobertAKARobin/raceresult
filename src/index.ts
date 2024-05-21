import { capitalize } from '@robertakarobin/util/string/capitalize.ts';
import { html } from '@robertakarobin/util/string/template.ts';
import { sortOn } from '@robertakarobin/util/group/sortOn.ts';

// import { getEventById } from './api.ts';
// const event = await getEventById(`288014`, `65JG83PJ6CASC4MB89V133LGNSPSTW91`);

import type * as Local from '@src/types.d.ts';
import { getEventMock } from '@src/api.ts';
const event = await getEventMock();

document.title = event.name;

const Match = (match: Local.Match) => html`
<div class="cell _matchWrap">
	<div class="_match">
		<h3 class="_head">M ${match.id}</h3>

		<table>
			${Object.entries(match.timesByBibId)
				.sort(sortOn(([_nil, time]) => time))
				.map(
					([bibId, time]) => {
						const entrant = event.participantsByBibId[bibId];
						return html`
							<tr
								class="_participant ${bibId === match.winnerBibId ? `-winner` : ``} ${time === `bye` ? `-bye` : ``}"
							>
								<td class="_bib">#${entrant.bibId}</td>
								<td class="_name">
									${entrant.nameFirst}
									${capitalize(entrant.nameLast)}
								</td>
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
	<h1 class="_head">${event.name}</h1>

	<div class="_rounds">
		${Object.values(event.roundsById).map(round => html`
			<div class="_round">
				<h2 class="cell _head">Round ${round.id}</h2>

				<div class="_matches">
					${Object.values(event.matchesById)
						.filter(match => match.roundId === round.id)
						.sort(sortOn(match => match.id))
						.map(Match)
					}
				</div>
			</div>
			`
		)}
	</div>
</div>
`;

document.body.innerHTML = Event(event);
