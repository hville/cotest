/* eslint no-console: 0, no-loop-func: 0*/
var t = require('../index')

t('timeout', function(end) {
	t('==', true, true)
	t('!{==}', 3, 4)
})
t('4. more async', function(end) {
	setTimeout(end, 0)
	t('!==', 3, 4)
	t('!{==}', 3, 4)
})
