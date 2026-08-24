import { initModels, parseIntent } from './src/services/nlp.service.js';

async function test() {
  await initModels();
  const input = "3 किलो आलू लेना है";
  console.log(`Testing: ${input}`);
  const result = await parseIntent(input);
  console.log(JSON.stringify(result, null, 2));
}

test();
