/* eslint eqeqeq: 0, no-console: 0*/
'use strict'

var assert = require('assert-op')

var tests = [],
		timeID = null,
		countT = {
			done: 0,
			skip: 0
		},
		countA = {
			pass: 0,
			fail: 0,
			skip: 0
		}

var flags = false,
		currentMode = init, // --> push --> test
		maxtime = 1000,
		active = {}

// color format and fixed text
var NORM = '\u001b[0m',
		RED = '\u001b[31m',
		RET = '\n',
		tab1 = '  ',
		tab2 = '    '

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
function init(flag, name, fcn, msg) {
	push(flag, name, fcn, msg)
	currentMode = push
	setTimeout(exec, 0)
}

/**
 * add every asserting function to the list of tests
 * @param {string} flag
 * @param {string} name test name
 * @param {Function} fcn test function
 * @param {string} [msg] message
 * @return {void}
 */
function push(flag, name, fcn, msg) {
	tests.push({
		head: tab1 + name + ' [',
		test: fcn,
		text: msg ? tab1 +msg + RET : '',
		flag: fcn ? flag : 'skip'
	})
	// if any test is flagged, non-flagged tests will be skipped
	if (!flags && flag === 'only') flags = true
}

/**
 * @param {string} flag
 * @param {string} op test operator
 * @param {*} val test value
 * @param {*} [ref] reference value
 * @param {*} [msg] message
 * @return {void}
 */
function test(flag, op, val, ref, msg) {
	if (flag === 'skip' || op === 'skip') {
		countA.skip++
		active.head += 's'
		return
	}
	try {
		assert(op, val, ref, msg)
		countA.pass++
		active.head += '.'
	} catch (e) {
		countA.fail++
		active.head += RED + 'x' + NORM
		//Error.captureStackTrace(e, coTest)
		formatErrorStack(e)
	}
}


var coTestRE = /coTest/,
		runNextRE = /runNext/
function formatErrorStack(e) {
	var lst = e.stack ? e.stack.split(/\n/) : [],
			start = 0,
			until = lst.length
	for (var i=0; i<until; ++i) {
		lst[i] = lst[i].trim()
		if (!start && coTestRE.test(lst[i])) start = i+1
		else if (start && runNextRE.test(lst[i])) until = i
	}
	lst = lst.slice(start, until)

	active.text += RET + RED + tab2 + e.message + NORM
	if (lst.length) active.text += RET + tab2 + lst.join('\n' + tab2) + RET
}

// close the assertion entries and perform pre-run ops
function exec() {
	currentMode = test
	console.log('\n\n=== coTest ===')
	setTimeout(runNext, 0)
}

// perform every tests
function runNext() {
	if (!tests.length) return done()
	active = tests.shift()
	// skipped test with 'false' flag ... if any test is flagged, ignore all unflagged tests
	if (active.flag === 'skip' || (flags && active.flag !== 'only')) {
		active.head += 'SKIP'
		countT.skip++
		log()
	}
	else if (!active.test.length) {
		active.test(log)
		countT.done++
		log()
	}
	else {
		timeID = setTimeout(timeoutFail, maxtime)
		active.test(timeoutPass)
	}
}

function timeoutFail() {
	timeID = null
	countA.fail++
	active.head += RED + 'T' + NORM
	log()
}
function timeoutPass() {
	if (timeID !== null) {
		clearTimeout(timeID)
		log()
	}
}


function log() {
	console.log(RET + active.head + ']')
	if (active.text) console.log(RED + active.text + NORM)
	setTimeout(runNext, 0)
}

function done() {
	var sum = countA.pass + countA.fail + countA.skip

	console.log('\n===',
		'END OF ' + countT.done + (countT.done > 1 ? ' TESTS' : ' TEST'),
		countT.skip ? '('+countT.skip+' skipped)' : '==='
	)

	console.log(tab1+'pass '+countA.pass+'/'+sum)
	countA.fail ? console.log(tab1 + RED + 'fail %d/%d'+NORM, countA.fail, sum) : console.log(tab1 + 'fail 0/%d', sum)
	if (countA.skip) console.log(tab1 + RED + 'skip %d/%d'+NORM, countA.skip, sum)
	if (countA.fail) throw ('FAILED')
}
