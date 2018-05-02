/**
 * Author: Digvijay Singh
 */

"use strict";

exports.validateEmail = function(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
};
