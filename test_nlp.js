import { runFullAnalysis } from './src/engines/scoreAggregator.js';

// nama : IDA BAGUS KIRANA BODHIJAYA GUNAWAN, tanggal lahir 20 Mei 2026 pukul 12.00 PM
const analysis = runFullAnalysis(
  "Father", "1990-01-01", 
  "Mother", "1990-01-01", 
  "IDA BAGUS KIRANA BODHIJAYA GUNAWAN", "2026-05-20T12:00:00", 
  "male"
);

console.log("NLP Data:");
console.log(JSON.stringify(analysis.breakdown.nlp.data.semantic, null, 2));
