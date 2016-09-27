/* eslint eqeqeq: 0, no-console: 0*/
'use strict'
/**
 * Inpired and modified from https://www.npmjs.com/package/tt and https://www.npmjs.com/package/untap
 */
var assert = require('assert')

module.exports = miniTest

var tests = [],
		flags = [],
		active = {},
		pass = 0,
		fail = 0,
		currentMode = init,
		maxtime = 250
// color format
var NORM = '\u001b[0m',
		RED = '\u001b[31m'

var ops = {
	'{==}' :	function(v,r,m) { assert.deepEqual(v, r, v + ' {==} ' + r + m) },
	'{===}':	function(v,r,m) { assert.deepStrictEqual(v, r, v + ' {===} ' + r + m) },
	'!{==}':	function(v,r,m) { assert.notDeepEqual(v, r, v + ' !{==} ' + r + m) },
	'!{===}': function(v,r,m) { assert.notDeepStrictEqual(v, r, v + ' !{===} ' + r + m) },
	'=='	 :	function(v,r,m) { assert.equal(v, r, v + ' == ' + r + m) },
	'==='	:		function(v,r,m) { assert.strictEqual(v, r, v + ' === ' + r + m) },
	'!='	 :	function(v,r,m) { assert.notEqual(v, r, v + ' != ' + r + m) },
	'!=='	:		function(v,r,m) { assert.notStrictEqual(v, r, v + ' !== ' + r + m) },
	'>'		:		function(v,r,m) { assert.equal(v > r, true, v + ' > ' + r + m) },
	'>='	:		function(v,r,m) { assert.equal(v >= r, true, v + ' >= ' + r + m) },
	'<'		:		function(v,r,m) { assert.equal(v < r, true, v + ' < ' + r + m) },
	'<='	:		function(v,r,m) { assert.equal(v <= r, true, v + ' <= ' + r + m) },
	'!>'		:		function(v,r,m) { assert.equal(v > r, false, v + ' !> ' + r + m) },
	'!>='	:		function(v,r,m) { assert.equal(v >= r, false, v + ' !>= ' + r + m) },
	'!<'		:		function(v,r,m) { assert.equal(v < r, false, v + ' !< ' + r + m) },
	'!<='	:		function(v,r,m) { assert.equal(v <= r, false, v + ' !<= ' + r + m) },
}
/**
 * Single test function to either declare a test or an assertion
 * @param	{string} text - either the title of a test or the assertion type
 * @param	{?} fcnORval - either the test function or the value to assert
 * @param	{?} onlyORref - either exclusive test or the reference for an assertion
 * @param	{string} [msg] - message
 * @return {void}
 */
function miniTest(text, fcnORval, onlyORref, msg) {
	currentMode(text, fcnORval, onlyORref, msg)
}
miniTest.timeout = function(ms) {
	maxtime = ms
}
function init(name, fcn, only, msg) {
	push(name, fcn, only, msg)
	currentMode = push
	setTimeout(exec, 0)
}
function push(name, fcn, only, msg) {
	if (only && only.constructor === String) {
		msg = only
		only = false
	}
	tests.push({
		head: name + ' [',
		test: fcn,
		text: msg ? msg + '\n' : ''
	})
	if (only === true) flags.push(tests.length-1)
}
function test(op, val, ref, msg) {
	try {
		ops[op](val, ref, msg ? ', '+msg:'')
		pass++
		active.head += '.'
	} catch (e) {
		fail++
		active.head += RED + 'x' + NORM
		// ignore everything up to the run() function
		Error.captureStackTrace(e, miniTest)
		stack(e)
	}
}
function stack(e) {
	var lst = !e.stack ? [] : e.stack.split(/\n/).slice(0,-3).map(trim)
	if (lst.length && !e.message) e.message = lst[0]
	active.text += '\n ' + (lst.length ? lst.shift() : e.message)
	if (lst.length) {
		active.text += '\n ' + lst.join('\n ')
	}
}
function trim(str) {
	return str.trim()
}
function exec() {
	currentMode = test
	console.log('\n=== MINI TEST ===')
	if (flags.length) tests = flags.map(function(i) { return tests[i] })
	process.nextTick(run)
}
function run() {
	if (!tests.length) return done()
	active = tests.shift()
	if (!active.test.length) {
		active.test(log)
		log()
	}
	else {
		setTimeout(timeout, maxtime)
		active.test(log)
	}
}
function timeout() {
	fail++
	active.head += RED + 'T' + NORM
	log()
}
function log() {
	console.log('\n' + active.head + ']')
	if (active.text) console.log(RED + active.text + NORM)
	process.nextTick(run)
}
function done() {
	console.log('\n=== END ===')
	console.log(' pass %d/%d', pass, pass + fail)
	fail ? console.log(RED+' fail %d/%d'+NORM, fail, pass + fail) : console.log(' fail 0/%d', pass + fail)

	process.exit(fail)
}
