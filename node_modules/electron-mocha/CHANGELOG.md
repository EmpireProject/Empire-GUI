<!-- Github links generated with: https://github.com/jprichardson/issue-links -->

4.0.2 / 2017-09-02
------------------
- Fixed support for electron-compile. See [#112][#112]

4.0.1 / 2017-08-31
------------------
- Update dependencies
- Added support for electron-compile. See [#111][#111]

4.0.0 / 2017-06-16
------------------
- Load --require-main script before app 'ready' event. This allows scripts to configure Electron before the event is fired.

3.5.0 / 2017-06-13
------------------
- Clean-up tmp userData in separate task. See: [#105][#105]

3.4.0 / 2017-03-20
------------------
- Re-enable --bail option
- Add -O / --reporter-options from Mocha.js
- Update fs-extra dependency

3.3.0 / 2016-12-14
------------------
- Fix --interactive move. See: [#97][#97]
- Use ES6 consistently

3.2.1 / 2016-11-23
------------------
- No exit on uncaught errors during test runs. See: [#93][#93] and [#94][#94]

3.2.0 / 2016-11-17
------------------
- Add --interactive options. See: [#91][#91]

3.1.1 / 2016-09-27
------------------
- Allow window focus when using --debug-brk

3.1.0 / 2016-09-14
------------------
- Add --require-main option. See: [#84][#84]

3.0.6 / 2016-09-11
------------------
- Do not focus test window. See: [#83][#83]

3.0.5 / 2016-08-24
------------------
- Exit after webContents destroyed event fires. See: [#78][#78] and [#77][#77]

3.0.4 / 2016-08-18
------------------
- Fix support for Node 4/5

3.0.3 / 2016-08-18
------------------
- Remove superfluous debug statement

3.0.2 / 2016-08-18
------------------
- Support electron npm package

3.0.1 / 2016-08-16
------------------
- Prefer $ELECTRON_PATH over locally installed electron. See: [#73][#75]

3.0.0 / 2016-08-01
------------------
- Update to Mocha 3.0.0

2.3.1 / 2016-07-13
------------------
- Listen and ignore 'window-all-closed' instead of aborting 'will-quit'
- Use fs.mkdtemp to create temporary workspace

2.3.0 / 2016-07-06
------------------
- Add --debug and --debug-brk options. See: [#70][#70]

2.2.1 / 2016-06-22
------------------
- Close test window after --renderer tests have finished

2.2.0 / 2016-05-30
------------------
- Add --no-colors option

2.1.0 / 2016-05-17
------------------
- Don't stop early if tests open/close windows

2.0.0 / 2016-05-12
------------------
- Fixed incorrect exit code after Renderer failures See: [#60][#60]
- Removed Electron 0.x checks / compatibility

1.3.0 / 2016-05-11
------------------
- Electron 1.0 compatibility
- Update dependencies

1.2.3 / 2016-05-06
------------------
- Update dependencies

1.2.2 / 2016-04-20
------------------
- Load compiler before require options. See: [#57][#57]

1.2.1 / 2016-04-19
------------------
- window destroyed on exit. See: [#56][#56]

1.2.0 / 2016-04-12
------------------
- fallback to local `electron-prebuilt` if can't find `electron` in the `$PATH` [#55][#55]

1.1.0 / 2016-04-10
------------------
- Add --preload option. See: [#45][#45]

1.0.3 / 2016-04-07
------------------
- Update to latest mocha

1.0.2 / 2016-04-04
------------------
- Ensure backwards compatibility of previous version

1.0.1 / 2016-04-04
------------------
- Update BrowserWindow options syntax for Electron >= 0.37.4. Removes deprecation warnings.

1.0.0 / 2016-03-21
------------------
- console piping issue [#48][#48]

0.8.0 / 2016-01-14
------------------
- Fix remote output w/ line breaks. See [#40][#40]

0.7.0 / 2015-12-15
------------------
- update `electron-window` dep. (For electron >= `0.35`). Removes deprecation warnings. See: https://github.com/jprichardson/electron-mocha/pull/31
- clean up require statements (Electron modules). See: https://github.com/jprichardson/electron-mocha/pull/29
- `--require` support fixed in Renderer. See: https://github.com/jprichardson/electron-mocha/pull/33

0.6.3 / 2015-11-26
------------------
- fix for deprecation warnings in Electron `v0.35`. See: https://github.com/jprichardson/electron-mocha/pull/26

0.6.2 / 2015-11-21
------------------
- report error if in mocha: See: https://github.com/jprichardson/electron-mocha/pull/25

0.6.1 / 2015-11-05
------------------
- fix exit code on `bin/electron-mocha`: See: https://github.com/jprichardson/electron-mocha/pull/22

0.6.0 / 2015-11-05
------------------
- add support for mocha opts: See: https://github.com/jprichardson/electron-mocha/pull/21

0.5.1 / 2015-10-30
------------------
- bugfix: expose `mocha` to `window` as Mocha does. See: https://github.com/jprichardson/electron-mocha/pull/20

0.5.0 / 2015-10-21
------------------
- end Electron with proper exit code now. See: https://github.com/jprichardson/electron-mocha/pull/17

0.4.0 / 2015-10-16
------------------
- added `--compilers` flag. See: https://github.com/jprichardson/electron-mocha/pull/16

0.3.1 / 2015-08-27
------------------
- bugfix: incorrect stdin/stdout values (fail on Node v0.10): https://github.com/jprichardson/electron-mocha/pull/8 
0.3.0 / 2015-07-30
------------------
- display an error about not being able locate `electron`
- change `process.stdout` hijacking https://github.com/jprichardson/electron-mocha/pull/6
- removed `node_modules` https://github.com/jprichardson/electron-mocha/pull/7

0.2.1 / 2015-07-22
------------------
- bugfix on finding `index.html` for `--renderer` tests

0.2.0 / 2015-07-15
------------------
- upgraded to `electron-window@0.5.0` (Electron removed `global` for non-node integration)

0.1.1 / 2015-07-10
-------------------
- forgot `fs` in `args.js`
- JavaScript Standard Style

0.1.0 / 2015-07-10
------------------
- initial release


[#112]: https://github.com/jprichardson/electron-mocha/pull/112      "fix for electron compile support"
[#111]: https://github.com/jprichardson/electron-mocha/pull/111      "added support for electron compile"
[#105]: https://github.com/jprichardson/electron-mocha/pull/105      "Run clean up in a separate task"
[#97]: https://github.com/jprichardson/electron-mocha/pull/97      "Trigger 'mocha-start' on page reload"
[#94]: https://github.com/jprichardson/electron-mocha/pull/94      "Remove uncaught exception errors"
[#93]: https://github.com/jprichardson/electron-mocha/issues/93    "Assert not caught in async tests"
[#92]: https://github.com/jprichardson/electron-mocha/issues/92    "Allow renderer process testing in electron-mocha"
[#91]: https://github.com/jprichardson/electron-mocha/pull/91      "Add `--interactive` mode"
[#90]: https://github.com/jprichardson/electron-mocha/issues/90    "html files, like mocha-phantomjs?"
[#89]: https://github.com/jprichardson/electron-mocha/issues/89    "Debugging main process"
[#88]: https://github.com/jprichardson/electron-mocha/issues/88    "Debugging unit tests"
[#87]: https://github.com/jprichardson/electron-mocha/pull/87      "Allow focus when debugging tests"
[#86]: https://github.com/jprichardson/electron-mocha/issues/86    "Debugging no longer has access to to full dev tools"
[#85]: https://github.com/jprichardson/electron-mocha/issues/85    "Unexpected token import"
[#84]: https://github.com/jprichardson/electron-mocha/pull/84      "Add a --require-main option"
[#83]: https://github.com/jprichardson/electron-mocha/pull/83      "Prevent electron-mocha stealing focus from other applications"
[#82]: https://github.com/jprichardson/electron-mocha/issues/82    "Running tests steals focus from Terminal"
[#81]: https://github.com/jprichardson/electron-mocha/issues/81    "Mocha requires Electron to be installed globally"
[#80]: https://github.com/jprichardson/electron-mocha/issues/80    "support for `--watch`" [#79]: https://github.com/jprichardson/electron-mocha/pull/79      "Add .npmignore file"
[#78]: https://github.com/jprichardson/electron-mocha/pull/78      "Exit after webContents destroyed event fires"
[#77]: https://github.com/jprichardson/electron-mocha/issues/77    "electron mocha temp dir locked; unlink error"
[#76]: https://github.com/jprichardson/electron-mocha/issues/76    "Latest update broke support on Node.JS v4 and v5"
[#75]: https://github.com/jprichardson/electron-mocha/issues/75    "Workspaces on Mac OS X"
[#74]: https://github.com/jprichardson/electron-mocha/issues/74    "Module version mismatch"
[#73]: https://github.com/jprichardson/electron-mocha/issues/73    "Specify alternative electron version to run tests with"
[#72]: https://github.com/jprichardson/electron-mocha/issues/72    "Travis CI Failing ( tried readme fix )"
[#71]: https://github.com/jprichardson/electron-mocha/issues/71    "Not working, or not what I think it is?"
[#70]: https://github.com/jprichardson/electron-mocha/pull/70      "Add debugger support"
[#69]: https://github.com/jprichardson/electron-mocha/issues/69    "Source maps support?"
[#68]: https://github.com/jprichardson/electron-mocha/issues/68    "debugging tests in electron-mocha wit Visual Studio Code"
[#67]: https://github.com/jprichardson/electron-mocha/pull/67      "app.exit is not exiting all processes sometimes"
[#66]: https://github.com/jprichardson/electron-mocha/issues/66    "Hangs on Electron 1.2.0"
[#65]: https://github.com/jprichardson/electron-mocha/issues/65    "Can't resolve 'electron'"
[#64]: https://github.com/jprichardson/electron-mocha/issues/64    "Mocking BrowserWindow"
[#63]: https://github.com/jprichardson/electron-mocha/pull/63      "Remove Electron 0.x API calls / checks"
[#62]: https://github.com/jprichardson/electron-mocha/pull/62      "Exits via app.exit()"
[#61]: https://github.com/jprichardson/electron-mocha/issues/61    "npm test on windows"
[#60]: https://github.com/jprichardson/electron-mocha/pull/60      "Fix exit code"
[#59]: https://github.com/jprichardson/electron-mocha/issues/59    "Integration with Karma"
[#58]: https://github.com/jprichardson/electron-mocha/pull/58      "Handle --compiler before --require options"
[#57]: https://github.com/jprichardson/electron-mocha/issues/57    "Unexpected token import"
[#56]: https://github.com/jprichardson/electron-mocha/pull/56      "window must be destroyed before electron exit"
[#55]: https://github.com/jprichardson/electron-mocha/pull/55      "Fallback to local install of electron-prebuilt"
[#54]: https://github.com/jprichardson/electron-mocha/pull/54      "Add tests for mocha.opts, --require, and --preload"
[#53]: https://github.com/jprichardson/electron-mocha/pull/53      "Add option to preload script tags"
[#52]: https://github.com/jprichardson/electron-mocha/pull/52      "Add arbitrary scripts to renderer html page with --scripts option"
[#51]: https://github.com/jprichardson/electron-mocha/issues/51    "Electron 0.37.4 -- Renderer hangs"
[#50]: https://github.com/jprichardson/electron-mocha/pull/50      "Suppress 0.37+ deprecation warnings"
[#49]: https://github.com/jprichardson/electron-mocha/issues/49    "Deleting temp data directory is causing errors in windows"
[#48]: https://github.com/jprichardson/electron-mocha/pull/48      "addressing intellij and tee console issue"
[#47]: https://github.com/jprichardson/electron-mocha/issues/47    "No console output on Windows"
[#46]: https://github.com/jprichardson/electron-mocha/issues/46    "npm install fails with npm@3.3.6 and node@5.0.0"
[#45]: https://github.com/jprichardson/electron-mocha/pull/45      "Generate index.html for renderer tests, and pass relative paths to sc…"
[#44]: https://github.com/jprichardson/electron-mocha/issues/44    "Usage with Istanbul"
[#43]: https://github.com/jprichardson/electron-mocha/issues/43    "Add feature to test AMD modules using mocha"
[#42]: https://github.com/jprichardson/electron-mocha/pull/42      "Add LICENSE file"
[#41]: https://github.com/jprichardson/electron-mocha/issues/41    "This is really cool tool! I like it .... and just let you know that the LICENSE file is missing :-)"
[#40]: https://github.com/jprichardson/electron-mocha/pull/40      "Forward to main process.stdout not console.log"
[#39]: https://github.com/jprichardson/electron-mocha/issues/39    "process.stdout"
[#38]: https://github.com/jprichardson/electron-mocha/pull/38      "Electron demo app + tests (for main and renderer)"
[#37]: https://github.com/jprichardson/electron-mocha/issues/37    "Intermittent rmdir errors"
[#36]: https://github.com/jprichardson/electron-mocha/pull/36      "Add Travis instructions to README"
[#35]: https://github.com/jprichardson/electron-mocha/issues/35    "Examples of tests written to leverage electron-mocha"
[#34]: https://github.com/jprichardson/electron-mocha/issues/34    "Modify README with Travis Instructions"
[#33]: https://github.com/jprichardson/electron-mocha/pull/33      "Add -r/--require support for renderer tests"
[#32]: https://github.com/jprichardson/electron-mocha/pull/32      "Fix ipc require in renderer"
[#31]: https://github.com/jprichardson/electron-mocha/pull/31      "Update electron-window"
[#30]: https://github.com/jprichardson/electron-mocha/issues/30    "remove preferGlobal"
[#29]: https://github.com/jprichardson/electron-mocha/pull/29      "Cleaner require statements"
[#28]: https://github.com/jprichardson/electron-mocha/issues/28    "ELIFECYCLE with v0.35.2 on Travis CI"
[#27]: https://github.com/jprichardson/electron-mocha/pull/27      "Require ipcRenderer instead of ipcMain in the rendered context "
[#26]: https://github.com/jprichardson/electron-mocha/pull/26      "Misc things + squash deprecation warning"
[#25]: https://github.com/jprichardson/electron-mocha/pull/25      "Add error reporting"
[#24]: https://github.com/jprichardson/electron-mocha/pull/24      "Squash deprecation warning for electron 0.35.0"
[#23]: https://github.com/jprichardson/electron-mocha/issues/23    "test 3 fails on OS X "
[#22]: https://github.com/jprichardson/electron-mocha/pull/22      "Fixed exit status on running command"
[#21]: https://github.com/jprichardson/electron-mocha/pull/21      "Add support for mocha.opts"
[#20]: https://github.com/jprichardson/electron-mocha/pull/20      "Expose mocha to window in renderer context"
[#19]: https://github.com/jprichardson/electron-mocha/issues/19    "electron-mocha and istanbul/isparta"
[#18]: https://github.com/jprichardson/electron-mocha/pull/18      "Support `-w, --watch` and `--watch-extensions` args"
[#17]: https://github.com/jprichardson/electron-mocha/pull/17      "End electron with correct exit code"
[#16]: https://github.com/jprichardson/electron-mocha/pull/16      "Support `--compilers` arg"
[#15]: https://github.com/jprichardson/electron-mocha/issues/15    "Support for --compilers js:babel/register"
[#14]: https://github.com/jprichardson/electron-mocha/issues/14    "Add option to show browser window and report there?"
[#13]: https://github.com/jprichardson/electron-mocha/issues/13    "--require option not apply to renderer process"
[#12]: https://github.com/jprichardson/electron-mocha/issues/12    "README clairifcation: jsdom as prerequisite for testing renderer?"
[#11]: https://github.com/jprichardson/electron-mocha/issues/11    "Cannot run in cygwin on Windows?"
[#10]: https://github.com/jprichardson/electron-mocha/issues/10    "Is there a way to run electron-mocha part of gulp build?"
[#9]: https://github.com/jprichardson/electron-mocha/pull/9        "Coffeescript support"
[#8]: https://github.com/jprichardson/electron-mocha/pull/8        "Prevent error 'Incorrect value for stdio stream: inherit' by using di…"
[#7]: https://github.com/jprichardson/electron-mocha/pull/7        "Don’t check in node_modules"
[#6]: https://github.com/jprichardson/electron-mocha/pull/6        "Fix socket errors"
[#5]: https://github.com/jprichardson/electron-mocha/pull/5        "Fix exit code"
[#4]: https://github.com/jprichardson/electron-mocha/issues/4      "allow local installs of electron-prebuilt"
[#3]: https://github.com/jprichardson/electron-mocha/issues/3      "Renderer test hang indefinitely"
[#2]: https://github.com/jprichardson/electron-mocha/issues/2      "Get this working in Travis-CI"
[#1]: https://github.com/jprichardson/electron-mocha/issues/1      "Set exit code (dependent upon Electron fix)"
