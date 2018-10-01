/* eslint no-console: 0, no-loop-func: 0*/
var ct = require('../index')

ct.only('test.only', function(t, end) {
	setTimeout(end, 0)
	t('!==', 3, 4)
	t('!{==}', 3, 4)
})
ct('must be skipped', function(t) {
	t('==', true, false)
})
