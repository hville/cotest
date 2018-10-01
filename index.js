var assert = require('assert-op'),
		report = require('./report')

var tests = [],
		index = -1,
		timeID = null

var maxtime = 1000,
		timeout = null

module.exports = coTest

/**
 * @param {string} name
 * @param {*} [fcn]
 * @return {void}
 */
function coTest(name, fcn) {
	pushTest('', name, fcn)
}
coTest.skip = pushTest.bind(null, 'skip')
coTest.only = pushTest.bind(null, 'only')
coTest.reporter = report
coTest.timeout = function(ms) {
	maxtime = ms
}

/**
 * add every asserting function to the list of tests
 * @param {string} flag
 * @param {string} name
 * @param {Function} test
 * @param {string} [note]
 * @return {void}
 */
function pushTest(flag, name, test, note) {
	if (!timeout) timeout = setTimeout(exec, 0)
	tests.push({
		name: name,
		test: test,
		note: note || '',
		flag: test ? flag : 'skip',
		errs: []
	})
}

/**
 * @param {string} op
 * @param {*} val
 * @param {*} [ref]
 * @param {*} [msg]
 * @return {void}
 */
function asserter(op, val, ref, msg) {
	if (op === 'skip') return tests[index].errs.push('skip')
	try {
		assert(op, val, ref, msg)
		tests[index].errs.push('')
	} catch (err) {
		tests[index].errs.push(err.stack || err.message) //TODO Error.captureStackTrace(e, coTest)
	}
}
asserter.skip = function() {
	return tests[index].errs.push('skip')
}


// close the assertion entries and perform pre-run ops
function exec() {
	if (tests.some(isOnly)) tests.forEach(deRank)
	setTimeout(runNext, 0)
}
function isOnly(t) {
	return t.flag === 'only'
}
function deRank(t) {
	if (t.flag === 'only') t.flag = ''
	else t.flag = 'skip'
}

// perform every tests
function runNext() {
	if (++index === tests.length) return coTest.reporter(tests)

	// skipped test with 'false' flag ... if any test is flagged, ignore all unflagged tests
	if (tests[index].flag === 'skip') return runNext()

	//sync test
	if (tests[index].test.length < 2) {
		tests[index].test(asserter)
		return runNext()
	}
	//async test
	timeID = setTimeout(endAsyncTest, maxtime, 'timeout')
	tests[index].test(asserter, endAsyncTest)
}

function endAsyncTest(errorMessage) {
	if (timeID !== null) {
		clearTimeout(timeID)
		timeID = null
		if (errorMessage) tests[index].errs.push(errorMessage)
		runNext()
	}
}
