export * from './lib/inspector';

import { Inspector } from './lib/inspector';


async function main() {
  const obj = new Inspector(
    "https://api.mainnet-beta.solana.com",
    "4KAFf8ZpNCn1SWLZFo5tbeZsKpVemsobbVZdERWxRvd2"
  );

  await obj.pushSearchTable('R&D', 'DuhmSSKFmg7X29JgvKFxaR6bUfo2dtrontFz7H956m15');
  console.log(obj.searchTable);
}

main();