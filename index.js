/* eslint eqeqeq: 0, no-console: 0*/
'use strict'

var assert = require('assert')

module.exports = miniTest

var tests = [],
		active = {},
		pass = 0,
		fail = 0,
		currentMode = init
// color format
var NORM = '\u001b[0m',
		RED = '\u001b[31m'

var ops = {
	'{==}' :	function(v,r) { assert.deepEqual(v, r, v + ' {==} ' + r) },
	'{===}':	function(v,r) { assert.deepStrictEqual(v, r, v + ' {===} ' + r) },
	'!{==}':	function(v,r) { assert.notDeepEqual(v, r, v + ' !{==} ' + r) },
	'!{===}': function(v,r) { assert.notDeepStrictEqual(v, r, v + ' !{===} ' + r) },
	'=='	 :	function(v,r) { assert.equal(v, r, v + ' == ' + r) },
	'==='	:		function(v,r) { assert.strictEqual(v, r, v + ' === ' + r) },
	'!='	 :	function(v,r) { assert.notEqual(v, r, v + ' != ' + r) },
	'!=='	:		function(v,r) { assert.notStrictEqual(v, r, v + ' !== ' + r) },
	'>'		:		function(v,r) { assert.equal(v > r, true, v + ' > ' + r) },
	'>='	:		function(v,r) { assert.equal(v >= r, true, v + ' >= ' + r) },
	'<'		:		function(v,r) { assert.equal(v < r, true, v + ' < ' + r) },
	'<='	:		function(v,r) { assert.equal(v <= r, true, v + ' <= ' + r) },
	'!>'		:		function(v,r) { assert.equal(v > r, false, v + ' !> ' + r) },
	'!>='	:		function(v,r) { assert.equal(v >= r, false, v + ' !>= ' + r) },
	'!<'		:		function(v,r) { assert.equal(v < r, false, v + ' !< ' + r) },
	'!<='	:		function(v,r) { assert.equal(v <= r, false, v + ' !<= ' + r) },
}

function miniTest(text, valORfcn, ref) {
	currentMode(text, valORfcn, ref)
}
function init(name, fcn) {
	push(name, fcn)
	currentMode = push
	setTimeout(exec, 0)
}
function push(name, fcn) {
	tests.push({
		head: name + ' [',
		test: fcn,
		text: ''
	})
}
function test(op, val, ref) {
	try {
		ops[op](val, ref)
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
	process.nextTick(run)
}
function run() {
	if (!tests.length) return done()
	active = tests.shift()
	active.test(log)
	if (!active.test.length) log()
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
