/* eslint no-console: 0*/

module.exports = function report(tests) {
	var passCount = 0,
			failCount = 0,
			skipCount = 0

	console.log('\n\n=== coTest ===')
	for (var i=0; i<tests.length; ++i) {
		var test = tests[i],
				head = '  ' + test.name + ' [',
				note = test.note
		for (var j=0; j<test.errs.length; ++j) {
			switch (test.errs[j]) {
				case '': ++passCount; head += '.'; break
				case 'skip': ++skipCount; head += alert('s'); break
				case 'timeout': ++failCount; head += alert('T'); break
				default:
					++failCount
					head += alert('x')
					note += '\n    ' + formatErrorStack(test.errs[j])
			}
		}
		if (test.flag) {
			++skipCount
			head += alert('SKIP')
		}
		console.log('\n' + head + ']')
		if (note) console.log('  '+alert(note))
	}
	var fullCount = passCount + skipCount + failCount
	console.log('\n===', 'END OF TESTS')
	console.log('  pass '+passCount+'/'+fullCount)
	console.log(skipCount ? alert('  skip %d/%d') : '  skip %d/%d', skipCount, fullCount)
	console.log(failCount ? alert('  fail %d/%d') : '  fail %d/%d', failCount, fullCount)
	if (failCount) throw ('FAILED TESTS')
}

function alert(t) {
	return '\u001b[31m' + t + '\u001b[0m'
}

function formatErrorStack(errorStack) { //TODO move part to main (depends on internals)
	var lst = errorStack.split(/\n/),
			start = 1
	for (var i=1; i<lst.length; ++i) {
		lst[i] = lst[i].trim()
		if (/asserter/.test(lst[i])) start = i+1 //TODO CHANGENAME
		else if (start && /runNext/.test(lst[i])) break //TODO CHANGENAME
	}
	return lst[0] + '\n    ' + lst.slice(start, i).join('\n    ')
}
