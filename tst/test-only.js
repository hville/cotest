/* eslint no-console: 0, no-loop-func: 0*/
var t = require('../index')

t('must be skipped', function() {
	t('==', true, false)
})
t('Flagged - ONLY', function() {
	t('!{===}', [], 'str')
	t('!==', [], 2)
}, true)
t('Flagged - ONLY', function(end) {
	setTimeout(end, 0)
	t('!==', 3, 4)
	t('!{==}', 3, 4)
}, true)
t('must be skipped', function() {
	t('==', true, false)
})
