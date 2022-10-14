'use strict'

function inspect(s) {
  return JSON.stringify( s );
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
    || ( ( typeof Date                   === 'function' ) && ( t instanceof Date                    ) )
    || ( ( typeof Number                 === 'function' ) && ( t instanceof Number                  ) )
    || ( ( typeof BigInt                 === 'function' ) && ( t instanceof BigInt                  ) )
    || ( ( typeof Math                   === 'function' ) && ( t instanceof Math                    ) )
    || ( ( typeof String                 === 'function' ) && ( t instanceof String                  ) )
    || ( ( typeof Boolean                === 'function' ) && ( t instanceof Boolean                 ) )
    || ( ( typeof RegExp                 === 'function' ) && ( t instanceof RegExp                  ) )
    || ( ( typeof Symbol                 === 'function' ) && ( t instanceof Symbol                  ) )
    || ( ( typeof Error                  === 'function' ) && ( t instanceof Error                   ) )
    || ( ( typeof Map                    === 'function' ) && ( t instanceof Map                     ) )
    || ( ( typeof Set                    === 'function' ) && ( t instanceof Set                     ) )
    || ( ( typeof WeakMap                === 'function' ) && ( t instanceof WeakMap                 ) )
    || ( ( typeof WeakSet                === 'function' ) && ( t instanceof WeakSet                 ) )
    || ( ( typeof ArrayBuffer            === 'function' ) && ( t instanceof ArrayBuffer             ) )
    || ( ( typeof SharedArrayBuffer      === 'function' ) && ( t instanceof SharedArrayBuffer       ) )
    || ( ( typeof Atomics                === 'function' ) && ( t instanceof Atomics                 ) )
    || ( ( typeof DataView               === 'function' ) && ( t instanceof DataView                ) )
    || ( ( typeof JSON                   === 'function' ) && ( t instanceof JSON                    ) )
    || ( ( typeof Promise                === 'function' ) && ( t instanceof Promise                 ) )
    || ( ( typeof Generator              === 'function' ) && ( t instanceof Generator               ) )
    || ( ( typeof GeneratorFunction      === 'function' ) && ( t instanceof GeneratorFunction       ) )
    || ( ( typeof AsyncFunction          === 'function' ) && ( t instanceof AsyncFunction           ) )
    || ( ( typeof AsyncGenerator         === 'function' ) && ( t instanceof AsyncGenerator          ) )
    || ( ( typeof AsyncGeneratorFunction === 'function' ) && ( t instanceof AsyncGeneratorFunction  ) )
    || ( ( typeof Reflect                === 'function' ) && ( t instanceof Reflect                 ) )
//  || ( ( typeof Proxy                  === 'function' ) && ( t instanceof Proxy                   ) )
  );
};

export function preventUndefined(argTarget, argState){
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

          const targetObject = searchRootState( currState ).currTarget;
          const dump = inspect( targetObject );
          const propPathStr = 'obj.' + nextState.propPath.join('.') ;
          // console.error( propPathStr , 'is not defined in' , dump );
          const err = new ReferenceError( propPathStr + ' is not defined in ' + dump );
          err.targetObject =  targetObject;
          throw err;
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

module.exports.unprevent = function unprevent(o) {
  if ( o && o.__IS_PREVENTED_UNDEFINED__ ) {
    return unprevent( o.__UNPREVENT__ );
  } else {
    return o;
  }
}

export function undefinedlessFunction( fn ) {
  return new Function( 'fn','preventUndefined', `
    return function ${fn.name}Wrapper(...args) {
      const __args = args.map( (e)=>preventUndefined(e) );
      return preventUndefined( fn.apply( this, __args ) );
    };
  `)(fn, preventUndefined );
}

