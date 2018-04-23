0.8.1 / 2016-05-14
------------------
- removed dep `object-assign`. See: [#14][#14]

0.8.0 / 2016-05-11
------------------
- **BREAKING CHANGE**: you must at least use Electron v1.0.0.

0.7.0 / 2016-05-01
------------------
- fix deprecation notice for old Electron [#13][#13]
- Standard upgrade

0.6.4 / 2016-04-07
------------------
- fix renderer tests v37.5

0.6.3 / 2016-04-06
------------------
- remove v37 deprecation errors. [#9][#9]

0.6.2 / 2015-12-11
------------------
- Bug in closing window. See: https://github.com/jprichardson/electron-window/issues/5 https://github.com/jprichardson/electron-window/pull/7

0.6.1 / 2015-12-11
------------------
- use `loadURL` if available instead of `loadUrl`. See: https://github.com/jprichardson/electron-window/pull/6#issuecomment-163826265

0.6.0 / 2015-08-27
------------------
- added support for data uris. See: https://github.com/jprichardson/electron-window/pull/2

0.5.0 / 2015-07-15
------------------
- upgraded to `is-electron-renderer@2.0` (Electron removed `global` for non-node integration)

0.4.3 / 2015-07-13
------------------
- regression: `showUrl()` without window arguments wouldn't actually show window

0.4.2 / 2015-07-10
------------------
- made callback optional in `showUrl()`

0.4.1 / 2015-07-10
------------------
- bug fix: wrong `this context`

0.4.0 / 2015-07-09
------------------
- Removed passing defaults of `resizable: false` and `frame: true`.
- refactored, added tests

0.3.0 / 2015-05-27
------------------
- `showUrl()`: actually display window when contents loaded

0.2.1 / 2015-05-22
------------------
- fixed package.json main path bug

0.2.0 / 2015-05-22
------------------
- changed so `window.__args__` would be available right away
- changed examples
- exposed `parseArgs()` for renderer scripts

0.1.1 / 2015-05-22
------------------
- fix `package.json` Github repo

0.1.0 / 2015-05-22
------------------
- initial release

<!-- auto generated with: jprichardson/issue-links -->

[#19]: https://github.com/jprichardson/electron-window/pull/19      "Use Electron 1.0 API consistently"
[#18]: https://github.com/jprichardson/electron-window/pull/18      "Support Electron 1.0"
[#17]: https://github.com/jprichardson/electron-window/pull/17      "Update README"
[#16]: https://github.com/jprichardson/electron-window/issues/16    "Update README"
[#15]: https://github.com/jprichardson/electron-window/issues/15    "Electron complains on launch: (electron) options.preload is deprecated. Use options.webPreferences.preload instead."
[#14]: https://github.com/jprichardson/electron-window/issues/14    "Remove object-assign dependency."
[#13]: https://github.com/jprichardson/electron-window/pull/13      "Use opts.preload when Electron version is less than 0.37.3"
[#12]: https://github.com/jprichardson/electron-window/pull/12      "removed options.preload deprecation errors."
[#11]: https://github.com/jprichardson/electron-window/issues/11    "replace options.preload with options.webPreferences.preload"
[#10]: https://github.com/jprichardson/electron-window/pull/10      "Fix preload scripts in electron-window"
[#9]: https://github.com/jprichardson/electron-window/pull/9        "Remove 0.37 deprecation warnings"
[#8]: https://github.com/jprichardson/electron-window/issues/8      "Deprecated Url methods in favor of URL (following Electron convention)"
[#7]: https://github.com/jprichardson/electron-window/pull/7        "Remove window reference on `close` instead of `closed`"
[#6]: https://github.com/jprichardson/electron-window/pull/6        "Change win.loadUrl to win.loadURL"
[#5]: https://github.com/jprichardson/electron-window/issues/5      "Error message when closing window"
[#4]: https://github.com/jprichardson/electron-window/issues/4      "loadUrl deprecation in BrowserWindow"
[#3]: https://github.com/jprichardson/electron-window/pull/3        "added `showUrl` `show` arg"
[#2]: https://github.com/jprichardson/electron-window/pull/2        "added datauri case and test"
[#1]: https://github.com/jprichardson/electron-window/issues/1      "BrowserWindow Methods?"
