import { css } from '@robertakarobin/util/string/template.ts';

import { theme } from '@src/theme.ts';

export default css`
* {
	${theme.reset}
}

:root {
	${theme.types.body}
	${theme.varsDeclarations}
}

${theme.typeClasses}

body {
	color: #444444;
	padding: ${theme.vars.gap};
}

& .cell {
	box-sizing: border-box;
	min-height: 40px;
	min-width: 240px;
	padding: ${theme.vars.gap};
	width: 100%;
}

._event {
	& > ._head {
		font-weight: bold;
	}

	& ._rounds {
		box-sizing: border-box;
		column-gap: 40px;
		display: flex;
		overflow: auto;
		padding: calc(${theme.vars.gap} * 2) 0;
	}
}

._round {
	display: flex;
	flex-direction: column;
	row-gap: calc(2 * ${theme.vars.gap});

	& > ._head {
		align-items: center;
		background-color: #eeeeee;
		border-radius: 3px;
		display: flex;
		font-weight: bold;
		justify-content: center;
	}
}

._match {
	--headSize: 12px;

	border: 1px solid #cccccc;
	border-radius: 3px;
	position: relative;

	& > ._head,
	& > ._status {
		background: #ffffff;
		bottom: calc(100% - calc(var(--headSize) / 2));
		margin: 0 ${theme.vars.gap};
		padding: 1px 2px;
		position: absolute;

		&:empty {
			display: none;
		}
	}

	& > ._head {
		color: #666666;
		font-size: var(--headSize);
		left: 0;
		line-height: var(--headSize);
	}

	& > ._status {
		right: 0;
	}

	& .-winner {
		color: #008800;
	}

	& table {
		width: 100%;
	}

	& td,
	& th {
		padding: 2px 0;
		text-align: left;
		vertical-align: top;

		&.-numeric {
			text-align: right;
		}
	}
}
`;
