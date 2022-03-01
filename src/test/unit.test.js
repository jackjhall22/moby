const { createList, printText, processText } = require('../main/services/ProcessingService');

const processedText = { 'Hello New Relic': 1, 'Greetings Jack Hall': 3 };

test('process text', () => {
	const words = [ 'one', 'two', 'three', 'one', 'two', 'three', 'one', 'two', 'four' ];
	const moreWords = [];
	const evenMoreWords = [];

	expect(processText(words, moreWords, evenMoreWords)).toHaveProperty('one two three', 2);
	expect(processText(words, moreWords, evenMoreWords)).toHaveProperty('two three one', 2);
	expect(processText(words, moreWords, evenMoreWords)).toHaveProperty('three one two', 2);
	expect(processText(words, moreWords, evenMoreWords)).toHaveProperty('one two four', 1);
});

test('print processed text', () => {
	const sortedList = createList(processedText);
	const expected = printText(sortedList);
	expect(expected).toMatch(`1) Greetings Jack Hall - 3\n2) Hello New Relic - 1`);
});
