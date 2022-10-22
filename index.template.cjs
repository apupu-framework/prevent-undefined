params: body
'use strict'

const util = require('util');
function inspect(s) {
  return util.inspect( s, {
    depth:null,
    // colors:true,
  });
}

<%=body %>

module.exports.preventUndefined      = preventUndefined;
module.exports.undefinedlessFunction = undefinedlessFunction;
module.exports.unprevent = unprevent;

