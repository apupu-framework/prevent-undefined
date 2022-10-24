
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

/* 
 * toJSON
 * SEE https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toJSON
 *
 * toStringTag (Wed, 19 Oct 2022 10:55:58 +0900)
 * SEE      https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag
 * SEE ALSO https://dev.to/cherif_b/using-javascript-tostringtag-for-objects-types-description-15hc
 *
 * toPrimitive (Wed, 19 Oct 2022 13:29:20 +0900)
 * SEE https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive
 *
 * $$typeof  (Mon, 24 Oct 2022 15:32:46 +0900)
 * SEE https://overreacted.io/why-do-react-elements-have-typeof-property/
 */
const      IGNORING_KEYWORDS = [ 'toJSON', 'toPostgres', 'then', Symbol.toStringTag, Symbol.toPrimitive, '$$typeof' ];
const JEST_IGNORING_KEYWORDS = [ 'toJSON', 'toPostgres', 'then', Symbol.toStringTag, Symbol.toPrimitive, 'stack','message','cause' ];

function preventUndefined(argTarget, argState){
  const currTarget = argTarget;
  const currState = {
    isRootState:true,
    parentState : null,
    currTarget  : currTarget,
    propPath : [],

    excludes : (n)=>{
      const stack = new Error().stack.trim().split('\n');
      // console.error('stack',stack); 
      // console.error('stack[3]',stack[3]); // this could be the location Jest calls the func.
      const isProblematicModule = 
        4<stack.length ? 
          ( 0<=stack[3].search( /node_modules.jest/ ) ) || 
          ( 0<=stack[3].search( /node_modules.pretty/ ) ) :
          false;
      if ( isProblematicModule ) {
        return 0<=JEST_IGNORING_KEYWORDS.indexOf(n);
      } else {
        return 0<=     IGNORING_KEYWORDS.indexOf(n);
      }
    },
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
          const propPathStr = 'obj.' + nextState.propPath.map(e=>e!=null?e.toString():'(null)').join('.');
          // console.error( propPathStr , 'is not defined in' , dump );
          const err = new ReferenceError( propPathStr + ' is not defined in ' + dump );
          // err.targetObject =  targetObject;

          /**
           * (Fri, 21 Oct 2022 14:37:14 +0900)
           *
           * This is a countermeasure for the way  jest shows stacktraces; jest
           * tries to hide its own stacktrace. This behavior makes it extremely
           * difficult to tell a problem comes from jest itsown or others.
           *
           * We have to show the current stacktrace before jest hides it.
           */
          console.error( err );

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

function unprevent(o) {
  if ( o && o.__IS_PREVENTED_UNDEFINED__ ) {
    return unprevent( o.__UNPREVENT__ );
  } else {
    return o;
  }
}

function undefinedlessFunction( fn ) {
  return new Function( 'fn','preventUndefined', `
    return function ${fn.name}Wrapper(...args) {
      const __args = args.map( (e)=>preventUndefined(e) );
      return preventUndefined( fn.apply( this, __args ) );
    };
  `)(fn,preventUndefined);
}

