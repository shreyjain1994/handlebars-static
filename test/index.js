var handlebarsStatic = require("..");
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var format = require('util').format;

function noop() {
}

describe('constructor', function () {
    var invalidUrlParameters = [3, true, {}, [], new Error(), noop];
    invalidUrlParameters.forEach(function (param) {
        it(format('throws when given parameter url of type %s', typeof param), function (done) {
            function willThrow() {
                handlebarsStatic(param);
            }

            expect(willThrow).to.throw(TypeError, 'url must be a string');
            done();
        });
    });
    it('works when given parameter url of type string', function (done) {
        handlebarsStatic('foo');
        handlebarsStatic(new String('foo'));
        done();
    });

    var invalidOptionsParameters = ['hello', 3, true, [], new Error(), noop];
    invalidOptionsParameters.forEach(function (param) {
        it(format('throws when given parameter options of type %s', typeof param), function (done) {
            function willThrow() {
                handlebarsStatic('foo', param);
            }

            expect(willThrow).to.throw(TypeError, 'options must be a plain object');
            done();
        });
    });

    it('works when given parameter options of type undefined', function (done) {
        handlebarsStatic('foo');
        done();
    });

    it('works when given parameter options of type plain object', function (done) {
        handlebarsStatic('foo', {});
        done();
    });

    var invalidOptionsSilenceManifestErrorsParameters = ['hello', 3, {}, [], new Error(), noop];
    invalidOptionsSilenceManifestErrorsParameters.forEach(function (param) {
        it(format('throws when given parameter options.silenceManifestErrors of type %s', typeof param), function (done) {
            function willThrow() {
                handlebarsStatic('foo', {silenceManifestErrors: param});
            }

            expect(willThrow).to.throw(TypeError, 'options.silenceManifestErrors must be a boolean');
            done();
        });
    });

    it('works when given parameter options.silenceManifestErrors of type boolean', function (done) {
        handlebarsStatic('foo', {silenceManifestErrors: true});
        done();
    });

    var invalidOptionsManifestParameters = ['hello', 3, true, [], new Error(), noop];
    invalidOptionsManifestParameters.forEach(function (param) {
        it(format('throws when given parameter options.manifest of type %s', typeof param), function (done) {
            function willThrow() {
                handlebarsStatic('foo', {manifest: param});
            }

            expect(willThrow).to.throw(TypeError, 'options.manifest must be a plain object');
            done();
        });
    });

    it('throws when given parameter options.manifest of type plain object with non-string keys/values', function (done) {
        function willThrow() {
            handlebarsStatic('foo', {manifest: {foo: true}});
        }

        expect(willThrow).to.throw(TypeError, 'options.manifest must have all keys and values of type string');
        done();
    });

    it('works when given parameter options.manifest of type plain object with keys/values of type string', function (done) {
        handlebarsStatic('foo', {manifest: {foo: 'bar'}});
        done();
    })
});

it('works when given url without trailing slash', function (done) {
    var s = handlebarsStatic('example.com/static');
    assert.strictEqual(s('foo.css'), 'example.com/static/foo.css');
    assert.strictEqual(s('/foo.css'), 'example.com/static/foo.css');
    done();
});

it('works when given url with trailing slash', function (done) {
    var s = handlebarsStatic('example.com/static/');
    assert.strictEqual(s('foo.css'), 'example.com/static/foo.css');
    assert.strictEqual(s('/foo.css'), 'example.com/static/foo.css');
    done();
});

it('works with url with trailing slash and with a manifest with keys that have a leading slash', function (done) {
    var s = handlebarsStatic('example.com/static/', {manifest: {'/foo.css':'foo-123.css'}});
    assert.strictEqual(s('foo.css'), 'example.com/static/foo-123.css');
    assert.strictEqual(s('/foo.css'), 'example.com/static/foo-123.css');
    done();
});

it('works with url with trailing slash and with a manifest with values that have a leading slash', function (done) {
    var s = handlebarsStatic('example.com/static/', {manifest: {'foo.css':'/foo-123.css'}});
    assert.strictEqual(s('foo.css'), 'example.com/static/foo-123.css');
    assert.strictEqual(s('/foo.css'), 'example.com/static/foo-123.css');
    done();
});

it('works with url with trailing slash and with a manifest with values and keys that have a leading slash', function (done) {
    var s = handlebarsStatic('example.com/static/', {manifest: {'/foo.css':'/foo-123.css'}});
    assert.strictEqual(s('foo.css'), 'example.com/static/foo-123.css');
    assert.strictEqual(s('/foo.css'), 'example.com/static/foo-123.css');
    done();
});

it('works with url with trailing slash and with a manifest with values and keys without a leading slash', function (done) {
    var s = handlebarsStatic('example.com/static/', {manifest: {'foo.css':'foo-123.css'}});
    assert.strictEqual(s('foo.css'), 'example.com/static/foo-123.css');
    assert.strictEqual(s('/foo.css'), 'example.com/static/foo-123.css');
    done();
});

it('works with url without trailing slash and with a manifest with keys that have a leading slash', function (done) {
    var s = handlebarsStatic('example.com/static', {manifest: {'/foo.css':'foo-123.css'}});
    assert.strictEqual(s('foo.css'), 'example.com/static/foo-123.css');
    assert.strictEqual(s('/foo.css'), 'example.com/static/foo-123.css');
    done();
});

it('works with url without trailing slash and with a manifest with values that have a leading slash', function (done) {
    var s = handlebarsStatic('example.com/static', {manifest: {'foo.css':'/foo-123.css'}});
    assert.strictEqual(s('foo.css'), 'example.com/static/foo-123.css');
    assert.strictEqual(s('/foo.css'), 'example.com/static/foo-123.css');
    done();
});

it('works with url without trailing slash and with a manifest with keys and values that have a leading slash', function (done) {
    var s = handlebarsStatic('example.com/static', {manifest: {'/foo.css':'/foo-123.css'}});
    assert.strictEqual(s('foo.css'), 'example.com/static/foo-123.css');
    assert.strictEqual(s('/foo.css'), 'example.com/static/foo-123.css');
    done();
});

it('works with url without trailing slash and with a manifest with keys and values without a leading slash', function (done) {
    var s = handlebarsStatic('example.com/static', {manifest: {'foo.css':'foo-123.css'}});
    assert.strictEqual(s('foo.css'), 'example.com/static/foo-123.css');
    assert.strictEqual(s('/foo.css'), 'example.com/static/foo-123.css');
    done();
});

it('throws if file not found in manifest if silenceManifestErrors is false', function (done) {
    var s = handlebarsStatic('example.com/static', {manifest: {}, silenceManifestErrors: false});

    function willThrow() {
        s('foo.css');
    }

    expect(willThrow).to.throw(Error, 'could not be found in the manifest');
    done();
});

it('throws if file not found in manifest if silenceManifestErrors is default', function (done) {
    var s = handlebarsStatic('example.com/static', {manifest: {}});

    function willThrow() {
        s('foo.css');
    }

    expect(willThrow).to.throw(Error, 'could not be found in the manifest');
    done();
});

it('works if file not found in manifest if silenceManifestErrors is true', function (done) {
    var s = handlebarsStatic('example.com/static', {manifest: {}, silenceManifestErrors: true});
    assert.strictEqual(s('foo.css'), 'example.com/static/foo.css');
    assert.strictEqual(s('/foo.css'), 'example.com/static/foo.css');
    done();
});