
const __UNPREVENT__                            = Symbol.for( '__UNPREVENT__' );
const __IS_PREVENTED_UNDEFINED__               = Symbol.for( '__IS_PREVENTED_UNDEFINED__' );
const __CHECK_IF_ALL_PROPERTIES_ARE_REFERRED__ = Symbol.for( '__CHECK_IF_ALL_PROPERTIES_ARE_REFERRED__' );

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
         ( t[__IS_PREVENTED_UNDEFINED__] )
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

const PREFIX_PREVENT_UNDEFINED = '[prevent-undefined]';

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

  if ( ! ( 'maxRecursiveLevel' in result ) ) {
    result.maxRecursiveLevel = -1;
  }

  if ( ! ( 'onError' in result ) ) {
    result.onError = ()=>{};
  }
  return result;
}

function processStack( stack ) {
  return stack.split( '\n' ).slice(1).join('\n');
}

function processCallback( nargs ) {
  const {
    onError,
    propPath,
    propPathStr,
    currTarget,
    message, 
    stackOnCreated,
    stackOnOccured,
  } = nargs;

  const onErrorInfo = {
    propPath       : [ ...propPath ],
    propPathStr    : propPathStr,
    target         : currTarget,
    message        : message,
    stackOnCreated : [ ...stackOnCreated ],
    stackOnOccured : [ ...stackOnOccured ],
  };

  async function callbackWrapper() {
    try {
      // console.error('onError', onError);
      onError(onErrorInfo);
    } catch (e) {
      console.error(e);
    }
  }

  /*await*/ callbackWrapper();
};

function validatorToString( validator ) {
  if ( 'script' in validator ) {
    return validator.script;
  } else {
    return Function.prototype.toString.call( validator );
  }
}


