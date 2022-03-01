#!/usr/bin/env node
const fs = require('fs');
const pth = require('path');
const { ReadMultiFilesService } = require('./services/ReadMultiFilesService');
const { ProcessingService } = require('./services/ProcessingService');

const MULTI_FILE_READ_PATH = './services/multiFiles.txt';
const STDIN_READ_PATH = '/stdin.txt';

async function main() {
	const writeStream = fs.createWriteStream(pth.join(__dirname, STDIN_READ_PATH));
	const processingService = new ProcessingService();

	process.stdin.resume();
	process.stdin.setEncoding('utf-8');
	if (!process.stdin.isTTY) {
		process.stdin.pipe(writeStream).on('finish', () => {
			processingService.process(`${__dirname}${STDIN_READ_PATH}`);
		});
	} else {
		const listOfFiles = process.argv.slice(2);
		const fileData = new ReadMultiFilesService(listOfFiles);
		await fileData.read();
		processingService.process(pth.join(__dirname, MULTI_FILE_READ_PATH));
	}
}

main();
