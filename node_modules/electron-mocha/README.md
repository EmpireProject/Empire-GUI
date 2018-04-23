electron-mocha
==============
[![Build Status](https://travis-ci.org/jprichardson/electron-mocha.svg?branch=master)](https://travis-ci.org/jprichardson/electron-mocha)
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/jprichardson/electron-mocha?branch=master&svg=true)](https://ci.appveyor.com/project/jprichardson/electron-mocha)
[![npm](https://img.shields.io/npm/v/electron-mocha.svg?maxAge=2592000)]()

Mocha testing in [Electron](http://electron.atom.io/). This project has
two main value propositions:

1. You can now easily test any JavaScript app in a real browser (Chromium)
without hassling with PhantomJS or Webdriver.
2. You can now easily test your Electron apps!


Install
-------

    npm i -g electron-mocha


Usage
-----

### Install Electron

First, you need to install Electron. You can either run:

    npm i -g electron

and then `electron` will be added to your path. Or, you
can download a version from https://github.com/atom/electron/releases and
then set an environment variable `ELECTRON_PATH` pointing to the binary.
Note if you're using Mac OS X, the path would be to the actual executable
and not the app directory e.g. `/Applications/Electron.app/Contents/MacOS/Electron`.

You should probably just install `electron-prebuilt` as it simplifies things.


### Run Tests

`electron-mocha` is almost a drop-in replacement for the regular `mocha` command.
Here's the help output:

```

Usage: electron-mocha [options] [files]

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -C, --no-colors        force disabling of colors
    -O, --reporter-options reporter-specific options, format: k=v,k2=v2,...
    -R, --reporter <name>  specify the reporter to use
    -S, --sort             sort test files
    -b, --bail             bail after first test failure
    -g, --grep <pattern>   only run tests matching <pattern>
    -f, --fgrep <string>   only run tests containing <string>
    -i, --invert           inverts --grep and --fgrep matches
    -r, --require <name>   require the given module
    -s, --slow <ms>        "slow" test threshold in milliseconds [75]
    -t, --timeout <ms>     set test-case timeout in milliseconds [2000]
    -u, --ui <name>        specify user-interface (bdd|tdd|exports)
    --check-leaks          check for global variable leaks
    --compilers            use the given module(s) to compile files
    --debug                enable Electron debugger on port [5858]; for --renderer tests show window and dev-tools
    --debug-brk            like --debug but pauses the script on the first line
    --globals <names>      allow the given comma-delimited global [names]
    --inline-diffs         display actual/expected differences inline within each string
    --interactive          run tests in renderer process in a visible window that can be reloaded to re-run tests
    --interfaces           display available interfaces
    --no-timeouts          disables timeouts
    --opts <path>          specify opts path [test/mocha.opts]
    --recursive            include sub directories
    --renderer             run tests in renderer process
    --preload <name>       preload the given script in renderer process
    --require-main <name>  load the given script in main process before executing tests

```

So if you run:

    electron-mocha ./tests

This runs the tests in the [`main`](https://github.com/atom/electron/blob/master/docs/tutorial/quick-start.md#main-process)
process. The output that you could expect would be pretty similar to that of io.js with one exception,
it supports all of Electron libraries since it's running
in Electron! So you don't need to mock those libraries out anymore and can actually write tests to integrate with them.

If you run:

    electron-mocha --renderer ./tests

This runs the tests in the [`renderer`](https://github.com/atom/electron/blob/master/docs/tutorial/quick-start.md#main-process).
Yes, this means that you have access to the entirety of the DOM, web storage, etc. This is because it's actually
running in a [Chromium](https://en.wikipedia.org/wiki/Chromium_(web_browser)) process.

### Using on Travis

Your `.travis.yml` will need two extra lines of configuration to run this headless on Travis:

```yaml
before_script:
  - export DISPLAY=:99.0; sh -e /etc/init.d/xvfb start
```

###  Debugger Support

Use the `--debug` or `--debug-brk` options to enable Electron's debugger. When using `--renderer` this will open the test window and open the dev-tools. Note that the window will close automatically when the tests have finished, therefore this option should be used in combination with `debugger` statements anywhere in your tests or code. Alternatively, you can use the `--interactive` option which will keep the window open after your tests have run (you can reload the window to run the tests again) -- this gives you the opportunity to set breakpoints using the dev-tools debugger.

To debug the main process (i.e., if you run your tests without the `--renderer` option), you will need to start an external debugger. For more details, see [Electron's documentation](http://electron.atom.io/docs/tutorial/debugging-main-process/).

### Code Coverage

You can use electron-mocha to collect code coverage data in Electron's main and renderer processes. To do this, you will need to instrument your code, run the tests on the instrumented code, and save the coverage stats after all tests have finished. You can [instrument your code on the fly](https://github.com/tropy/tropy/blob/master/test/support/coverage.js) using [istanbul-lib](https://github.com/istanbuljs/istanbuljs) or by running `istanbul instrument` [before you exectue your tests](https://github.com/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/commit/1b2055b286f1f296c0d48dec714224c14acb3c34). Finally, use [nyc](https://github.com/istanbuljs/nyc/) to combine the results from all processes into a single coverage report.

Roadmap
-------
- Implement a way to allow tests to run in either `main`/`renderer` from within
the same test file for the purposes of integration testing.


License
-------

MIT
