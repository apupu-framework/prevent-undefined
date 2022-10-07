'use strict'

const util = require( 'util' );

function searchRootState( currState ) {
  if ( currState.isRootState ) {
    return currState;
  } else { 
    return searchRootState( currState.parentState );
  }
}

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

  if (( typeof currTarget === 'object') && currTarget !== null ) {
    const currHandler = {
      get(...args) {
        const [target, prop, receiver] = args;

        const nextTarget = Reflect.get(...arguments);

        const nextState = {
          ...currState,
          isRootState : false,
          parentState : currState,
          currTarget  : nextTarget,
          propPath   : [ ...currState.propPath, prop ],
        };

        if ( ( typeof nextTarget === 'undefined') && ! currState.excludes( prop ) ) {

          const dump = util.inspect(  searchRootState( currState ).currTarget, {
            depth:null,
            colors:true,
          });
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
  `)(fn,preventUndefined);
}
