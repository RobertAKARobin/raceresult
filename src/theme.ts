import { css, CssTheme } from '@robertakarobin/util/css/theme.ts';

export const val = {
	color_border: `#bbbbbb`,
	gap_column: `50px`,
	margin: `10px`,
	width_column: `300px`,
};

export const types = {
	body: css`
		font-family: 'Tahoma', sans-serif;
		font-size: 16px;
	`,
};

export const theme = new CssTheme({
	types,
	val,
});
