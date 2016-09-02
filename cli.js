#!/usr/bin/env node
/* global process */
/* eslint no-console: 0, global-require: 0 */

var path = require('path')
var fs = require('fs')

var args = process.argv.slice(2)
if (args.length) runTest()

function runTest () {
	args.forEach(function (arg) {
		var file = resolveArg(arg)
		if (file) require(file)
	})
}
function resolveArg (arg) {
	var fullPath = path.resolve(process.cwd(), arg),
			type = pathType(fullPath)

	if (isJS(arg) && type === 'file') return fullPath
	if (type === 'directory') return getDir(fullPath)
	if (!isJS(arg)) return resolveArg(arg + '.js')
	console.log ('WARNING: %s is not a valid file name', arg)
}
function isJS (fileName) {
	return /\.js$/.test(fileName)
}
function pathType (fullPath) {
	try {
		var stats = fs.statSync(fullPath)
		if (stats.isFile()) return 'file'
		if (stats.isDirectory()) return 'directory'
	} catch (e) {	/* ignore invalid file|directory names */ }
}
function getDir (dirName) {
	return fs.readdirSync(dirName).filter(isJS).map(function (n) {
		return path.resolve(dirName, n)
	})
}
