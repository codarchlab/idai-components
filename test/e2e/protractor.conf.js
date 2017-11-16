fs = require('fs');

exports.config = {
    chromeDriver : '../../node_modules/chromedriver/lib/chromedriver/chromedriver',
    baseUrl: 'http://localhost:8084',
    specs: ['**/*.spec.js'],
    directConnect: true,
    exclude: [],
    multiCapabilities: [{
        browserName: 'chrome'
    }],
    allScriptsTimeout: 110000,
    getPageTimeout: 100000,
    framework: 'jasmine2',
    jasmineNodeOpts: {
        isVerbose: false,
        showColors: true,
        includeStackTrace: false,
        defaultTimeoutInterval: 400000
    },
    plugins: [{
        package: 'protractor-console-plugin',
        failOnWarning: false,
        failOnError: false, // TODO: turn back on when console errors are fixed
        logWarnings: true,
        exclude: []
    }],
    onPrepare: function() {

        var FailureScreenshotReporter = function() {

            this.specDone = function(spec) {
                if (spec.status === 'failed') {

                    browser.takeScreenshot().then(function (png) {
                        var stream = fs.createWriteStream('test/e2e-screenshots/'+spec.fullName.replace(/ /g,"_")+'.png');
                        stream.write(new Buffer(png, 'base64'));
                        stream.end();
                    });
                }
            }
        };
        jasmine.getEnv().addReporter(new FailureScreenshotReporter());


        // Set display size in top suite so one can safely override it for single tests without risk of forgetting to set it back.
        jasmine.getEnv().topSuite().beforeEach({fn: function() {
            browser.manage().window().setSize(
                1200, // With this resolution the navbar is fully expanded.
                800);
        }});
    }
};