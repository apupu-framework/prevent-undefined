params: body
'use strict'
import { trace_validator } from "vanilla-schema-validator";

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
  ).replace( /"__CONST_UNDEFINED_CONST__"/g, "undefined" ) ;
}





<%=body%>


export {
  preventUndefined ,
  isUndefinedPrevented,
  undefinedlessFunction,
  unprevent,
  recursivelyUnprevent,
  preventUnusedProperties,
  typesafe,
  rtti,
  errorIfUndefined,
};
