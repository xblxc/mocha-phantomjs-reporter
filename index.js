/*!
 * Inspired by Phantom Mochachino (http://doublenegative.com/phantom-mochachino)
 * Thankyou so much
 */

(function() {

    var color = window.callPhantom
      ? function(c, txt){ return txt ? '{' + txt + '|' + c + '}' : '' }
      : Mocha.reporters.Base.color;

    function log() {

        var args = Array.apply(null, arguments);
        if (window.callPhantom) {
            window.callPhantom(args);
        } else {
            console.log( args.join(" ") );
        }

    }

    var Reporter = function(runner){

        Mocha.reporters.Base.call(this, runner);

        var out = [];
        var stats = { suites: 0, tests: 0, passes: 0, pending: 0, failures: 0 }
        var runTests = [];

        runner.on('start', function() {
            stats.start = new Date();
        });

        runner.on('suite', function(suite) {
            stats.suites++;
            out.push([color('yellow', suite.title)]);
        });

        runner.on('test', function(test) {
            stats.tests++;
            runTests.push(test.title);
        });

        runner.on("pass", function(test) {

            stats.passes++;
            //in most case, we don't it
            if ('fast' == test.speed) {
                out.push([ color('checkmark', '  ✓ '), color('grey', test.title)]);
            } else {
                out.push([
                    color('checkmark', '  ✓ '),
                    test.title,
                    color('yellow', test.duration + "ms")
                ]);
            }

        });

        runner.on('fail', function(test, err) {
            stats.failures++;
            out.push([ color('fail', '  × '), color('fail', test.title), ":\n    ", color('fail', "  " + err.message) ,"\n"]);
        });

        runner.on("end", function() {
            stats.end = new Date();
            stats.duration = new Date() - stats.start;

            out.push([stats.tests, "tests ran in", stats.duration, " ms"]);
            stats.failures
              ? out.push([ color('checkmark', stats.passes + " passed"), "and", color('fail', stats.failures + " failed")])
              : out.push([ '\n', stats.passes == stats.tests && stats.suites ? color('success', '  Test Success ✓✓  ') : color('fail', '  Test Fail ××  ')]);
            out.push(['\n']);

            while (out.length) {
                log.apply(null, out.shift());
            }

            //end up
            if (window.callPhantom) {
                window.callPhantom('');
            }

        });

    };

    mocha.setup({
        ui: 'bdd',
        ignoreLeaks: true,
        reporter: Reporter
    });

}());



