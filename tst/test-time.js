/* eslint no-console: 0, no-loop-func: 0, no-unused-vars:0*/
var ct = require('../index')

ct('timeout', function(t, end) {
	t('==', true, true)
	t('!{==}', 3, 4)
})
ct('4. more async', function(t, end) {
	setTimeout(end, 0)
	t('!==', 3, 4)
	t('!{==}', 3, 4)
})
