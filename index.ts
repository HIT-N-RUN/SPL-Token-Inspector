export * from './lib/inspector';

import { Inspector } from './lib/inspector';


async function main() {
  const obj = new Inspector(
    "https://api.mainnet-beta.solana.com",
    "4KAFf8ZpNCn1SWLZFo5tbeZsKpVemsobbVZdERWxRvd2"
  );

  await obj.pushSearchTable('Genesis wallet', 'DuhmSSKFmg7X29JgvKFxaR6bUfo2dtrontFz7H956m15');
  await obj.pushSearchTable('Team & Supporters', 'FDuY9VbY6HWYo4ofUZZ2G4VqHHDSwmaNtTkC6jhzkjuB');
  await obj.pushSearchTable('Partner program', '5rvWNrtYRAex2LwyXYhBFDpdsJT9vMQ8Yd9K4Wm4RSWL');
  await obj.pushSearchTable('Market activation', '6S2QY1awirotv3UGXsK5LwEauAaDNb6LDjpHgG5L7yj8');
  await obj.pushSearchTable('R&D', 'Bci48Ru2ngPsKrdUJojezJApgPTGLhcGt5YmTCwqS5fs');
  await obj.pushSearchTable('Advisor', '6wVKWNrgpzZNdccuHFhDmBCZm31JFUVVXFH42FZDU4wS');
  await obj.pushSearchTable('Reserve', '261Snk2C3hQDFxo51Xu8XexhsiUkULgxzsmnvbQNWTw2');
  
  const res = await obj.getAllSignatures();

  
}

main();