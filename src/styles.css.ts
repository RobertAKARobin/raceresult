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

a {
	color: blue;
	text-decoration: underline;
}

body {
	color: #444444;
}

button,
input {
	border-radius: 4px;
	box-sizing: border-box;
	height: 50px;
}

button {
	align-items: center;
	cursor: pointer;
	display: inline-flex;
	justify-content: center;
	line-height: 1.2rem;
	padding: 0 2rem;
	transition: background-color 0.2s;

	&:disabled {
		cursor: default;
	}
}

input {
	border: 1px solid #cccccc;
	border-radius: 4px;
	line-height: 50px;
	padding: 0 1rem;
}

td,
th {
	&.numeric {
		text-align: right !important;
	}
}

._splash {
	align-items: center;
	box-sizing: border-box;
	display: flex;
	height: 100vh;
	justify-content: center;
	min-height: 400px;
	min-width: 320px;
	padding: 40px;
	text-align: center;
	width: 100%;

	& form {
		align-items: center;
		display: flex;
		flex-direction: column;
		max-width: 600px;
		row-gap: ${theme.vars.margin};
		width: 100%;

		& button {
			background-color: #0055ff;
			color: #ffffff;

			&:disabled {
				background-color: #555555;
				font-size: 0;

				&:after {
					content: 'Loading...';
					font-size: 1rem;
				}
			}
		}

		& input {
			text-align: center;
			width: 100%;
		}

		& ._errors {
			color: red;
			white-space: pre-wrap;

			&:empty {
				display: none;
			}
		}
	}

	& h1 {
		font-weight: bold;
	}
}

._event {
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	height: 100vh;
	overflow: hidden;
	padding: ${theme.vars.margin};
	width: 100vw;

	& > ._head {
		column-gap: calc(2 * ${theme.vars.margin});
		display: flex;
		margin-bottom: ${theme.vars.margin};

		& ._title {
			font-weight: bold;
		}
	}

	& ._rounds {
		box-sizing: border-box;
		column-gap: ${theme.vars.gap_column};
		display: grid;
		flex-grow: 1;
		grid-auto-flow: column;
		grid-template-columns: repeat(auto-fill, ${theme.vars.width_column});
		overflow: auto;

		& > * {
			width: ${theme.vars.width_column};
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
		margin-bottom: ${theme.vars.margin};
		position: sticky;
		top: 0;
		z-index: 1;
	}

	& ._matches {
		display: flex;
		flex-direction: column;
		flex-grow: 1;

		& > * {
			flex-grow: 1;
			flex-shrink: 0;
		}
	}

	&:first-of-type ._matchWrap:before,
	&:last-of-type ._matchWrap:after {
		display: none;
	}
}

._matchWrap {
	display: flex;
	flex-direction: column;
	justify-content: center;
	position: relative;

	&:before {
		border-top: 1px solid ${theme.vars.color_border};
		content: '';
		height: 0;
		position: absolute;
		right: 100%;
		top: 50%;
		width: calc(${theme.vars.gap_column} / 2);
	}

	&:after {
		border: 1px solid ${theme.vars.color_border};
		border-bottom-color: transparent;
		border-left-color: transparent;
		border-top-right-radius: calc(${theme.vars.gap_column} / 2);
		box-sizing: border-box;
		content: '';
		height: 50%;
		left: 100%;
		position: absolute;
		width: calc(${theme.vars.gap_column} / 2);
	}

	&:nth-child(odd):after {
		top: 50%;
	}

	&:nth-child(even):after {
		bottom: 50%;
		transform: scale(1, -1);
	}
}

._match {
	--headSize: 12px;

	border: 1px solid ${theme.vars.color_border};
	border-radius: 3px;
	box-sizing: border-box;
	height: 70px;
	margin: calc(${theme.vars.margin} / 2) 0;
	padding: ${theme.vars.margin};
	position: relative;

	& > ._head,
	& > ._status {
		background: #ffffff;
		bottom: calc(100% - calc(var(--headSize) / 2));
		margin: 0 ${theme.vars.margin};
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
