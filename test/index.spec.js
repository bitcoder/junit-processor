'use strict';

var junitXmlProcessor = require("../lib/index.js");
var chai = require('chai');
var should = require("chai").should(); // eslint-disable-line no-unused-vars
var describe = require('mocha').describe;
var before = require('mocha').before;
var beforeEach = require('mocha').beforeEach;
var it = require('mocha').it;
var chaiXML = require('chai-xml');
var  sinon = require('sinon');
var sinonChai = require("sinon-chai");
var parseString = require('xml2js').parseString;

let sandbox;
chai.use(chaiXML);
chai.use(sinonChai);

function parseXMLString(xmlStr) {
    var xml = null;
    parseString(xmlStr, function (err, data) {
        xml = data;
    });
    return xml;
}

describe("XML handling", function() {

    it("should not remove skipped tests, if not requested", function() {
        const options = {
            inputFile: './test/fixtures/1.xml',
            removeSkipped: false

        };
        var res = junitXmlProcessor.handle(options);
        //res.should.have.string("skipped test");
        //res.should.have.string('tests="3"');
        //res.should.have.string('skipped="2"');
        
        var xml = parseXMLString(res);
        xml.testsuites['$'].tests.should.equal("6");
        xml.testsuites.testsuite[0]['$'].tests.should.equal("4");
        xml.testsuites.testsuite[0]['$'].skipped.should.equal("1");
      });

    it("should remove skipped tests, if requested", function() {
        const options = {
            inputFile: './test/fixtures/1.xml',
            removeSkipped: true

        };
        var res = junitXmlProcessor.handle(options);
        //expect(someXml).xml.to.be.valid();
        //res.xml.should.be.valid();
        //res.should.not.have.string("skipped test");
        //res.should.have.string('tests="1"');
        //res.should.have.string('skipped="0"');

        var xml = parseXMLString(res);
        xml.testsuites['$'].tests.should.equal("5");
        xml.testsuites.testsuite[0]['$'].tests.should.equal("3");
        xml.testsuites.testsuite[0]['$'].skipped.should.equal("0");
      });

      it("should not remove tests with errors, if not requested", function() {
        const options = {
            inputFile: './test/fixtures/1.xml',
            removeErrors: false

        };
        var res = junitXmlProcessor.handle(options);
        
        var xml = parseXMLString(res);
        xml.testsuites['$'].tests.should.equal("6");
        xml.testsuites.testsuite[0]['$'].tests.should.equal("4");
        xml.testsuites.testsuite[0]['$'].errors.should.equal("1");
      });

    it("should remove tests with errors, if requested", function() {
        const options = {
            inputFile: './test/fixtures/1.xml',
            removeErrors: true

        };
        var res = junitXmlProcessor.handle(options);

        var xml = parseXMLString(res);
        xml.testsuites['$'].tests.should.equal("5");
        xml.testsuites.testsuite[0]['$'].tests.should.equal("3");
        xml.testsuites.testsuite[0]['$'].errors.should.equal("0");
      });

      it("should not remove tests with failures, if not requested", function() {
        const options = {
            inputFile: './test/fixtures/1.xml',
            removeFailures: false

        };
        var res = junitXmlProcessor.handle(options);
        
        var xml = parseXMLString(res);
        xml.testsuites['$'].tests.should.equal("6");
        xml.testsuites.testsuite[0]['$'].tests.should.equal("4");
        xml.testsuites.testsuite[0]['$'].failures.should.equal("1");
      });

    it("should remove tests with failures, if requested", function() {
        const options = {
            inputFile: './test/fixtures/1.xml',
            removeFailures: true

        };
        var res = junitXmlProcessor.handle(options);

        var xml = parseXMLString(res);
        xml.testsuites['$'].tests.should.equal("5");
        xml.testsuites.testsuite[0]['$'].tests.should.equal("3");
        xml.testsuites.testsuite[0]['$'].failures.should.equal("0");
      });
});

describe("patches", function() {
    it("patch 1 - should cleanup testcase name from Karate", function() {
        const options = {
            inputFile: './test/fixtures/TEST-demo.cats.CatsRunner.xml',
            patches: [ '1' ]
        };
        var res = junitXmlProcessor.handle(options);

        var xml = parseXMLString(res);
        xml.testsuite.testcase[0]['$'].name.should.equal("create and retrieve a cat");
        xml.testsuite.testcase[1]['$'].name.should.equal("Some other stuff");
      });
});

describe("XML schema validation", function() {

    before(() => {
        sandbox = sinon.createSandbox();
      });
      beforeEach(() => {
        sandbox.restore();
      });

    it("should validate using the Jenkins schema", function() {
        const options = {
            inputFile: './test/fixtures/jenkins-sample.xml'
        };

        const log = sandbox.spy(console, 'log');
        const res = junitXmlProcessor.validate(options);
        res.should.include.members(['jenkins']);
        log.should.have.been.calledWith("matches jenkins schema");
    });

    it("should validate using the Ant schema", function() {
        const options = {
            inputFile: './test/fixtures/ant-sample.xml'
        };

        const log = sandbox.spy(console, 'log');
        const res = junitXmlProcessor.validate(options);
        res.should.include.members(['ant']);
        log.should.have.been.calledWith("matches ant schema");
    });

    it.skip("should validate using the Surefire legacy schema", function() {
        const options = {
            inputFile: './test/fixtures/surefire-legacy-sample.xml'
        };

        const log = sandbox.spy(console, 'log');
        junitXmlProcessor.validate(options);
        log.should.have.been.calledWith("matches surefire legacy schema");
    });

});