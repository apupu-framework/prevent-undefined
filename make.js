
import { sqlmacro } from 'sqlmacro';
import { readFile, writeFile } from 'fs/promises';

const body = (await readFile( 'index.js', 'utf-8' ));

async function asyncProc(templateFilename, outputFilename ){
  const template = (await readFile( templateFilename, 'utf-8' ));
  const output = sqlmacro([template])(body);
  await writeFile( outputFilename, output, 'utf-8' );
  return 'succeeded to compile modules';
}

asyncProc('index.template.cjs','index.cjs' ).then(v=>console.log(v)).catch(v=>console.error(v));
asyncProc('index.template.mjs','index.mjs' ).then(v=>console.log(v)).catch(v=>console.error(v));

