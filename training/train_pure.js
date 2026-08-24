import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as tf from '@tensorflow/tfjs';
import { pipeline } from '@xenova/transformers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INTENT_LABELS = ['add', 'remove', 'search', 'update_qty'];

async function main() {
  console.log('Using pure JS TensorFlow backend...');
  await tf.setBackend('cpu');
  
  console.log('Loading dataset...');
  const datasetPath = path.join(__dirname, 'dataset.json');
  const datasetContent = fs.readFileSync(datasetPath, 'utf8').replace(/^\uFEFF/, '');
  const dataset = JSON.parse(datasetContent);
  console.log(`Loaded ${dataset.length} phrases.`);

  const texts = dataset.map(d => d.text);
  const labels = dataset.map(d => INTENT_LABELS.indexOf(d.label));

  console.log('Loading MiniLM and extracting embeddings (might take a minute)...');
  const extractor = await pipeline('feature-extraction', 'Xenova/paraphrase-multilingual-MiniLM-L12-v2', { quantized: true });
  
  const embeddings = [];
  for (let i = 0; i < texts.length; i++) {
    const output = await extractor(texts[i], { pooling: 'mean', normalize: true });
    embeddings.push(Array.from(output.data));
    if ((i + 1) % 50 === 0) console.log(`Encoded ${i + 1}/${texts.length}`);
  }

  const xs = tf.tensor2d(embeddings, [embeddings.length, 384]);
  const ys = tf.oneHot(tf.tensor1d(labels, 'int32'), INTENT_LABELS.length);

  console.log('Building model...');
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [384], units: 128, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
  model.add(tf.layers.dense({ units: INTENT_LABELS.length, activation: 'softmax' }));

  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });

  console.log('Training model...');
  await model.fit(xs, ys, {
    epochs: 40,
    batchSize: 32,
    validationSplit: 0.15,
    callbacks: {
      onEpochEnd: (epoch, logs) => console.log(`Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}, acc = ${logs.acc.toFixed(4)}`)
    }
  });

  console.log('Extracting raw weights...');
  const weights = model.getWeights();
  
  const exportData = {
    w1: Array.from(weights[0].dataSync()),
    b1: Array.from(weights[1].dataSync()),
    w2: Array.from(weights[2].dataSync()),
    b2: Array.from(weights[3].dataSync()),
    w3: Array.from(weights[4].dataSync()),
    b3: Array.from(weights[5].dataSync())
  };

  const exportDir = path.join(__dirname, '..', 'public', 'model');
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }
  
  const outPath = path.join(exportDir, 'weights.json');
  fs.writeFileSync(outPath, JSON.stringify(exportData));
  
  console.log(`Model successfully trained and raw weights exported to ${outPath}!`);
}

main().catch(console.error);
