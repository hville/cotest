<!-- markdownlint-disable MD012 MD022 MD024 MD026 MD032 MD041 -->

# Change Log

- based on [Keep a Changelog](http://keepachangelog.com/)
- adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
- ~~Removed, Changed, Deprecated, Added, Fixed, Security~~
- ~~browser use and/or version~~
- TODO test crash on first t.skip call
- `catch` replaced by `throws` and `!throws`


## [2.1.0] - 2017-03-17
### Fixed
- Added jsdoc comments to avoid function signature warnings in editors

## [2.1.0] - 2017-03-17
### Added
- 'catch' operator similar to `assert.throws`

## [2.0.2] - 2017-01-26
### Fixed
- fixed error if first test is `test.only`

### Changed
- reverted ES6 features back to ES5 for possible future browser version


## [2.0.1] - 2017-01-09
### Fixed
- fixed regression in the summary test total
- fixed tabulation in multi-line errors

## [2.0.0] - 2017-01-05
### Changed
- reporter to show skipped tests and assertions

### Deprecated
- the `only` test argument flag (i.e. prefer `t.only(name, test)` over `t(name, test, true)`)

### Added
- `CHANGELOG.md`
- `.editorconfig`
- `t.only` to single-out test(s)
- `t.skip` to skip tests or assertions
- Example in `README.md`

### Fixed
- reporter for Boolean operator messages

## [1.6.1] - 2016-10-17
### Added
- new boolean operators `!` and `!!`
- additional error message for invalid operation

## [1.5.0] - 2016-10-01
### Added
- new `t.timeout()` function to configure the timeout duration

## [1.4.0] - 2016-09-29
### Added
- allowance for empty tests
### Fixed
- minor reporter looks

## [1.3.0] - 2016-09-27
### Fixed
- timeout for async tests

## [1.1.1] - 2016-09-24
### Added
- additional test message argument to add comments

## [1.0.1] - 2016-09-16
### Fixed
- `README.md`

## [1.0.0] - 2016-09-03
### Added
- First publish
