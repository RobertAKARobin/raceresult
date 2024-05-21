import { css, CssTheme } from '@robertakarobin/util/css/theme.ts';

export const val = {
	gap: `10px`,
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
