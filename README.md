# junit-processor
A JUnit XML processor

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
 Usage: junit-processor [options] <junit.xml>


  Options:

    -V, --version           output the version number
    -h, --help              output usage information
```

## Contributing

Feel free to submit issues and/or PRs!  In lieu of a formal style guide,  please follow existing styles.

## Contact

You can find me on [Twitter](https://twitter.com/darktelecom).

## LICENSE

[Apache 2.0](LICENSE).
