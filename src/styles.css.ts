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
}

& .cell {
	box-sizing: border-box;
	min-height: 40px;
	min-width: 240px;
	padding: ${theme.vars.gap};
	width: 100%;
}

._event {
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	height: 100vh;
	margin: ${theme.vars.gap} 0;
	overflow: hidden;
	padding: 0 ${theme.vars.gap};
	width: 100vw;

	& > ._head {
		font-weight: bold;
	}

	& ._rounds {
		box-sizing: border-box;
		column-gap: 80px;
		display: grid;
		flex-grow: 1;
		grid-auto-columns: minmax(240px, 1fr);
		grid-auto-flow: column;
		margin: calc(${theme.vars.gap} * 2) 0;
		overflow: auto;

		& > * {
			height: 100%;
		}
	}
}

._round {
	& > ._head {
		align-items: center;
		background-color: #eeeeee;
		border-radius: 3px;
		display: flex;
		font-weight: bold;
		justify-content: center;
		margin-bottom: ${theme.vars.gap};
		position: sticky;
		top: 0;
		z-index: 1;
	}

	& ._matches {
		display: flex;
		flex-direction: column;
		height: 100%;
		justify-content: space-around;
		row-gap: ${theme.vars.gap};

		& > * {
			flex-grow: 0;
			flex-shrink: 0;
		}
	}
}

._match {
	--headSize: 12px;

	border: 1px solid #cccccc;
	border-radius: 3px;
	height: 70px;
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
