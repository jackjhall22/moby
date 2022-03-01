const { exec } = require('child_process');

// beforeEach(async () => {
// 	await execute();
// });

test('stdin', () => {});

function execute() {
	exec('../main/index.js resources/text2.js', (err, stdout, stderr) => {
		if (err) {
			//some err occurred
			console.error(err);
		} else {
			// the *entire* stdout and stderr (buffered)
			console.log(`stdout: ${stdout}`);
			console.log(`stderr: ${stderr}`);
		}
	});
}
