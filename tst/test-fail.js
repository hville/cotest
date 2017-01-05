/* eslint no-console: 0, no-loop-func: 0*/
var t = require('../index')

t('0. empty test, no function')

t.skip('1. primitives - comparison', function() {
	t('==', 2, 2)
	t('!==', 3, 4)
	t('==', true, false, 'Optional Additional Assertion Message')
	t('<', 1, 2)
	t('==', true, false)
}, false, 'Optional Additional Test Set Message')
t('2. object - comparison', function() {
	t('!{===}', [], 'str')
	t('!==', [], 2)
})
t('3. async', function(end) {
	setTimeout(end, 0)
	t('==', true, false)
	t('!', true)
	t('!!', false, 'should be something that it is not')
	t('!{==}', 3, 4)
}, 'Other Test Comment')
t('4. more async', function(end) {
	setTimeout(end, 0)
	t('!==', 3, 4)
	t('!{==}', 3, 4)
})
t.skip('5. more skip', function(end) {
	setTimeout(end, 0)
	t('!==', 3, 4)
	t('!{==}', 3, 4)
})
