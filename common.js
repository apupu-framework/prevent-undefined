'use strict'

const util = require('util');
function inspect(s) {
  return util.inspect( s, {
    depth:null,
    colors:true,
  });
}

function searchRootState( currState ) {
  if ( currState.isRootState ) {
    return currState;
  } else { 
    return searchRootState( currState.parentState );
  }
}


const AsyncFunction = (async function () {}).constructor;
function isBuiltIn( t ) {
  if ( t == null ) return false;
  return (
       ( t.__IS_PREVENTED_UNDEFINED__ )
    || ( t instanceof Date    )
    || ( t instanceof Number  )
    || ( t instanceof BigInt  )
    // || ( t instanceof Math    )
    || ( t instanceof String  )
    || ( t instanceof Boolean )
    || ( t instanceof RegExp  )
    || ( t instanceof Symbol  )
    || ( t instanceof Error   )
    || ( t instanceof Map     )
    || ( t instanceof Set     )
    || ( t instanceof WeakMap )
    || ( t instanceof WeakSet )
    || ( t instanceof ArrayBuffer )
    || ( t instanceof SharedArrayBuffer )
    // || ( t instanceof Atomics )
    || ( t instanceof DataView )
    // || ( t instanceof JSON )
    || ( t instanceof Promise )
    // || ( t instanceof Generator )
    // || ( t instanceof GeneratorFunction )
    // || ( t instanceof AsyncFunction )
    // || ( t instanceof AsyncGenerator )
    // || ( t instanceof AsyncGeneratorFunction )
    // || ( t instanceof Reflect )
    // || ( t instanceof Proxy )
  );
};

module.exports.preventUndefined = function preventUndefined(argTarget, argState){
  const currTarget = argTarget;
  const currState = {
    isRootState:true,
    parentState : null,
    currTarget  : currTarget,
    propPath : [],
    excludes : (n)=>0<=[ 'toJSON', 'toPostgres','then' ].indexOf(n),
    ...argState,
  };

  if (( typeof currTarget === 'object') && currTarget !== null && ( ! isBuiltIn( currTarget ) ) ) {
    const currHandler = {
      get(...args) {
        const [target, prop, receiver] = args;
        if ( prop === '__UNPREVENT__' ) {
          return currTarget;
        }
        if ( prop === '__IS_PREVENTED_UNDEFINED__' ) {
          return true;
        }

        const nextTarget = Reflect.get(...arguments);

        const nextState = {
          ...currState,
          isRootState : false,
          parentState : currState,
          currTarget  : nextTarget,
          propPath   : [ ...currState.propPath, prop ],
        };

        if ( ( typeof nextTarget === 'undefined') && ! currState.excludes( prop ) ) {

          const dump = inspect(  searchRootState( currState ).currTarget );
          const propPathStr = 'obj.' + nextState.propPath.join('.') ;
          // console.error( propPathStr , 'is not defined in' , dump );
          throw new ReferenceError( propPathStr + ' is not defined in ' + dump );
        } else {
          return preventUndefined( nextTarget, nextState );
        }
      },
    };

    return new Proxy( currTarget, currHandler );

  } else {
    return currTarget;
  }
}

module.exports.undefinedlessFunction = function undefinedlessFunction( fn ) {
  return new Function( 'fn','preventUndefined', `
    return function ${fn.name}Wrapper(...args) {
      const __args = args.map( (e)=>preventUndefined(e) );
      return preventUndefined( fn.apply( this, __args ) );
    };
  `)(fn,module.exports.preventUndefined);
}

