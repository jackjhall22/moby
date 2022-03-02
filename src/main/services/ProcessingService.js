const fs = require('fs');
const es = require('event-stream');

class ProcessingService {
	inputString = '';
	result = {};
	constructor() {}
	process(readPath) {
		let totalLines = 0;
		let lines = [];
		let moreLines = [];
		let evenMoreLines = [];
		fs.createReadStream(readPath).pipe(es.split()).pipe(
			es
				.mapSync((line) => {
					totalLines++;

					// Pushing to overcome heap out of memory failure, not ideal
					if (totalLines < 90000) {
						lines.push(line);
					} else if (totalLines >= 90000 && totalLines < 180000) {
						moreLines.push(line);
					} else {
						evenMoreLines.push(line);
					}
				})
				.on('error', (e) => {
					console.log('Error while reading file' + e);
					process.exit(1);
				})
				.on('end', () => {
					console.log('Read Complete');
					console.log(`total lines: ${totalLines}`);
					const processed = processText(lines, moreLines, evenMoreLines);
					const sorted = createList(processed);
					printText(sorted);
					process.exit(1);
				})
		);
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
	result = buildCommonWordsCountMap(words, result);

	if (moreLines.length) {
		const moreWords = massageTheLineData(moreLines);
		result = buildCommonWordsCountMap(moreWords, result);
	}

	if (evenMoreLines.length) {
		const evenMoreWords = massageTheLineData(evenMoreLines);
		result = buildCommonWordsCountMap(evenMoreWords, result);
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
				.replace(/[0-9]/g, '') // numbers
				.replace(/ ' /g, '') // apostrophes
				.replace(/' /g, '') // apostrophes
				.split(' ');
		})
		.flat()
		.filter((n) => n);
}

function buildCommonWordsCountMap(arrayOfWords, accumlator) {
	const result = Object.assign({}, accumlator);
	const words = massageTheLineData(arrayOfWords);
	for (let i = 0; i < words.length; i++) {
		if (words[i + 2] !== undefined) {
			let key = words[i] + ' ' + words[i + 1] + ' ' + words[i + 2];
			result[key] = result[key] ? result[key] + 1 : 1;
		}
	}
	return result;
}

module.exports = {
	ProcessingService,
	createList,
	printText,
	processText
};
