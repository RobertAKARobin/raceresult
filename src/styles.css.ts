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

td,
th {
	&.numeric {
		text-align: right !important;
	}
}

._event {
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	height: 100vh;
	overflow: hidden;
	padding: ${theme.vars.gap};
	width: 100vw;

	& > ._head {
		font-weight: bold;
		margin-bottom: ${theme.vars.gap};
	}

	& ._rounds {
		--columnWidth: 300px;

		box-sizing: border-box;
		column-gap: 50px;
		display: grid;
		flex-grow: 1;
		grid-auto-flow: column;
		grid-template-columns: repeat(auto-fill, var(--columnWidth));
		overflow: auto;

		& > * {
			width: var(--columnWidth);
		}
	}
}

._round {
	display: flex;
	flex-direction: column;
	position: relative;

	& > ._head {
		align-items: center;
		background-color: #eeeeee;
		border-radius: 3px;
		display: flex;
		font-weight: bold;
		height: 40px;
		justify-content: center;
		margin-bottom: ${theme.vars.gap};
		position: sticky;
		top: 0;
		z-index: 1;
	}

	& ._matches {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		row-gap: ${theme.vars.gap};

		& > * {
			display: flex;
			flex-direction: column;
			flex-grow: 1;
			flex-shrink: 0;
			justify-content: center;
		}
	}
}

._match {
	--headSize: 12px;

	border: 1px solid #cccccc;
	border-radius: 3px;
	box-sizing: border-box;
	height: 70px;
	padding: ${theme.vars.gap};
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

	& ._bib {
		width: 60px;
	}

	& ._name {
		max-width: 0px; /* Makes ellipsis play nice */
		overflow: hidden;
		text-overflow: ellipsis;
	}

	& ._time {
		width: 60px;
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
		white-space: nowrap;
	}
}
`;
