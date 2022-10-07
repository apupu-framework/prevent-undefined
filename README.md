 prevent-undefined
=====================

`prevent-undefined` throws an error to let you know that you accidentally refer an undefined propery on your object.

It also displays dump of the refered object for your convenience. See below :

```
import { preventUndefined } from "prevent-undefined";

// foo.js
  const someObj = {
    hello : {
      world : {
        foo : {
          bar : {
            muz : "HELLO",
          },
        }
      }
    }
  };

  preventUndefined( someObj ).hello.world.foo.bar.buz;
  //                                 SOME TYPO    ^^^
```

```
> node foo.js
ReferenceError: obj.hello.world.foo.bar.buz is not defined in {
  hello: {
    world: { foo: { bar: { muz: 'HELLO' } } }
  }
}
```

In case you prefer CommonJS modules, 
```
const {preventUndefined} = require("prevent-undefined/common.js");
```


That's all.


