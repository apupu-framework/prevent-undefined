test( '', ()=>{
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
  expect(()=> preventUndefined( __foo ).hello.world.foo.bar.buz ).toThrow();
});



test( 'test1 : Check if preventUndefined() can work with destructuring.' , ()=>{

  expect(()=>{
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

  }).toThrow( ReferenceError );
});

test( 'test2 : Check if it works with Array.' , ()=>{
  expect(()=>{
    const obj = preventUndefined({
      arr : [1,2,3],
    })[4];
  }).toThrow( ReferenceError );
});


test( 'test3 : Accessing a nesting object with a path.' , ()=>{
  expect(()=>{
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
  }).toThrow( ReferenceError );
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
  expect(()=>{
    try {
      console.error( undefinedlessFunction( hello0 )( obj, obj ) );
    } catch (e) {
      console.error(e);
      throw e;
    }
  }).toThrow( ReferenceError );
});


test( 'Wrapping function (arg0) ... 2' , ()=>{
  expect(()=>{
    try {
      console.error( undefinedlessFunction( hello1 )( obj, obj ) );
    } catch (e) {
      console.error(e);
      throw e;
    }
  }).toThrow( ReferenceError );
});


test( 'Wrapping function (arg0) ... 3' , ()=>{
  const result = undefinedlessFunction( function(hello) { 
    return {
      hello,
      foo : 'bar',
    };
  })();

  expect( ()=>result.barr ).toThrow();
});


test( 'check ignore list `then` (for `Promise`)' , ()=>{
  expect( Promise.resolve( preventUndefined({hello:1})) ).resolves.not.toThrow()
});

test( 'check ignore list `toPostgres` (for `node-postgres`)' , ()=>{
  const __foo = {
    hello : {
      hello : true,
    }
  };
  expect(()=> preventUndefined( __foo ).hello.toPostgres === true ).not.toThrow();
});


test( 'check ignore list `Symbol.search`' , ()=>{
  const __foo = {
    hello : {
      [Symbol.search]: true,
    }
  };
  expect(()=> preventUndefined( __foo ).hello[Symbol.search]===true ).not.toThrow();
});

test( 'check ignore list `$$typeof` (for React.js)' , ()=>{
  const __foo = {
    hello : {
      [Symbol.search]: true,
    }
  };
  expect(()=> preventUndefined( __foo ).hello['$$typeof'] === true ).not.toThrow();
});


test( 'check ignore list `toPostgres` (for `node-postgres`)' , ()=>{
  const __foo = {
    hello : {
      [Symbol.search]: true,
    }
  };
  expect(()=> preventUndefined( __foo ).hello['toPostgres'] === true ).not.toThrow();
});


test( 'check ignore list `@@iterator` (for `React.js`)' , ()=>{
  const __foo = {
    hello : {
      ['@@iterator']: true,
    }
  };
  expect(()=> preventUndefined( __foo ).hello['@@iterator'] === true ).not.toThrow();
});


test( 'errorIfUndefined' , ()=>{
  expect(()=>{
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
      console.error(e);
      throw e;
    }
  }).toThrow(ReferenceError);
});


test( 'errorIfUndefined' , ()=>{
  const o = preventUndefined({
    a : preventUndefined({
      b: 'hello',
    }),
  });

  const o2 = recursivelyUnprevent( o ); 
  expect(()=>o2.hello.foo.bar ).toThrow( );
  expect(()=>o2.NONEXISTENT ).not.toThrow( );
  expect(()=>o2.a.NONEXISTENT ).not.toThrow( );
  expect(()=>o2.a.b).not.toThrow(  );
  expect(()=>o2.a.b.c).not.toThrow(  );
  expect(()=>o2.a.b.c.d).toThrow(  );
});


test( 'preventUnusedProperties' , ()=>{
  const o = preventUndefined({
    a:1,
    b:2,
  });
  expect(()=>{ preventUnusedProperties(o) }).toThrow( 'the fields [a,b] were not referred in\n{\n  "a": 1,\n  "b": 2\n}' );
  console.error( o.a );
  expect(()=>{ preventUnusedProperties(o) }).toThrow( 'the field [b] was not referred in\n{\n  "a": 1,\n  "b": 2\n}' );
  console.error( o.b );
  expect(()=>{ preventUnusedProperties(o) }).not.toThrow( );
});


test( 'preventUnusedProperties for an array' , ()=>{
  const o = preventUndefined(["foo","bar","bum"]);
  expect(()=>{ preventUnusedProperties(o) }).toThrow( 'the fields [0,1,2] were not referred in\n[\n  "foo",\n  "bar",\n  "bum"\n]' );
  console.error( o[0] );
  expect(()=>{ preventUnusedProperties(o) }).toThrow( 'the fields [1,2] were not referred in\n[\n  "foo",\n  "bar",\n  "bum"\n]' );
  console.error( o[1] );
  expect(()=>{ preventUnusedProperties(o) }).toThrow( 'the field [2] was not referred in\n[\n  "foo",\n  "bar",\n  "bum"\n]' );
  console.error( o[2] );
  expect(()=>{ preventUnusedProperties(o) }).not.toThrow( );
});


