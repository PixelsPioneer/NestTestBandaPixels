/** @type {import('eslint').Linter.Config} */
const path = require('path');

module.exports = {
	extends: [
		'plugin:@tanstack/query/recommended',
		'plugin:prettier/recommended',
		'plugin:tailwindcss/recommended',
	],
	settings: {
		tailwindcss: {
			callees: ['classnames', 'clsx', 'ctl', 'cn'],
			config: path.join(__dirname, './tailwind.config.ts'),
		},
	},
	rules: {
		'tailwindcss/no-custom-classname': [
			'warn',
			{
				whitelist: ['bg-dark-300'],
			},
		],
	},
};
