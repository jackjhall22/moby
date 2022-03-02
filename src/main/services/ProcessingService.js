const fs = require('fs');
const es = require('event-stream');

class ProcessingService {
	inputString = '';
	result = {};
	constructor() {}
	process(readPath) {
		let totalLines = 0;
		let words = [];
		let moreWords = [];
		let evenMoreWords = [];
		fs.createReadStream(readPath).pipe(es.split()).pipe(
			es
				.mapSync((line) => {
					totalLines++;

					if (totalLines < 90000) {
						words.push(line);
					} else if (totalLines >= 90000 && totalLines < 180000) {
						moreWords.push(line);
					} else {
						evenMoreWords.push(line);
					}
				})
				.on('error', (e) => {
					console.log('Error while reading file' + e);
					process.exit(1);
				})
				.on('end', () => {
					console.log('Read Complete');
					console.log(totalLines);
					const processed = processText(words, moreWords, evenMoreWords);
					const sorted = createList(processed);
					printText(sorted);
					process.exit(1);
				})
		);
	}

	print(processedText) {
		const sortedList = createList(processedText);
		const output = printText(sortedList);
		console.log(output);
		return output;
	}
}

function printText(processedText) {
	const length = processedText.length < 100 ? processedText.length : 100;
	let string = '';
	for (let i = 0; i < length; i++) {
		string += i + 1 + ') ' + processedText[i][0] + ' - ' + processedText[i][1] + '\n';
	}
	console.log(string);
	return string; // for testing
}

function createList(obj) {
	let entries = Object.entries(obj);
	let sorted = entries.sort((a, b) => b[1] - a[1]);
	return sorted;
}

function processText(lines, moreLines, evenMoreLines) {
	let result = {};
	const words = massageTheLineData(lines);
	for (let i = 0; i < words.length; i++) {
		if (words[i + 2] !== undefined) {
			let key = words[i] + ' ' + words[i + 1] + ' ' + words[i + 2];
			result[key] = result[key] ? result[key] + 1 : 1;
		}
	}
	if (moreLines.length) {
		const moreWords = massageTheLineData(moreLines);
		for (let i = 0; i < moreWords.length; i++) {
			if (moreWords[i + 2] !== undefined) {
				let key = moreWords[i] + ' ' + moreWords[i + 1] + ' ' + moreWords[i + 2];
				result[key] = result[key] ? result[key] + 1 : 1;
			}
		}
	}
	if (evenMoreLines.length) {
		console.log(evenMoreLines.length);
		const evenMoreWords = massageTheLineData(evenMoreLines);
		for (let i = 0; i < evenMoreWords.length; i++) {
			if (evenMoreWords[i + 2] !== undefined) {
				let key = evenMoreWords[i] + ' ' + evenMoreWords[i + 1] + ' ' + evenMoreWords[i + 2];
				result[key] = result[key] ? result[key] + 1 : 1;
			}
		}
	}
	return result;
}

function massageTheLineData(lines) {
	return lines
		.filter((n) => n)
		.map((line) => {
			return line
				.trim()
				.toLowerCase()
				.replace(/ '/g, "'") // possesive comma
				.replace(/[.,\/#!$%@\^&\*;:{}=\_`~()?"-]/g, '') // punctuation
				.replace(/[0-9]/g, '')
				.replace(/ ' /g, '') // apostrophes
				.replace(/' /g, '') // apostrophes
				.split(' ');
		})
		.flat()
		.filter((n) => n);
}

module.exports = {
	ProcessingService,
	createList,
	printText,
	processText
};
