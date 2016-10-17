/* eslint no-console: 0, no-loop-func: 0*/
var t = require('../index')

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
