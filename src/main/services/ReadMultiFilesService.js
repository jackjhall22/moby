const fs = require('fs');
const multi = require('multistream');
const pth = require('path');

class ReadMultiFilesService {
	constructor(files) {
		this.files = files;
		this.inputString = '';
	}

	read() {
		return new Promise((resolve, reject) => {
			const streams = this.files.map((file) =>
				fs.createReadStream(file).on('error', (e) => {
					console.log('Error when reading', e);
				})
			);
			const writeStream = fs.createWriteStream(pth.join(__dirname, 'multiFiles.txt'));

			new multi(streams)
				.pipe(writeStream)
				.on('error', (e) => {
					console.log('Error when writing', e);
				})
				.on('finish', resolve);
		});
	}
}

module.exports = {
	ReadMultiFilesService
};
