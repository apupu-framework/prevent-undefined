
import { preventUndefined, undefinedlessFunction } from './index.mjs' ;


class PruError extends ReferenceError {
  constructor(message ) {
    super(message);
  }
}


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



