import { preventUndefined, isUndefinedPrevented, undefinedlessFunction, recursivelyUnprevent, preventUnusedProperties, typesafe, errorIfUndefined, } from './index.mjs' ;
import { schema } from 'vanilla-schema-validator';
import assert from 'node:assert/strict';
import { test, describe, it, before, after } from 'node:test';


describe('test of test', ()=>{
  it('as 1',()=>{
    assert.throws( ()=>{
      throw new Error( 'foo' );
    }, Error,'foo' );
  });

  it('as 2', ()=>{
    assert.equal( 'foo', 'foo' );
  });

  it( 'as 3', ()=>{
    assert.throws( ()=>{
      throw new ReferenceError( 'aaa\naaa' );
    }, ReferenceError, 'aaa\naaa' );
  });
});

// let count = 0;
// const s_test=(name,fn )=>{
// //  if ( ++count < 17 ) {
// //    return test( name.replaceAll(/[^\x00-\x7F]/gm, " "), fn );
// //  }
// //    return test( name.replaceAll(/[^\x00-\x7F]/gm, " "), fn );
//   return test( name, fn );
// };

test( 'basic test', ()=>{
  const __foo = {
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
  assert.throws(()=> preventUndefined( __foo ).hello.world.foo.bar.buz );
});


test( 'test1 - Check if preventUndefined() can work with destructuring' , ()=>{

  assert.throws(()=>{
    const obj = preventUndefined({
      foo : 'foo',
      bar : 'bar',
    });
    // console.log({obj}) ;

    const {
      foo = 'foo',
      bar = 'bar',
      bum = 'uh oh!',
    } = obj;

  },  ReferenceError );
});

test( 'test2 - Check if it works with Array' , ()=>{
  assert.throws(()=>{
    const obj = preventUndefined({
      arr : [1,2,3],
    })[4];
  },  ReferenceError );
});


test( 'test3 - Accessing a nesting object with a path' , ()=>{
  assert.throws(()=>{
    const obj = preventUndefined({
      hello : 'hello',
      world : 'world',
      foo : {
        hello : 'hello',
        world : 'world',
        bar : {
          hello : 'hello',
          world : 'world',
          baz   : {
          },
        }
      }
    });
    console.log( obj.foo.bar.baz.bum );
  },  ReferenceError );
});


  const obj = {
    hello : 'hello',
    world : 'world',
    foo : {
      hello : 'hello',
      world : 'world',
      bar : {
        hello : 'hello',
        world : 'world',
        baz   : {
          boo : ''
        },
      }
    }
  };
  function hello0(obj0,obj1) {
    return ( obj0.foo.bar.baz.bum );
  }
  function hello1(obj0,obj1) {
    return ( obj1.foo.bar.baz.bum );
  }

test( 'Wrapping function (arg0) ... 1' , ()=>{
  assert.throws(()=>{
    try {
      console.log( undefinedlessFunction( hello0 )( obj, obj ) );
    } catch (e) {
      throw e;
    }
  },  ReferenceError );
});


test( 'Wrapping function (arg0) ... 2' , ()=>{
  assert.throws(()=>{
    try {
      console.log( undefinedlessFunction( hello1 )( obj, obj ) );
    } catch (e) {
      throw e;
    }
  },  ReferenceError );
});


test( 'Wrapping function (arg0) ... 3' , ()=>{
  const result = undefinedlessFunction( function(hello) {
    return {
      hello,
      foo : 'bar',
    };
  })();

  assert.throws( ()=>result.barr );
});


test( 'check ignore list `then` (for `Promise`)' , ()=>{
  assert.doesNotReject( Promise.resolve( preventUndefined({hello:1})) );
});

test( 'check ignore list `toPostgres` (for `node-postgres`)' , ()=>{
  const __foo = {
    hello : {
      hello : true,
    }
  };
  assert.doesNotThrow(()=> preventUndefined( __foo ).hello.toPostgres === true );
});


test( 'check ignore list `Symbol.search`' , ()=>{
  const __foo = {
    hello : {
      [Symbol.search]: true,
    }
  };
  assert.doesNotThrow(()=> preventUndefined( __foo ).hello[Symbol.search]===true );
});

test( 'check ignore list `$$typeof` (for React.js)' , ()=>{
  const __foo = {
    hello : {
      [Symbol.search]: true,
    }
  };
  assert.doesNotThrow(()=> preventUndefined( __foo ).hello['$$typeof'] === true );
});


test( 'check ignore list `toPostgres` (for `node-postgres`)' , ()=>{
  const __foo = {
    hello : {
      [Symbol.search]: true,
    }
  };
  assert.doesNotThrow(()=> preventUndefined( __foo ).hello['toPostgres'] === true );
});


test( 'check ignore list `@@iterator` (for `React.js`)' , ()=>{
  const __foo = {
    hello : {
      ['@@iterator']: true,
    }
  };
  assert.doesNotThrow(()=> preventUndefined( __foo ).hello['@@iterator'] === true );
});


test( 'errorIfUndefined 1' , ()=>{
  assert.throws(()=>{
    try{
      ((
        {
          hello = errorIfUndefined('hello'),
        }
      )=>'result')(
        {
          hello_TYPO: 'hello',
        }
      )
    } catch (e){
      throw e;
    }
  }, ReferenceError);
});


test( 'errorIfUndefined 2' , ()=>{
  const o = preventUndefined({
    a : preventUndefined({
      b: 'hello',
    }),
  });

  const o2 = recursivelyUnprevent( o );
  assert.throws(()=>o2.hello.foo.bar );
  assert.doesNotThrow(()=>o2.NONEXISTENT  );
  assert.doesNotThrow(()=>o2.a.NONEXISTENT  );
  assert.doesNotThrow(()=>o2.a.b  );
  assert.doesNotThrow(()=>o2.a.b.c  );
  assert.doesNotThrow(()=>o2.a.b.c  );
});


//
// SKIPPED DUE TO PROBABLY NODE:TEST BUG
// https://github.com/nodejs/node/issues/46508
//
describe( 'preventUnusedProperties', ()=>{
  it( 'preventUnusedProperties' , ()=>{
    const o = preventUndefined({
      a:1,
      b:2,
    });
    assert.throws( ()=>{ preventUnusedProperties(o) }, ReferenceError, 'the fields [a,b] were not referred in\n{\n  "a": 1,\n  "b": 2\n}' );
    console.log( o.a );
    assert.throws( ()=>{ preventUnusedProperties(o) }, ReferenceError, 'the field [b] was not referred in\n{\n  "a": 1,\n  "b": 2\n}' );
    console.log( o.b );
    assert.doesNotThrow(()=>{ preventUnusedProperties(o) } );
  });


  it( 'preventUnusedProperties for an array' , ()=>{
    const o = preventUndefined(["foo","bar","bum"]);
    assert.throws(()=>{ preventUnusedProperties(o) }, ReferenceError, 'the fields [0,1,2] were not referred in\n[\n  "foo",\n  "bar",\n  "bum"\n]'  );
    console.log( o[0] );
    assert.throws(()=>{ preventUnusedProperties(o) }, ReferenceError, 'the fields [1,2] were not referred in\n[\n  "foo",\n  "bar",\n  "bum"\n]'  );
    console.log( o[1] );
    assert.throws(()=>{ preventUnusedProperties(o) }, ReferenceError, 'the field [2] was not referred in\n[\n  "foo",\n  "bar",\n  "bum"\n]'  );
    console.log( o[2] );
    assert.doesNotThrow(()=>{ preventUnusedProperties(o) });
  });
});


test( 'sample' , ()=>{
  assert.throws( ()=>{
    function someFunc(args){
      // Apply preventUndefined() on the `args` before destructuring it.
      args = preventUndefined(args);
      const {foo,bar} = args;

      // After destructured the `args` object, call `preventUnusedProperties()`
      preventUnusedProperties(args);

      console.log("foo:",foo);
      console.log("bar:",bar);
    }

    var foo = 'foo';
    var bar = 'bar';
    var baz = 'baz';
    someFunc({foo,bar,baz});
  }, ReferenceError,  'the field [baz] was not referred in\n{\n  "foo": "foo",\n  "bar": "bar",\n  "baz": "baz"\n}' );
});



test( 'validator No.1 setting a bad value' , ()=>{
  assert.throws(()=>{
    const validator = (o)=>{
      if ( o?.hello === 'yes' ) {
        return true;
      } else {
        return false;
      }
    };

    const obj = preventUndefined({
      hello:'yes',
    }, validator );
    obj.hello = 'A BAD VALUE';

  },TypeError);
});


test( 'validator No.2 setting a correct value' , ()=>{
  assert.doesNotThrow(()=>{
    const validator = (o)=>{
      if ( o?.hello === 'yes' ) {
        return true;
      } else {
        return false;
      }
    };

    const obj = preventUndefined({
      hello:'yes',
    }, validator );
    obj.hello = 'yes';

  }, TypeError);
});


test( 'validator No.3 the entry time validation' , ()=>{
  assert.throws(()=>{
    const validator = (o)=>{
      if ( o?.hello === 'yes' ) {
        return true;
      } else {
        return false;
      }
    };

    const obj = preventUndefined({
      hello:'aa',
    }, validator );

  }, TypeError);
});


test( 'validator No.4 the entry time validation' , ()=>{
  assert.doesNotThrow(()=>{
    const validator = (o)=>{
      if ( o?.hello === 'yes' ) {
        return true;
      } else {
        return false;
      }
    };

    const obj = preventUndefined({
      hello:'yes',
    }, validator );

  }, TypeError);
});


test( 'validator No.5 check detecting modifying a nested property' , ()=>{
  assert.throws(()=>{
    const validator = (o)=>{
      if ( o?.hello?.foo?.bar?.value === 'yes' ) {
        return true;
      } else {
        return false;
      }
    };

    const obj = preventUndefined({
      hello: {
        foo : {
          bar : {
            value : 'yes',
          },
        },
      },
    }, validator );

    obj.hello.foo.bar.value = 'a wrong value';

  }, TypeError);
});


test( 'validator No.6 check detecting modifying a nested property to a valid value' , ()=>{
  assert.doesNotThrow(()=>{
    const validator = (o)=>{
      if ( o?.hello?.foo?.bar?.value === 'yes' ) {
        return true;
      } else {
        return false;
      }
    };

    const obj = preventUndefined({
      hello: {
        foo : {
          bar : {
            value : 'yes',
          },
        },
      },
    }, validator );

    obj.hello.foo.bar.value = 'yes';

  }, TypeError);
});


test( 'validator No.7 check detecting deleting a nested property' , ()=>{
  assert.throws(()=>{
    const validator = (o)=>{
      if ( o?.hello?.foo?.bar?.value === 'yes' ) {
        return true;
      } else {
        return false;
      }
    };

    const obj = preventUndefined({
      hello: {
        foo : {
          bar : {
            value : 'yes',
          },
        },
      },
    }, validator );

    Object.defineProperty( obj.hello.foo.bar,'value', {
      value:'a bad value',
    });
  }, TypeError);
});



test( 'validator No.8 check detecting deleting a nested property' , ()=>{
  assert.throws(()=>{
    const validator = (o)=>{
      if ( o?.hello?.foo?.bar?.value === 'yes' ) {
        return true;
      } else {
        return false;
      }
    };

    const obj = preventUndefined({
      hello: {
        foo : {
          bar : {
            value : 'yes',
          },
        },
      },
    }, validator );

    delete obj.hello.foo.bar.value;

  }, TypeError );
});


test( 'validator No.9 check detecting throwing inside the validator' , ()=>{
  assert.throws(()=>{
    const validator = (o)=>{
      if ( o?.hello?.foo?.bar?.value === 'yes' ) {
        return true;
      } else {
        return false;
      }
    };

    const obj = preventUndefined({
      HELLO: {
        FOO : {
          BAR : {
            value : 'yes',
          },
        },
      },
    }, validator );

  }, TypeError );
});


function cropStacktrace(e) {
  const result = /\[stacktrace\]/g.exec( e.message );
  // console.log( result );
  if ( result && 0<=result.index ) {
   e.message = e.message.substring( 0, result.index ).trim();
  }
  // console.log(e.message);
  return e;
}
function protectByCroppingStacktrace(f){
  return ()=>{
    try{
      f();
    } catch(e){
      throw cropStacktrace(e);
    }
  };
}


test( 'sample' , ()=>{
  assert.throws( protectByCroppingStacktrace(()=>{
    const validator = (o)=>typeof o?.foo?.bar?.value === 'number';
    const obj = preventUndefined({
      foo : {
        bar : {
          value : 100,
        },
      }
    },validator);

    obj.foo.bar.value = 'BUMMER! NOT A NUMBER';

  }), TypeError , `
[prevent-undefined] detected defining an invalid property value to obj.foo.bar.value on
{
  "foo": {
    "bar": {
      "value": "BUMMER! NOT A NUMBER"
    }
  }
}
validator
(o)=>typeof o?.foo?.bar?.value === 'number'
    `.trim());
});



test( 'typesafe' , ()=>{
  assert.throws( protectByCroppingStacktrace(()=>{
    const validator = (o)=>typeof o?.foo?.bar?.value === 'number';
    const obj = typesafe(validator, {
      foo : {
        bar : {
          value : 100,
        },
      }
    });

    obj.foo.bar.value = 'BUMMER! NOT A NUMBER';

  }), TypeError , (`
[prevent-undefined] detected defining an invalid property value to obj.foo.bar.value on
{
  "foo": {
    "bar": {
      "value": "BUMMER! NOT A NUMBER"
    }
  }
}
validator
(o)=>typeof o?.foo?.bar?.value === 'number'
    `.trim()));
});



test( 'typesafe No.2 an Example' , ()=>{
  assert.throws( protectByCroppingStacktrace(()=>{
    const t_user = o=>(typeof o?.name === 'string') && (typeof o?.age ==='number');

    function check_user({user}) {
      user = typesafe( t_user, user );
    // Setting a wrong value causes throwing an error.
      user.name = false;
      return user;
    }

    check_user({
      user:{
        name : 'John',
        age : 23
      }
    });
  }), TypeError ,(`
[prevent-undefined] detected defining an invalid property value to obj.name on
{
  "name": false,
  "age": 23
}
validator
o=>(typeof o?.name === 'string') && (typeof o?.age ==='number')
    `.trim()));
});



describe('onError',()=>{
  it( 'as onError test No.1' , ()=>{
    return new Promise((resolve,reject)=>{

      let flag = null;
      let err = null;

      const validator = o=>(typeof o?.name === 'string') && (typeof o?.age ==='number');
      const onError = ()=>{
        flag = true;
      };

      function check_user({user}) {
        user = preventUndefined( user, { validator, onError });
        // Setting a wrong value causes throwing an error.
        user.name = false;
        return user;
      }

      try{
        check_user({
          user:{
            name : 'John',
            age : 23
          }
        });
      } catch(e){
        err = e;
      }

      setTimeout( ()=>{
        if (
          ( flag === true ) &&
          ( err !=null ) &&
          ( err instanceof TypeError )
        ) {
          resolve();
        } else {
          resolve();
          reject();
        }
      }, 200 );

    });
  });


  it( 'as onError test No.2' , ()=>{
    return new Promise((resolve,reject)=>{

      let flag = null;
      let err = null;

      const validator = o=>(typeof o?.name === 'string') && (typeof o?.age ==='number');
      const onError = ()=>{
        flag = true;
      };

      function check_user({user}) {
        user = preventUndefined( user, { validator, onError });
        // Setting a wrong value causes throwing an error.
        const val =  user.WRONG_PROP;
        return user;
      }

      try{
        check_user({
          user:{
            name : 'John',
            age : 23
          }
        });
      } catch(e){
        err = e;
      }

      setTimeout( ()=>{
        if (
          ( flag === true ) &&
          ( err !=null ) &&
          ( 0<= err.message.indexOf( '[prevent-undefined]' ) )
        ) {
          resolve();
        } else {
          reject(`flag=${flag} err=${err}`);
        }
      }, 200 );

    });
  });
});

/*
 * TODO test all properties of the argument of `onError()`
 */


// test( 'onError example', ()=>{
//   const obj = preventUndefined({
//     foo: 'foo',
//     bar: 'bar',
//   }, {
//     onError: (info)=>{
//       console.log( 'called ' + info.propPath );
//     }
//   });
//
//   console.log( obj.wrongProp );
//
// });




test( 'automatic unprevent for functions', ()=>{
  const o = preventUndefined({
    foo : {
      bar : {
        func : function foo_bar_func() {
          return isUndefinedPrevented( this );
        },
      },
    },
  });

  console.log( o.foo.bar      );
  console.log( o.foo.bar.func );

  assert.equal( o.foo.bar.func() , false );
});



test( 'automatically unprevent for functions', ()=>{
  const o = preventUndefined({
    foo : {
      bar : {
        func : function foo_bar_func() {
          console.log(
            `this[Symbol.for('__IS_PREVENTED_UNDEFINED__')]`,
             this[Symbol.for('__IS_PREVENTED_UNDEFINED__')] ,
            ' ^^^ should be undefined ^^^' ,
          );
          return !! this[Symbol.for('__IS_PREVENTED_UNDEFINED__')];
        },
      },
    },
  });

  console.log( o.foo.bar      );
  console.log( o.foo.bar.func );

  assert.equal( o.foo.bar.func() , false );
});

// ADDED ON (Thu, 05 Jan 2023 14:18:29 +0900)
test( 'non-writable and non-configurable ', ()=>{
  const target ={};
  const test_content  = {
    foo : {
      bar : {
        func : function fooo_bar_func() {
          return 'foo_bar';
        }
      }
    }
  };

  Object.defineProperty( target ,'hello', {
    value : test_content,
    writable     : false,
    configurable : false,
  });

  const  obj = preventUndefined( target );
  assert.equal( obj.hello.foo.bar.func() , 'foo_bar' );

});


// ADDED ON (Thu, 05 Jan 2023 15:12:03 +0900) ignore function.prototype
test( 'ignore functions in order to (mostly) unprevent `prototype` ', ()=>{
  function target() {
  }
  const  obj = preventUndefined( target );
  assert.equal( !! obj.prototype[ Symbol.for('__IS_PREVENTED_UNDEFINED__') ] , false );
});



{
  const obj = {
    foo: {
      bar : {
        baz :{
          data:1
        },
      },
    },
  };

  test( 'maxRecursiveLevel ... base ', ()=>{
    const po = preventUndefined( obj );
    assert.equal( isUndefinedPrevented( po.foo         ), true );
    assert.equal( isUndefinedPrevented( po.foo.bar     ), true );
    assert.equal( isUndefinedPrevented( po.foo.bar.baz ), true );
  });

  test( 'maxRecursiveLevel ...0 ', ()=>{
    const po = preventUndefined( obj, {maxRecursiveLevel:0 }  );
    assert.equal( isUndefinedPrevented( po             ), false );
    assert.equal( isUndefinedPrevented( po.foo         ), false );
    assert.equal( isUndefinedPrevented( po.foo.bar     ), false );
    assert.equal( isUndefinedPrevented( po.foo.bar.baz ), false );
  });

  test( 'maxRecursiveLevel ...1 ', ()=>{
    const po = preventUndefined( obj, {maxRecursiveLevel:1 }  );
    assert.equal( isUndefinedPrevented( po             ), true  );
    assert.equal( isUndefinedPrevented( po.foo         ), false );
    assert.equal( isUndefinedPrevented( po.foo.bar     ), false );
    assert.equal( isUndefinedPrevented( po.foo.bar.baz ), false );
  });

  test( 'maxRecursiveLevel ...2 ', ()=>{
    const po = preventUndefined( obj, {maxRecursiveLevel:2 }  );
    assert.equal( isUndefinedPrevented( po             ), true  );
    assert.equal( isUndefinedPrevented( po.foo         ), true  );
    assert.equal( isUndefinedPrevented( po.foo.bar     ), false );
    assert.equal( isUndefinedPrevented( po.foo.bar.baz ), false );
  });

  test( 'maxRecursiveLevel ...3 ', ()=>{
    const po = preventUndefined( obj, {maxRecursiveLevel:3 }  );
    assert.equal( isUndefinedPrevented( po             ), true  );
    assert.equal( isUndefinedPrevented( po.foo         ), true  );
    assert.equal( isUndefinedPrevented( po.foo.bar     ), true  );
    assert.equal( isUndefinedPrevented( po.foo.bar.baz ), false );
  });
}



// {
//   const __IS_PREVENTED_UNDEFINED__               = Symbol.for( '__IS_PREVENTED_UNDEFINED__' );
//
//   test( 'inherit proxy class test 1', ()=>{
//     /*
//      * Check if it works properly even if the parent class of a class is
//      * protected by preventUndefined().
//      */
//     class A {
//       constructor() {
//         this.a=1;
//       }
//       static getClassName() {
//         return this.name;
//       }
//     }
//
//     assert.equal( A.getClassName() , 'A' );
//
//     const PA = preventUndefined( A );
//
//     assert.equal( PA.getClassName() , 'A' );
//
//     class PB extends PA {
//       constructor(){
//         super();
//       }
//     }
//
//     console.log( isUndefinedPrevented( A ) );
//     console.log( isUndefinedPrevented( PA ) );
//
//
//     assert.equal( isUndefinedPrevented( A  ) ,false);
//     assert.equal( isUndefinedPrevented( PA ) ,true);
//     assert.equal( isUndefinedPrevented( PB ) ,false);
//
//     // This value `true` comes from A class. There is no way to intercept
//     // accessing fields to get own values of objects in JavaScript.
//     assert.equal( PB[ __IS_PREVENTED_UNDEFINED__ ] , true );
//
//     assert.equal( isUndefinedPrevented( PB ) , false );
//
//     assert.equal( PB.getClassName() , 'PB' );
//   });
// }
//


test( 'test 2', ()=>{
  const arr = preventUndefined( [3,2,1,0] );

  assert.doesNotThrow( ()=>{
    const arr2= [ ...arr ];
    console.log(arr2);
  });

});


test( 'not to accept a validator factory as a validator', ()=>{
  assert.throws( ()=>{
    try {
      preventUndefined( [3,2,1,0] , ()=>()=>true );
    } catch ( e ) {
      throw e;
    }
  }, TypeError , (
      'Your validator returned a function. Check your code. ' +
      'The bet is, you forgot to invoke your validator factory.') );

  assert.doesNotThrow( ()=>{
    try {
      preventUndefined( [3,2,1,0] , ()=>true );
    } catch ( e ) {
      console.error(e);
      throw e;
    }
  } );
});


test( 'test array ', ()=>{
  const arr = preventUndefined( [0,1,2,[0,1,2]] );

  assert.throws( ()=>{
    console.log( arr[3][4] );
  });
});



describe('new message', ()=>{
  it( 'as 1', ()=>{
    const __foo = {
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

    try {
      preventUndefined( __foo ).hello.world.foo.bar.BAZ
    } catch ( e ){
      console.error( 'as 1', e );
    }
  });

  it( 'as 2', ()=>{
    const __foo = {
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

    schema.define`
      foo1 : object(
        hello : object(
          world : object(
            foo : object(
              bar : object(
                baz : string()))))),
      foo2 : object(
        hello : object(
          world : object(
            foo : object(
              bar : object(
                baz : number()))))),
    `;

    try {
      preventUndefined( __foo, schema.foo2() );
    } catch ( e ){
      console.error( 'as 2', e );
    }
  });


});


