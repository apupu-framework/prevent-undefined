 prevent-undefined
=====================

`prevent-undefined` throws an error to let you know that you accidentally refer an undefined propery on your object.

It also displays dump of the refered object for your convenience. See below :

```
const  { preventundefined } = require("prevent-undefined/common.js");
// or
import { preventUndefined } from "prevent-undefined";

// foo.js
  const someObj = {
    hello : {
      world : {
        foo : {
          bar : {
            baz : "HELLO",
          },
        }
      }
    }
  };

  preventUndefined( someObj ).hello.world.foo.bar.VAZ;
  //                                 SOME TYPO    ^^^
```

then, you'll get:

```
> node foo.js
ReferenceError: obj.hello.world.foo.bar.VAZ is not defined in {
  hello: {
    world: { foo: { bar: { baz: 'HELLO' } } }
  }
}
```

 Unprevent 
--------------------------------------------------------------------------------


Sometimes, you will want to unprevent your objects especially when you want to
use [optional chaining][]:

```
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

function proc(o){
  return o.hello?.world?.foo?.bar?.baz?.value ?? "hello world";
}
proc(o);
```
you'll get

```
ReferenceError: obj.hello.world.foo.bar.baz.value is not defined in {
  hello: {
    world: {
      foo: { bar: { baz: { message: 'HELLO' } } }
    }
  }
}
    at Object.get (/.../common.js:91:17)
```

which you definitely don't want.

Use `unprevent()`

```
const  { unprevent } = require("prevent-undefined/common.js");
function proc(o){
  o=unprevent(o);
  return o.hello?.world?.foo?.bar?.baz?.value ?? "hello world";
}
proc(o); // you'll get "hello world" as expected.
```

[optional chaining]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining


That's all.


