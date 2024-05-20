import { getEventById } from './api.ts';

const result = await getEventById(`288014`, `65JG83PJ6CASC4MB89V133LGNSPSTW91`);

console.log(JSON.stringify(result, null, `\t`));
