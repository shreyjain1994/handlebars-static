"use strict";

/**
 * @param {string} url - The URL that will be attached to the front of all links to static resources.
 * @param {object} [options]
 * @param {Object.<string, string>} [options.manifest]
 * @param {boolean} [options.silenceManifestErrors=false]
 * @returns {Function}
 */
module.exports = function (url, options) {

    options = options || {};
    var manifest = options.manifest;
    var silenceManifestErrors = options.silenceManifestErrors;

    //default values
    if (silenceManifestErrors === undefined) {
        silenceManifestErrors = false;
    }

    //type checking
    //better to type check now and raise errors, since this will happen as soon as the helper is added to handlebars
    //if we don't type check now, errors will only be obvious when handlebar templates are actually compiled
    if (typeof url !== 'string' && !(url instanceof String)) {
        throw new Error('url must be a string.');
    }
    if (typeof silenceManifestErrors !== 'boolean') {
        throw new Error('options.silenceManifestErrors must be a boolean.');
    }
    if (manifest !== undefined && (manifest === null || typeof manifest !== 'object')) {
        throw new Error('options.manifest must be an object.')
    }

    var useManifest = !!manifest;

    //add trailing slash
    url = url.charAt(url.length - 1) === '/' ? url : url + '/';

    return function (staticAsset) {

        //saved to a new variable so that if using the manifest results in an error,
        //the exception will be able to indicate the staticAsset that caused problems
        var link = staticAsset;

        if (useManifest) {
            link = manifest[link];
            if (!link && !silenceManifestErrors) {
                throw new Error('Link for ' + staticAsset + ' could not be found in the manifest.');
            }
        }

        if (link.charAt(0) === '/')
            return url + link.slice(1);
        else
            return url + link;
    }
};