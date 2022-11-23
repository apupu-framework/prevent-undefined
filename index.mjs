'use strict'

function inspect(s) {
  return JSON.stringify( s, null, 2 );
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

function isOneOfWellKnownSymbols(n) {
  /*
   * (Mon, 24 Oct 2022 17:08:47 +0900)
   * This should be local variable; Sometimes symbos are replaced with other
   */
  const WELL_KNOWN_SYMBOLS = [
      Symbol.asyncIterator
    , Symbol.hasInstance
    , Symbol.isConcatSpreadable
    , Symbol.iterator
    , Symbol.match
    , Symbol.matchAll
    , Symbol.replace
    , Symbol.search
    , Symbol.species
    , Symbol.split
    , Symbol.toPrimitive
    , Symbol.toStringTag
    , Symbol.unscopables
  ];
  if ( typeof n === 'symbol' ) return true;
  return 0<=WELL_KNOWN_SYMBOLS.indexOf(n);
}

const      IGNORING_KEYWORDS = [ 'toJSON', 'toPostgres', 'then', '$$typeof', '@@iterator' ];
const JEST_IGNORING_KEYWORDS = [ 'toJSON', 'toPostgres', 'then', 'stack','message','cause' ];

// console.error('isOneOfWellKnownSymbols( Symbol.iterator ) ',  isOneOfWellKnownSymbols( Symbol.iterator )  );

function checkIfAllPropertiesAreReferred( target, referredProps ) {
  const targetKeys   = Object.keys( target );
  const referredKeys = Object.keys( referredProps );
  const result       = targetKeys.filter( e=>! referredKeys.includes( e ) );
  return result;
}

function parseArgs( args ) {
  const result = {
    target : args.shift(),
  };
  args = args.map( e=> typeof e === 'function' ? { validator : e } : e );
  Object.assign( result, ...args );

  if ( ! ( 'target' in result ) ) {
    throw new ReferenceError( 'parameter target is required' );
  }

  if ( ! ( 'state' in result ) ) {
    result.state = null;
  }

  if ( ! ( 'validator' in result ) ) {
    result.validator = null;
  }
  return result;
}

function processStack( stack ) {
  return stack.split( '\n' ).slice(1).join('\n');
}

function preventUndefined( ...args ) {
  const { target:argTarget, state:argState, validator: argVali  } = parseArgs( args );
  const currTarget = argTarget;
  const currState = {
    // the default values >>>
    isRootState   : true,
    parentState   : null,
    currTarget    : currTarget,
    referredProps : {}, // the properties which have been referred so far.
    propPath      : [],
    validator     : argVali,

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
        return isOneOfWellKnownSymbols(n) || 0<=JEST_IGNORING_KEYWORDS.indexOf(n);
      } else {
        return isOneOfWellKnownSymbols(n) || 0<=     IGNORING_KEYWORDS.indexOf(n);
      }
    },
    // the default values <<<

    // the overriding values >>>
    ...argState,
    // the overriding values <<<
  };

  if ( currState.isRootState ) {
    currState.stackOnCreated = new Error().stack;
  }

  const formatPropPath = (propPath)=> 'obj.' + propPath.map( e=>e!=null?e.toString():'(null)' ).join('.');
  

  const executeValidation = ( prop, msg )=>{
    const rootState = searchRootState( currState );
    const { validator, currTarget, stackOnCreated } = rootState;
    if ( validator ) {
      let result = null;
      try {
        result = validator( currTarget );
      } catch (e){
        const dump = inspect( currTarget )
        const err = new ReferenceError( 'the given validator threw an error on\n' + dump + '\n' + validator, { cause : e });
        console.error( err );
        throw err;
      }
      if ( ! result ) {
        const propPath = [ ...currState.propPath ] ;
        if ( prop !== null ) {
          propPath.push( prop );
        }
        const propPathStr = formatPropPath( propPath );
        const dumpOfTarget = inspect( currTarget )
        const dumpOfCreated = processStack( stackOnCreated )

        const errMsg = msg
          .replaceAll( /\$path/g, propPathStr )
          .replaceAll( /\$target/g, dumpOfTarget ) 
          .replaceAll( /\$created/g, dumpOfCreated )
        ;
        const err = new ReferenceError( errMsg );
        console.error( err );
        throw err;
      }
    } else {
      // no validator is set; ignored.
    }
  };

  // Perform the entry time validation.
  executeValidation( null, 'failed object validation on\n$target\noccured on' );

  if (( typeof currTarget === 'object') && currTarget !== null && ( ! isBuiltIn( currTarget ) ) ) {
    const currHandler = {

      // reading properties
      get(...args) {
        const [target, prop, receiver] = args;
        if ( prop === '__UNPREVENT__' ) {
          return currTarget;
        }
        if ( prop === '__IS_PREVENTED_UNDEFINED__' ) {
          return true;
        }
        if ( prop === '__CHECK_IF_ALL_PROPERTIES_ARE_REFERRED__' ) {
          return checkIfAllPropertiesAreReferred( target, currState.referredProps );
        }

        // Be aware the object is directly modified; this object is not duplicated.
        currState.referredProps[prop] = true;

        const nextTarget = Reflect.get(...arguments);

        const nextState = {
          ...currState,
          isRootState   : false,
          parentState   : currState,
          currTarget    : nextTarget,
          referredProps : {},
          propPath      : [ ...currState.propPath, prop ],
        };

        if ( ( typeof nextTarget === 'undefined') && ! currState.excludes( prop ) ) {
          const rootState = searchRootState( currState );
          const { currTarget, stackOnCreated } = rootState;

          const propPathStr = formatPropPath([ ...currState.propPath, prop ]);
          const dumpOfTarget = inspect( currTarget );
          const dumpOfCreated = processStack( stackOnCreated );
          const err = new ReferenceError( propPathStr + ' is not defined in ' + dumpOfTarget + '\n[stacktrace]\ncreated on\n' + dumpOfCreated + '\n\noccured on' );

          // err.currTarget =  currTarget;

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
          return preventUndefined( nextTarget, { state : nextState } );
        }
      },

      // writing properties
      set(...args) {
        const result = Reflect.set(...args);
        const [ target, property, value, receiver ] = args;
        executeValidation( property, 'detected setting an invalid property value to $path on\n$target\n[stacktrace]\ncreated on\n$created\noccured on' );
        return result;
      },
      defineProperty(...args) {
        const result = Reflect.defineProperty( ...args );
        const [ target, property, descriptor ] = args;
        executeValidation( property, 'detected defining an invalid property value to $path on\n$target\n[stacktrace]\ncreated on\n$created\noccured on' );
        return result;
      },
      deleteProperty(...args) {
        const result = Reflect.deleteProperty( ...args );
        const [ target, property ] = args;
        executeValidation( property, 'detected deleting an invalid property value to $path on\n$target\n[stacktrace]\ncreated on\n$created\noccured on' );
        return result;
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

function recursivelyUnprevent( o ) {
  o = unprevent( o );
  if ( o && typeof o === 'object' ) {
    for (const [key, value] of Object.entries(o)) {
      o[key] = recursivelyUnprevent( value );
    }
  }
  return o;
}

function preventUnusedProperties( o ) {
  if ( ! o.__IS_PREVENTED_UNDEFINED__ )
    throw new TypeError('this object is not prevented undefined');
  const result = o.__CHECK_IF_ALL_PROPERTIES_ARE_REFERRED__;
  if ( result.length !== 0 ) {
    const dump = inspect( o.__UNPREVENT__ , {depth:null,breakLength:80});
    if ( result.length === 1 ) {
      throw new ReferenceError( 'the field [' + result[0] + '] was not referred in\n' + dump );
    } else {
      throw new ReferenceError( 'the fields [' + result.join(',') + '] were not referred in\n' + dump );
    }
  }
}

function typesafe(...args) {
  if( 0 < args.length ) {
    args.unshift( args.pop() );
  }
  return preventUndefined( ...args );
}
const rtti = typesafe;

const errorIfUndefined = name=>{throw new ReferenceError(`the parameter value of ${name} was undefined; any reference to an undefined value is strictly prohibited on this object.`)};




export {
  preventUndefined ,
  undefinedlessFunction ,
  unprevent,
  recursivelyUnprevent,
  preventUnusedProperties,
  typesafe,
  rtti,
  errorIfUndefined,
};