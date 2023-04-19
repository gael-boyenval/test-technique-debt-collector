import React from 'react';
import {Text} from 'ink';
import {readFileSync} from 'node:fs';
import { cwd } from 'node:process';
import path from 'node:path';

type Props = {
	string: string;
};

export default function App({string}: Props) {
	
	const filePath = path.resolve(cwd(), './example.tsx')
	const content = readFileSync(filePath, "utf8");
	const numberOccurences = (content.match(new RegExp(string, 'g')) || []).length;

	return (
		<Text color="green">
			"{string}" is found {numberOccurences} time(s) within the file
		</Text>
	);
}