function preventUndefined( ...args ) {
  const {
    target            : argTarget, 
    state             : argState, 
    validator         : argVali, 
    maxRecursiveLevel : argMaxRecursiveLevel, 
    onError           : argOnError  
  } = parseArgs( args );

  const currTarget = argTarget;
  const currState = {
    // the default values >>>
    isRootState       : true,
    recursiveLevel    : 0,
    maxRecursiveLevel : argMaxRecursiveLevel,
    parentState       : null,
    currTarget        : currTarget,
    referredProps     : {}, // the properties which have been referred so far.
    propPath          : [],
    validator         : argVali,
    onError           : argOnError,

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

  /*
   * (Sat, 07 Jan 2023 12:13:52 +0900)
   *
   * Check the current recursive level number and return the specified target
   * without being processed by Proxy if the current recursive level exceeds
   * the specified maximum number.
   *
   * If no maximum level is specified, preventUndefined() will be applied
   * recursively without any limit.
   *
   * Especially preventUndefined() always leave the specified target
   * unprocessed and return if `maxRecursiveLevel` is zero.
   * */
  if (
    ( 0 <= currState.maxRecursiveLevel ) && 
    ( currState.maxRecursiveLevel <= currState.recursiveLevel ) ) 
  {
    return currTarget;
  }

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
        const err = new ReferenceError( 'the given validator threw an error on\n' + dump + '\n' + validatorToString( validator ), { cause : e });
        console.error( err );
        throw err;
      }

      if ( ! result ) {
        const propPath = [ ...currState.propPath ] ;
        if ( prop !== null ) {
          propPath.push( prop );
        }
        const propPathStr   = formatPropPath( propPath );
        const dumpOfTarget  = inspect( currTarget )
        const dumpOfCreated = processStack( stackOnCreated )

        const errMsg = msg
          .replaceAll( /\$path/g, propPathStr )
          .replaceAll( /\$target/g, dumpOfTarget ) 
          .replaceAll( /\$created/g, dumpOfCreated )
          .replaceAll( /\$source/g, validatorToString( validator ) )
        ;
        const err = new ReferenceError( errMsg );
        console.error( err );

        const stackOnOccured = err.stack;

        processCallback({
          onError        : rootState.onError,
          propPath       : propPath,
          propPathStr    : propPathStr,
          currTarget     : currTarget,
          message        : errMsg,
          stackOnCreated : stackOnCreated,
          stackOnOccured : stackOnOccured,
          error          : err,
        });

        throw err;
      }
    } else {
      // no validator is set; ignored.
    }
  };


  // Perform the entry time validation.
  executeValidation( null, '[prevent-undefined] failed object validation on\n$target\n$source\noccured on' );

  if (
    ( 
      ( typeof currTarget === 'object') ||
      ( typeof currTarget === 'function' )
    ) && 
    ( currTarget !== null ) && 
    ( ! isBuiltIn( currTarget ) ) 
  ) {
    const currHandler = {
      // unprevent `this` when it calls the function.
      apply : function apply( target, this_arg, args ) {
        return target.apply( unprevent( this_arg ), args );
      },

      // reading properties
      get(...args) {
        const [target, prop, receiver] = args;

        // ADDED ON (Thu, 05 Jan 2023 14:18:29 +0900)
        /*
         * See https://github.com/patriksimek/vm2/issues/62
         *
         * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/get
         *
         * ### (quote) ###
         * - The value reported for a property must be the same as the value of
         *   the corresponding target object property if the target object
         *   property is a non-writable, non-configurable own data property.
         * - The value reported for a property must be undefined if the
         *   corresponding target object property is a non-configurable own
         *   accessor property that has undefined as its Get attribute.
         * ### (quote) ###
         */
        {
          const desc = Object.getOwnPropertyDescriptor( target, prop );
          if ( desc && desc.configurable === false && desc.writable === false ) {
            return Reflect.get(...args);
          }
        }

        /* 
         * ADDED ON (Thu, 05 Jan 2023 15:12:03 +0900) 
         * Ignore `prototype` when the target object is a function; preventing
         * undefined values on `prototype` is known to be problematic.  See the
         * comment on the commit. 
         */

        /*
         * not only does wrapping `prototype` causes problems but other
         * properties on functions, too; though, it is not clear which property
         * causes the issue. Removed the `prop==='prototype'` part. 
         * (Thu, 05 Jan 2023 17:26:25 +0900)
         */

        /*
         * `prop==='prototype'` was revived after the comment above was written.
         * (Fri, 06 Jan 2023 21:28:12 +0900)
         */
        {
          if ( (typeof target === 'function' ) && ( prop === 'prototype' ) ) {
            return Reflect.get(...args);
          }
        }

        if ( prop === __UNPREVENT__ ) {
          return currTarget;
        }
        if ( prop === __IS_PREVENTED_UNDEFINED__ ) {
          return true;
        }
        if ( prop === __CHECK_IF_ALL_PROPERTIES_ARE_REFERRED__ ) {
          return checkIfAllPropertiesAreReferred( target, currState.referredProps );
        }

        // Be aware the object is directly modified; this object is not duplicated.
        currState.referredProps[prop] = true;

        const propPath = [ ...currState.propPath, prop ];
        const nextTarget = Reflect.get(...args);
        const nextState = {
          ...currState,
          isRootState       : false,
          recursiveLevel    : currState.recursiveLevel + 1,
          maxRecursiveLevel : currState.maxRecursiveLevel,
          parentState       : currState,
          currTarget        : nextTarget,
          referredProps     : {},
          propPath          : propPath,
        };

        if ( ( typeof nextTarget === 'undefined') && ! currState.excludes( prop ) ) {
          const rootState = searchRootState( currState );
          const { currTarget, stackOnCreated } = rootState;

          const propPathStr = formatPropPath( propPath );
          const dumpOfTarget = inspect( currTarget );
          const dumpOfCreated = processStack( stackOnCreated );
          const errMsg = PREFIX_PREVENT_UNDEFINED +' '+ propPathStr + ' is not defined in ' + dumpOfTarget + '\n[stacktrace]\ncreated on\n' + dumpOfCreated + '\n\noccured on';
          const err = new ReferenceError( errMsg );

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

          // 
          const stackOnOccured = err.stack;
          processCallback({
            onError        : rootState.onError,
            propPath       : propPath,
            propPathStr    : propPathStr,
            currTarget     : currTarget,
            message        : errMsg,
            stackOnCreated : stackOnCreated,
            stackOnOccured : stackOnOccured,
            error          : err,
          });

          throw err;
        } else {
          return   preventUndefined( nextTarget, { state : nextState } );
        }
      },

      // writing properties
      set(...args) {
        const result = Reflect.set(...args);
        const [ target, property, value, receiver ] = args;
        executeValidation( property, PREFIX_PREVENT_UNDEFINED +' '+ 'detected setting an invalid property value to $path on\n$target\nvalidator\n$source\n[stacktrace]\ncreated on\n$created\noccured on' );
        return result;
      },
      defineProperty(...args) {
        const result = Reflect.defineProperty( ...args );
        const [ target, property, descriptor ] = args;
        executeValidation( property, PREFIX_PREVENT_UNDEFINED +' '+ 'detected defining an invalid property value to $path on\n$target\nvalidator\n$source\n[stacktrace]\ncreated on\n$created\noccured on' );
        return result;
      },
      deleteProperty(...args) {
        const result = Reflect.deleteProperty( ...args );
        const [ target, property ] = args;
        executeValidation( property, PREFIX_PREVENT_UNDEFINED +' '+ 'detected deleting an invalid property value to $path on\n$target\nvalidator\n$source\n[stacktrace]\ncreated on\n$created\noccured on' );
        return result;
      },

      getOwnPropertyDescriptor( ...args ) {
        const [ target, prop ] = args; 
        if ( prop === __IS_PREVENTED_UNDEFINED__ ) {
          return {
            value : true,
            enumerable   : false,
            writable     : false,
            configurable : true,
          };
        } else {
          const result = Reflect.getOwnPropertyDescriptor( ...args );
          return result;
        }
      },

      ownKeys(...args) {
        return Reflect.ownKeys(...args);
        const result = Reflect.ownKeys(...args);
        debugger;
        // console.error( 'ownKeys' , result );
        if ( ! result.includes( __IS_PREVENTED_UNDEFINED__ ) ) {
          result.push( __IS_PREVENTED_UNDEFINED__ );
        }
        return result.reduce( (accumlator,e)=>accumlator.includes(e) ? accumlator : [ ...accumlator, e] );
      },
    };

    debugger;
    return new Proxy( currTarget, currHandler );

  } else {
    return currTarget;
  }
}



function isUndefinedPrevented(o){
  debugger;
  if ( o && Object.hasOwn( o, __IS_PREVENTED_UNDEFINED__ ) ) {
    return true;
  } else {
    return false;
  }
}

function unprevent(o) {
  if ( isUndefinedPrevented(o) ) {
    return unprevent( o[__UNPREVENT__] );
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
  if ( ! isUndefinedPrevented(o) )
    throw new TypeError('this object is not prevented undefined');

  const result = o[__CHECK_IF_ALL_PROPERTIES_ARE_REFERRED__];
  if ( result.length !== 0 ) {
    const dump = inspect( o[__UNPREVENT__] , {depth:null,breakLength:80});
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