test( 'sample' , ()=>{
  expect( ()=>{
    function someFunc(args){
      // Prevent undefined on the `args` object before destructuring it.
      args = preventUndefined(args);
      const {foo,bar} = args;

      // After destructured the `args` object, call `preventUnusedProperties()`
      preventUnusedProperties(args);

      console.error("foo:",foo);
      console.error("bar:",bar);
    }

    var foo = 'foo';
    var bar = 'bar';
    var baz = 'baz';
    someFunc({foo,bar,baz});
  }).toThrow(new ReferenceError('the field [baz] was not referred in\n{\n  "foo": "foo",\n  "bar": "bar",\n  "baz": "baz"\n}'));
});



test( 'validator No.1 setting a bad value' , ()=>{
  expect(()=>{
    const validator = (o)=>{
      if ( o.hello === 'yes' ) {
        return true;
      } else {
        return false;
      }
    };

    const obj = preventUndefined({
      hello:'yes',
    }, validator );
    obj.hello = 'A BAD VALUE';

  }).toThrow(ReferenceError);
});


test( 'validator No.2 setting a correct value' , ()=>{
  expect(()=>{
    const validator = (o)=>{
      if ( o.hello === 'yes' ) {
        return true;
      } else {
        return false;
      }
    };

    const obj = preventUndefined({
      hello:'yes',
    }, validator );
    obj.hello = 'yes';

  }).not.toThrow(ReferenceError);
});


test( 'validator No.3 the entry time validation' , ()=>{
  expect(()=>{
    const validator = (o)=>{
      if ( o.hello === 'yes' ) {
        return true;
      } else {
        return false;
      }
    };

    const obj = preventUndefined({
      hello:'aa',
    }, validator );

  }).toThrow(ReferenceError);
});


test( 'validator No.4 the entry time validation' , ()=>{
  expect(()=>{
    const validator = (o)=>{
      if ( o.hello === 'yes' ) {
        return true;
      } else {
        return false;
      }
    };

    const obj = preventUndefined({
      hello:'yes',
    }, validator );

  }).not.toThrow(ReferenceError);
});


test( 'validator No.5 check detecting modifying a nested property' , ()=>{
  expect(()=>{
    const validator = (o)=>{
      if ( o.hello.foo.bar.value === 'yes' ) {
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

  }).toThrow(ReferenceError);
});


test( 'validator No.6 check detecting modifying a nested property to a valid value' , ()=>{
  expect(()=>{
    const validator = (o)=>{
      if ( o.hello.foo.bar.value === 'yes' ) {
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

  }).not.toThrow(ReferenceError);
});


test( 'validator No.7 check detecting deleting a nested property' , ()=>{
  expect(()=>{
    const validator = (o)=>{
      if ( o.hello.foo.bar.value === 'yes' ) {
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
  }).toThrow(ReferenceError);
});



test( 'validator No.8 check detecting deleting a nested property' , ()=>{
  expect(()=>{
    const validator = (o)=>{
      if ( o.hello.foo.bar.value === 'yes' ) {
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

  }).toThrow(ReferenceError);
});


test( 'validator No.9 check detecting throwing inside the validator' , ()=>{
  expect(()=>{
    const validator = (o)=>{
      if ( o.hello.foo.bar.value === 'yes' ) {
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

  }).toThrow(ReferenceError);
});


test( 'sample' , ()=>{
  expect( ()=>{
    const validator = (o)=>typeof o.foo.bar.value === 'number';
    const obj = preventUndefined({
      foo : {
        bar : {
          value : 100,
        },
      }
    },validator);

    obj.foo.bar.value = 'BUMMER! NOT A NUMBER';

  }).toThrow(new ReferenceError(`
detected defining an invalid property value to obj.foo.bar.value on
{
  "foo": {
    "bar": {
      "value": "BUMMER! NOT A NUMBER"
    }
  }
}
    `.trim()));
});



test( 'typesafe' , ()=>{
  expect( ()=>{
    const validator = (o)=>typeof o.foo.bar.value === 'number';
    const obj = typesafe(validator, {
      foo : {
        bar : {
          value : 100,
        },
      }
    });

    obj.foo.bar.value = 'BUMMER! NOT A NUMBER';

  }).toThrow(new ReferenceError(`
detected defining an invalid property value to obj.foo.bar.value on
{
  "foo": {
    "bar": {
      "value": "BUMMER! NOT A NUMBER"
    }
  }
}
    `.trim()));
});




test( 'typesafe No.2 an Example' , ()=>{
  expect( ()=>{
    const t_user = o=>(typeof o.name === 'string') && (typeof o.age ==='number');

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

  }).toThrow(new ReferenceError(`
detected defining an invalid property value to obj.name on
{
  "name": false,
  "age": 23
}
    `.trim()));
});




