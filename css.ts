import { execSync } from 'child_process';
import fs from 'fs';
import postcss from 'postcss';
import postcssNested from 'postcss-nested';

import styles from '@src/styles.css.ts';

const target = `./dist/styles.css`;

const unnested = await postcss([postcssNested]).process(styles, {
	from: undefined,
});
fs.writeFileSync(target, unnested.css);
execSync(`stylelint ${target} --fix`);
execSync(`stylelint ${target} --fix`); // Misses a few things the first time
