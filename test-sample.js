
const { preventUndefined } = require('./common.js');
const someObj = {
  hello : {
    world : {
      foo : {
        bar : {
          baz : {
            message : "HELLO",
          }
        },
      }
    }
  }
};
const o = preventUndefined( someObj );

const { unprevent } = require('./common.js');
function proc(o){
  o=unprevent(o);
  return o.hello?.world?.foo?.bar?.baz?.value ?? "hello world";
}
console.error( proc(o) );

