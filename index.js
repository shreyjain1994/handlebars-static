"use strict";

/**
 * @param {string} url - The URL that will be attached to the front of all links to static resources.
 * @param {Object.<string, string>} [options.manifest]
 * @param {boolean} [options.silenceManifestErrors=false]
 * @returns {Function}
 */
module.exports = function (url, options) {

    var manifest = options.manifest;
    var silenceManifestErrors = options.silenceManifestErrors;

    //default value
    if (silenceManifestErrors === undefined) {
        silenceManifestErrors = false;
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
            if (!link && !silenceManifestErrors){
                throw new Error('Link for ' + staticAsset + ' could not be found in the manifest.');
            }
        }

        if (link.charAt(0) === '/')
            return url + link.slice(1);
        else
            return url + link;
    }
};