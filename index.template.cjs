params: body
'use strict'
const  { trace_validator } = require("vanilla-schema-validator");

// const util = require('util');
function inspect(s) {
  return JSON.stringify(
    s,
    (k,v)=>{
      switch(v) {
        case undefined :
          return "__CONST_UNDEFINED_CONST__"
        default:
            return v;
      }
    }, 2
  )?.replace?.( /"__CONST_UNDEFINED_CONST__"/g, "undefined" ) ?? "undefined";
  // return JSON.stringify( s, null, 2 );
  // // return util.inspect( s, {
  // //   depth:null,
  // //   // colors:true,
  // // });
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
