# rabin

Node native addon module (C/C++) for [Rabin fingerprinting](https://en.wikipedia.org/wiki/Rabin_fingerprint) data streams.

[![Build Status](https://travis-ci.org/datproject/rabin.svg?branch=master)](https://travis-ci.org/datproject/rabin)
[![Build status](https://ci.appveyor.com/api/projects/status/u00ajj4hu7oy9cwv/branch/master?svg=true)](https://ci.appveyor.com/project/maxogden/rabin/branch/master)

Uses the implementation of Rabin fingerprinting from [LBFS](https://github.com/fd0/lbfs/tree/bdf4f17d23b68536e7805c88e269026c74c32d59/liblbfs).

Rabin fingerprinting is useful for finding the chunks of a file that differ from a previous version. It's one implementation of a technique called "Content-defined chunking", meaning the chunk boundaries are determinstic to the content (as opposed to "fixed-sized chunking").

