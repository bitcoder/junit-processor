# junit-processor

[![build workflow](https://github.com//bitcoder/junit-processor/actions/workflows/build.yml/badge.svg)](https://github.com/X/bitcoder/junit-processor/actions/workflows/build.yml)
[![NPM version](https://img.shields.io/npm/v/junit-processor.svg)](https://www.npmjs.com/package/junit-processor) [![License](https://img.shields.io/github/license/bitcoder/junit-processor.svg)](https://github.com/bitcoder/junit-processor/blob/main/LICENSE)
[![NPM downloads](https://img.shields.io/npm/dw/junit-processor.svg)](https://www.npmjs.com/package/junit-processor)


A JUnit XML post processing utility, for cleaning up, modifying some data on these reports, or even do some other operations on these reports.
Please consider this highly experimental :)


## Features

- remove `testcase` elements that are marked as skipped, or that have failures or errors
- updates test counters on parent `testsuite` element

## Nice-2-have

- update `testcase` elements that match a certain criteria

### Installation

    npm install -g junit-processor

Or just download the repository and include it in your `node_modules` directly.

### Usage

 ```
Usage: junit-processor [options] <inputJunitXMLfile>

Options:
  -V, --version           output the version number
  -s, --removeSkipped     remove skipped testcases
  -e, --removeErrors      remove testcases with errors
  -f, --removeFailures    remove testcases with failures
  -x, --schema            validate against known schemas
  -o, --out <outputfile>  file to output to (default: "./junit-new.xml")
  -d, --debug             print debug information
  -h, --help              display help for command
```

## Contributing

Feel free to submit issues and/or PRs! In lieu of a formal style guide,  please follow existing styles.

## Contact

You can find me on [Twitter](https://twitter.com/darktelecom).

## Acknowledgments

This work was highly based on previous work from [junit-merge](https://github.com/drazisil/junit-merge)

## LICENSE

[Apache 2.0](LICENSE).
