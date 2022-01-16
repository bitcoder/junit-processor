"use strict";

const fs = require("fs");
var path = require('path');
var xml2js = require('xml2js');
var parseString = require('xml2js').parseString;
var xmllint = require('xmllint');


function validate(options) {
	var schemasOk = [];
	const contents = fs.readFileSync(options.inputFile, { encoding: 'utf8', flag: 'r' });
	if (validateSchema(contents, 'jenkins-junit.xsd', 'jenkins', options.debug)) 
		schemasOk.push('jenkins');
	//if (validateSchema(contents, 'surefire-test-report.xsd', 'surefire legacy', options.debug)) 
	//	schemasOk.push('surefire-legacy');
	if (validateSchema(contents, 'JUnit.xsd', 'ant', options.debug))
		schemasOk.push('ant');
	return schemasOk;
}

function validateSchema(content, schemaFile, format, debug = false) {
	var schema = fs.readFileSync(path.join(__dirname, '..', 'schemas', schemaFile));
	var result = xmllint.validateXML({ xml: content, schema: schema });
	if (result.errors){
		console.log('does *not* match ' + format + ' schema');
		if (debug)
			console.log(JSON.stringify(result.errors));
		return false;
	} else {
		console.log('matches ' + format + ' schema');
		return true;
	}
}

function updateTestCountersOnRootTestsuites(testsuites, debug = false) {
	var totalTests = 0;
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


function handle(options) {
	if (options.debug)
		console.log(options);

	const contents = fs.readFileSync(options.inputFile, { encoding: 'utf8', flag: 'r' });
	var xml = null;

	parseString(contents, function (err, data) {
		if (options.debug)
			console.log(data);

		// iterate over suites
		for (var suite of data.testsuites.testsuite) {

			// remove testcases based on some criteria
			suite.testcase = suite.testcase.filter((testcase) => {
				// testcase['$'].name='xpto';

				return !((options.removeSkipped && testcase.skipped) || (options.removeErrors && testcase.error) || (options.removeFailures && testcase.failure));
				//return !(options.removeSkipped && testcase.skipped);
			});

			// update test counters on suite
			updateTestCountersOnSuite(suite, options.debug);
		}

		// update test counters on root testsuites element
		updateTestCountersOnRootTestsuites(data.testsuites, options.debug);

		var builder = new xml2js.Builder({ cdata: true });
		xml = builder.buildObject(data);
		if (options.debug) 
			console.log(xml);
	});

	return xml;
}

function writeXML(file, xml) {
	fs.writeFileSync(file, xml);
}

module.exports = {
	validate,
	handle,
	writeXML
};

