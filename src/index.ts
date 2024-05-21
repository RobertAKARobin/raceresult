import { html } from '@robertakarobin/util/string/template.ts';
import { sortOn } from '@robertakarobin/util/group/sortOn.ts';

// import { getEventById } from './api.ts';
// const event = await getEventById(`288014`, `65JG83PJ6CASC4MB89V133LGNSPSTW91`);

import { getEventMock } from '@src/api.ts';
const event = await getEventMock();

document.title = event.name;

const template = html`
<h1>${event.name}</h1>

${Object.values(event.roundsById).map(round => html`
	<div>
		<h2>Round ${round.id}</h2>

		${Object.values(event.matchesById)
			.filter(match => match.roundId === round.id)
			.sort(sortOn(match => match.id))
			.map(match => html`
				<div>
					<h3>Match ${match.id}</h2>

					<p>${match.status === `bye` ? `Bye` : ``}</p>

					<table>
						${Object.entries(match.timesByParticipantName).map(
							([participantName, time]) => html`
								<tr
									class="${participantName === match.winnerName ? `_win` : ``}"
								>
									<th>${participantName}</th>
									<td>${time ?? ``}</td>
								</tr>
							`
						)}
					</table>
				</div>
			`)
		}
	</div>
	`
)}
`;

document.body.innerHTML = template;
