var assert = require('assert-op'),
		report = require('./report')

var timeout = null,
		timeID = null,
		tests = [],
		index = -1

var cotest = module.exports = pushTest.bind(null, '')
cotest.skip = pushTest.bind(null, 'skip')
cotest.only = pushTest.bind(null, 'only')
cotest.reporter = report
cotest.timeout = 1000

/**
 * add every asserting function to the list of tests
 * @param {string} flag
 * @param {string} name
 * @param {Function} [test]
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
	if (++index === tests.length) return cotest.reporter(tests)

	// skipped test with 'false' flag ... if any test is flagged, ignore all unflagged tests
	if (tests[index].flag === 'skip') return setTimeout(runNext, 0)

	//sync test
	if (tests[index].test.length < 2) {
		tests[index].test(asserter)
		return setTimeout(runNext, 0)
	}
	//async test
	timeID = setTimeout(endAsyncTest, cotest.timeout, 'timeout')
	tests[index].test(asserter, endAsyncTest)
}

function endAsyncTest(errorMessage) {
	if (timeID !== null) {
		clearTimeout(timeID)
		timeID = null
		if (errorMessage) tests[index].errs.push(errorMessage)
		setTimeout(runNext, 0)
	}
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
		tests[index].errs.push(err.stack ? trimStack(err.stack) : err.message) //TODO Error.captureStackTrace(e, coTest)
	}
}
asserter.skip = function() {
	return tests[index].errs.push('skip')
}

function trimStack(errorStack) {
	var lst = errorStack.split(/\n/),
			start = 1

	for (var i=0; i<lst.length; ++i) {
		lst[i] = lst[i].trim()
		if (/asserter/.test(lst[i])) start = i+1
		else if (/runNext/.test(lst[i])) break
	}
	return [].concat(lst[0], lst.slice(start, i)).join('\n')
}
