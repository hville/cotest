var assert = require('assert-op'),
		report = require('./report')

var tests = [],
		index = -1,
		timeID = null

var currentMode = initMode, // --> push --> test
		maxtime = 1000

module.exports = coTest

/**
 * Single test function to either declare a test or an assertion
 * @param {string} text test name or operator
 * @param {*} [fcnORval] test function or test value
 * @param {*} [onlyORref] message or only flag
 * @param {*} [msg] message
 * @return {void}
 */
function coTest(text, fcnORval, onlyORref, msg) {
	//@ts-ignore
	currentMode('', text, fcnORval, onlyORref, msg)
}
coTest.timeout = function(ms) {
	maxtime = ms
}
coTest.reporter = report
/**
 * @param {string} text test name or operator
 * @param {*} fcnORval test function or test value
 * @param {*} [msgORref] message or only flag
 * @param {string} [msg] message
 * @return {void}
 */
coTest.skip = function skip(text, fcnORval, msgORref, msg) {
	//@ts-ignore
	currentMode('skip', text, fcnORval, msgORref, msg)
}
/**
 * @param {string} text test name or operator
 * @param {*} fcnORval test function or test value
 * @param {*} [msgORref] message or only flag
 * @param {string} [msg] message
 * @return {void}
 */
coTest.only = function only(text, fcnORval, msgORref, msg) {
	//@ts-ignore
	currentMode('only', text, fcnORval, msgORref, msg)
}

/**
 * @param {string} flag
 * @param {string} name test name
 * @param {*} fcn test function
 * @param {string} [msg] message
 * @return {void}
 */
function initMode(flag, name, fcn, msg) {
	pushMode(flag, name, fcn, msg)
	currentMode = pushMode
	setTimeout(exec, 0)
}

/**
 * add every asserting function to the list of tests
 * @param {string} flag
 * @param {string} name
 * @param {Function} test
 * @param {string} [note]
 * @return {void}
 */
function pushMode(flag, name, test, note) {
	tests.push({
		name: name,
		test: test,
		note: note || '',
		flag: test ? flag : 'skip',
		errs: []
	})
}

/**
 * @param {string} flag
 * @param {string} op
 * @param {*} val
 * @param {*} [ref]
 * @param {*} [msg]
 * @return {void}
 */
function testMode(flag, op, val, ref, msg) {
	if (flag === 'skip' || op === 'skip') return tests[index].errs.push('skip')
	try {
		assert(op, val, ref, msg)
		tests[index].errs.push('')
	} catch (err) {
		tests[index].errs.push(err.stack || err.message) //TODO Error.captureStackTrace(e, coTest)
	}
}

// close the assertion entries and perform pre-run ops
function isOnly(t) {
	return t.flag === 'only'
}
function deRank(t) {
	if (t.flag === 'only') t.flag = ''
	else t.flag = 'skip'
}
function exec() {
	currentMode = testMode
	if (tests.some(isOnly)) tests.forEach(deRank)
	setTimeout(runNext, 0)
}

// perform every tests
function runNext() {
	if (++index === tests.length) return coTest.reporter(tests)

	// skipped test with 'false' flag ... if any test is flagged, ignore all unflagged tests
	if (tests[index].flag === 'skip') return runNext()

	//sync test
	if (!tests[index].test.length) {
		tests[index].test()
		return runNext()
	}
	//async test
	timeID = setTimeout(endAsyncTest, maxtime, 'timeout')
	tests[index].test(endAsyncTest)
}

function endAsyncTest() {
	if (timeID !== null) {
		clearTimeout(timeID)
		timeID = null
		runNext()
	}
}
