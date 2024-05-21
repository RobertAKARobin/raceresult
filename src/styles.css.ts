import { css } from '@robertakarobin/util/string/template.ts';

import { theme } from '@src/theme.ts';

export default css`
* {
	${theme.reset}
}

:root {
	${theme.types.body}
}

${theme.typeClasses}

`;
