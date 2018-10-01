/* eslint no-console: 0, no-loop-func: 0*/
var ct = require('../index')

ct.skip('0. skipped test')

ct('1. primitives - comparison', function(t) {
	t('==', 2, 2)
	t('!==', 3, 4)
	t('<', 1, 2)
	t('==', null, undefined)
	t('!=', undefined, 0)
	t('!==', 0, false)
	t('!', null)
	t('!!', 55)
})
ct('2. object - comparison', function(t) {
	t('!{===}', [], 'str')
	t('!==', [], 2)
})
ct('3. async', function(t, end) {
	setTimeout(end, 0)
	t('!==', 3, 4)
	t('!{==}', 3, 4)
})
ct('4. more async', function(t, end) {
	setTimeout(end, 0)
	t('!==', 3, 4)
	t('!{==}', 3, 4)
})
ct.skip('skip async', function(t, end) {
	setTimeout(end, 0)
	t('!==', 3, 4)
	t('!{==}', 3, 4)
})
ct('skip assertions', function(t) {
	t.skip('!==', 3, 4)
	t('skip', 3, 4)
})
ct('throws operator', function(t) {
	t('throws', function() { throw Error() })
	t('throws', function() { throw Error() }, 'should throw')
	t('throws', function() { throw Error() }, Error)
	t('throws', function() { throw Error() }, function() {return true}, 'should throw')
	t('throws', function() { throw Error('x') }, function(e) {return e.message === 'x'}, 'should throw')
})
