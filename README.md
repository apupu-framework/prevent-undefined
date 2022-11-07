 prevent-undefined
=====================

`prevent-undefined` throws an error to let you know that you accidentally refer an undefined propery on your object.

It also displays dump of the refered object for your convenience. See below :

```javascript
const  { preventundefined } = require("prevent-undefined" );
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

```javascript
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

```javascript
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

```javascript
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

```javascript
const  { unprevent } = require("prevent-undefined/common.js");
function proc(o){
  o=unprevent(o);
  return o.hello?.world?.foo?.bar?.baz?.value ?? "hello world";
}
proc(o); // you'll get "hello world" as expected.
```

[optional chaining]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining


 errorIfUndefined()
--------------------------------------------------------------------------------
`errorIfUndefined()` is a perfect fancy decoration to implement
''prevent-undefined way'' of named parameters. When you call `errorIfUndefined()`,
it simply throws ReferenceError(). The its only use case is as following :

```javascript
function strictFunc({foo=errorIfUndefined('foo')}) {
  console.error(foo);
}
strictFunc({ foo_WITH_TYPO: 'foo' });

> ReferenceError: the parameter value of foo was undefined; any reference to an undefined value is strictly prohibited on this object.   
```

`errorIfUndefined` takes only one parameter : `name` which is to specify the name of the parameter.


 recursivelyUnprevent() 
--------------------------------------------------------------------------------
`recursivelyUnprevent()` recursively unprevent the specified object, literally.
Currently `recursivelyUnprevent()` is in the beta state; therefore, please use
this with care. Currently, this does not check any circular references.



 Philosophy Behind the Module `prevent-unprevent`
--------------------------------------------------------------------------------
TODO



 History 
--------------------------------------------------------------------------------

#### v0.2.6 ####
This didn't work; it didn't support common.js.

#### v0.2.7 ####
(may) supports both common.js and es6 module.

Special thanks goes to [How to Create a Hybrid NPM Module for ESM and CommonJS.](https://www.sensedeep.com/blog/posts/2021/how-to-create-single-source-npm-module.html)
This site helped a lot. Thank you very much.

#### v0.2.8 ####
(Fri, 14 Oct 2022 19:53:18 +0900)

Supported unpreventing null
```
unprevent( null ) == null
```

#### v0.2.9 ####
Fixed an issue that it throws TypeError when a symbol property is accessed.

#### v0.2.10 ####
Added keywords to ignore such as toJSON, `Symbol.toStringTag`,
`Symbol.toPrimitive` , etc.

#### v0.2.11 ####
Added `$$typeof` to the ignore keyword list to let `prevent-undefined` work
cooperatively  with `React.js`.

This very informative article [Why Do React Elements Have a $$typeof Property?][$$typeof] 
helped me to understand the problem. Thank you very much.

[$$typeof]: https://overreacted.io/why-do-react-elements-have-typeof-property/ 

#### v0.2.12 ####
`v0.2.11` does not work as an ES6 module due to my carelessness.  The problem
was fixed n this version.

#### v0.2.13 ####
Skipped the version `v0.2.13` via fear of Friday the 13th.  This version have
never been released.

#### v0.2.14 ####
In the version `v0.2.11`, I documented, commented, and tested it without
modifying the actual code.  Believe me, this time I actually modified.

#### v0.2.15 ####
- Added standard well-known symbols to ignore list; they are to added since
  they are likely to be checked as 
```
const i = a[Symbol.iterator];
if (i === undefined ) {
  // ...
}
```

  which is not a preferable behavior for this module.

- Applied automated code generation for tests.


#### v0.2.16 ####
Changed the way to check if the object is a symbol or not.

#### v0.2.17 ####
(Mon, 24 Oct 2022 17:40:53 +0900)

Added '@@iterator' to the ignore list in order to avoid an issue that will
occur when use this module with `React.js`.

#### v0.2.18 ####
(Thu, 03 Nov 2022 17:11:29 +0900)
Removed a unnecessarily left unremoved debug logging output.

#### v0.2.19 ####
(Mon, 07 Nov 2022 16:17:06 +0900)
Added recursivelyUnprevent() and errorIfUndefined()



 Conclusion
--------------------------------------------------------------------------------
That's all. Thank you very much.


