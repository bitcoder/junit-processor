# junit-processor

[![build workflow](https://github.com//bitcoder/junit-processor/actions/workflows/build.yml/badge.svg)](https://github.com/X/bitcoder/junit-processor/actions/workflows/build.yml)
[![NPM version](https://img.shields.io/npm/v/junit-processor.svg)](https://www.npmjs.com/package/junit-processor) [![License](https://img.shields.io/github/license/bitcoder/junit-processor.svg)](https://github.com/bitcoder/junit-processor/blob/main/LICENSE)
[![NPM downloads](https://img.shields.io/npm/dw/junit-processor.svg)](https://www.npmjs.com/package/junit-processor)


A JUnit XML post processing utility, for cleaning up, modifying some data on these reports, or even do some other operations on these reports.
Please consider this highly experimental :)


## Features

- remove `testcase` elements that are marked as skipped, or that have failures or errors
- updates test counters on parent `testsuite` element, and on root `testsuites` element if present
- applies patches, to fix/change the JUnit produced by some tools
- validate JUnit XML report against known schemas (e.g., jenkins, ant)

## Nice-2-have

- update `testcase` elements that match a certain criteria

### Installation

    npm install -g junit-processor

Or just download the repository and include it in your `node_modules` directly.

### Usage

```bash
Usage: junit-processor [options] <inputJunitXMLfile>

Options:
  -V, --version              output the version number
  -s, --removeSkipped        remove skipped testcases
  -e, --removeErrors         remove testcases with errors
  -f, --removeFailures       remove testcases with failures
  -x, --schema               validate against known schemas
  -p, --patches <listOfIds>  patches to apply, by their id, delimited by comma; see https://github.com/bitcoder/junit-processor#readme
  -o, --out <outputfile>     file to output to (default: "./junit-new.xml")
  -d, --debug                print debug information
  -h, --help                 display help for command
```

## Patches

Ahead please find a list of patches that you can apply. Each patch is identified by an id, which is a number.

Example for applying patch 1 on a JUnit XML file:

    junit-processor -p 1 some_junit_report.xml

Example for applying patch 1 and 3, in that order, on a JUnit XML file:

    junit-processor -p 1,3 some_junit_report.xml
### Patch 1

This patch fixes the `name` attribute of `testcase` elements of JUnit XML reports produced by Karate DSL, in order to remove the line numbers which may change with time.
The purpose of this patch is to make `testcase` elements uniquely identifiable, based on their `name` and `classname` attributes.

For example,

`<testcase name="[1:9] create and retrieve a cat" classname="[demo/cats/cats] cats end-point" time="0.248"/>`

becomes...

`<testcase name="create and retrieve a cat" classname="[demo/cats/cats] cats end-point" time="0.248"/>`

## Contributing

Feel free to submit issues and/or PRs! In lieu of a formal style guide,  please follow existing styles.
Please check the following commands that may be useful while developing and testing.

Linting/checking for JS syntax:

    npm run lint

Running tests:

    npm test

Checking code coverage:

    npm run coverage

## Contact

You can find me on [Twitter](https://twitter.com/darktelecom).

## Acknowledgments

This work was highly based on previous work from [junit-merge](https://github.com/drazisil/junit-merge)

## LICENSE

[Apache 2.0](LICENSE).
