params: body
'use strict'
const {vali_to_string} = require('vanilla-schema-validator');

const util = require('util');
function inspect(s) {
  return JSON.stringify( s, null, 2 );
  // return util.inspect( s, {
  //   depth:null,
  //   // colors:true,
  // });
}

<%=body %>


module.exports.preventUndefined        = preventUndefined;
module.exports.isUndefinedPrevented    = isUndefinedPrevented;
module.exports.undefinedlessFunction   = undefinedlessFunction;
module.exports.unprevent               = unprevent;
module.exports.recursivelyUnprevent    = recursivelyUnprevent;
module.exports.preventUnusedProperties = preventUnusedProperties;
module.exports.typesafe                = typesafe;
module.exports.rtti                    = rtti;
module.exports.errorIfUndefined        = errorIfUndefined;
