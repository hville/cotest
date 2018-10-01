/* eslint no-console: 0, no-loop-func: 0*/
var ct = require('../index')

ct('empty test, no function')

ct('sync', function(t) {
	t('==', 2, 2)
	t('==', true, false, 'true should be false')
})

ct('async - pass', function(t, end) {
	setTimeout(end, 0)
	t('==', true, true)
})

ct('async - fail', function(t, end) {
	setTimeout(end, 0)
	t('==', true, false)
})

ct('async - fail end', function(t, end) {
	setTimeout(end, 0, 'failed on close')
	t('==', true, true)
})

ct('async - timeout', function(t, end) {
	setTimeout(end, 3000)
	t('==', true, true)
})

ct.skip('skip test', function(t) {
	t('==', true, true)
})

ct('skip assert', function(t) {
	t.skip('===', true, true)
})

ct('skip op', function(t) {
	t('skip', true, true)
})
