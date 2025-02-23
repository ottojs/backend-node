import _import from 'eslint-plugin-import';
import jest from 'eslint-plugin-jest';
import node from 'eslint-plugin-node';
import promise from 'eslint-plugin-promise';
import unusedImports from 'eslint-plugin-unused-imports';
import { fixupPluginRules } from '@eslint/compat';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default [
	{
		ignores: ['**/coverage', '**/node_modules'],
	},
	...compat.extends('eslint:recommended'),
	{
		plugins: {
			import: fixupPluginRules(_import),
			jest,
			node,
			promise,
			'unused-imports': unusedImports,
		},

		languageOptions: {
			globals: {
				...Object.fromEntries(
					Object.entries(globals.browser).map(([key]) => [key, 'off'])
				),
				...globals.node,
				...globals.jest,
			},

			ecmaVersion: 'latest',
			sourceType: 'module',
		},

		rules: {
			camelcase: 0,
			curly: 2,
			eqeqeq: 2,
			'func-call-spacing': 0,
			'guard-for-in': 2,

			indent: [
				'error',
				'tab',
				{
					SwitchCase: 1,
				},
			],

			'key-spacing': 0,

			'max-depth': [
				'error',
				{
					max: 5,
				},
			],

			'no-irregular-whitespace': 2,
			'no-multi-spaces': 0,
			'padded-blocks': 0,

			quotes: [
				'error',
				'single',
				{
					allowTemplateLiterals: true,
				},
			],

			semi: 0,
			'no-path-concat': 1,
			'no-undef': 2,
			'unused-imports/no-unused-imports': 'error',
			'no-unused-vars': 2,
			'no-var': 1,
		},
	},
];
