"use strict";

const fs = require("fs");
var xml2js = require('xml2js');
var parseString = require('xml2js').parseString;

function updateTestCountersOnRootTestsuites(testsuites, debug = false) {
	var totalTests = 0; //suite.testcase.length;
	var totalErrors = 0;
	var totalFailures = 0;
	var totalSkipped = 0;

	// iterate over suites
	for (var suite of testsuites.testsuite) {	
		totalTests += suite.testcase.length;
		for (var testcase of suite.testcase) {
			if (debug)
				console.dir(testcase);

			if (testcase.skipped) {
				totalSkipped++;
			} else if (testcase.failure) {
				totalFailures++;
			} else if (testcase.error) {
				totalErrors++;
			}
		}
	}

	testsuites['$'].tests = totalTests;
	testsuites['$'].skipped = totalSkipped;
	testsuites['$'].errors = totalErrors;
	testsuites['$'].failures = totalFailures;
}

function updateTestCountersOnSuite(suite, debug = false) {
	var totalTests = suite.testcase.length;
	var totalErrors = 0;
	var totalFailures = 0;
	var totalSkipped = 0;

	for (var testcase of suite.testcase) {
		if (debug)
			console.dir(testcase);

		if (testcase.skipped) {
			totalSkipped++;
		} else if (testcase.failure) {
			totalFailures++;
		} else if (testcase.error) {
			totalErrors++;
		}
	}
	suite['$'].tests = totalTests;
	suite['$'].skipped = totalSkipped;
	suite['$'].errors = totalErrors;
	suite['$'].failures = totalFailures;
}


function process(options) {
	if (options.debug)
		console.log(options);

	const contents = fs.readFileSync(options.inputFile, { encoding: 'utf8', flag: 'r' });
	parseString(contents, function (err, data) {
		if (options.debug)
			console.log(data);

		// iterate over suites
		for (var suite of data.testsuites.testsuite) {

			// remove testcases based on some criteria
			suite.testcase = suite.testcase.filter((testcase) => {
				// testcase['$'].name='xpto';

				return !((options.removeSkipped && testcase.skipped) || (options.removeErrors && testcase.error) || (options.removeFailures && testcase.failure))
				//return !(options.removeSkipped && testcase.skipped);
			});

			// update test counters on suite
			updateTestCountersOnSuite(suite, options.debug);
		}

		// update test counters on root testsuites element
		updateTestCountersOnRootTestsuites(data.testsuites, options.debug);

		var builder = new xml2js.Builder({ cdata: true });
		var xml = builder.buildObject(data);
		if (options.debug) 
			console.log(xml);
		fs.writeFileSync(options.outputFile, xml);
	});

}

module.exports = {
	process
};

