/* eslint no-console: 0, no-loop-func: 0*/
var t = require('../index')

t.skip('0. skipped test')

t('1. primitives - comparison', function() {
	t('==', 2, 2)
	t('!==', 3, 4)
	t('<', 1, 2)
	t('==', null, undefined)
	t('!=', undefined, 0)
	t('!==', 0, false)
	t('!', null)
	t('!!', 55)
})
t('2. object - comparison', function() {
	t('!{===}', [], 'str')
	t('!==', [], 2)
})
t('3. async', function(end) {
	setTimeout(end, 0)
	t('!==', 3, 4)
	t('!{==}', 3, 4)
})
t('4. more async', function(end) {
	setTimeout(end, 0)
	t('!==', 3, 4)
	t('!{==}', 3, 4)
})
t.skip('skip async', function(end) {
	setTimeout(end, 0)
	t('!==', 3, 4)
	t('!{==}', 3, 4)
})
t('skip assertions', function() {
	t.skip('!==', 3, 4)
	t('skip', 3, 4)
})
t('throws operator', function() {
	t('throws', function() { throw Error() })
	t('throws', function() { throw Error() }, 'should throw')
	t('throws', function() { throw Error() }, Error)
	t('throws', function() { throw Error() }, function() {return true}, 'should throw')
	t('throws', function() { throw Error('x') }, function(e) {return e.message === 'x'}, 'should throw')
})
