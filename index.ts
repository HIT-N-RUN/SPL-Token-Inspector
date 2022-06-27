export * from './lib/inspector';

import { Exporter } from './lib/exporter';
import { Inspector } from './lib/inspector';

async function main() {
  const obj = new Inspector(
    "https://api.mainnet-beta.solana.com",
    "4KAFf8ZpNCn1SWLZFo5tbeZsKpVemsobbVZdERWxRvd2"
  );
  const test_data = [
    {
      'title': 'Genesis Wallet',
      'publicKey': 'DuhmSSKFmg7X29JgvKFxaR6bUfo2dtrontFz7H956m15'
    },{
      'title': 'Team & Supporters',
      'publicKey': 'FDuY9VbY6HWYo4ofUZZ2G4VqHHDSwmaNtTkC6jhzkjuB'
    },{
      'title': 'Partner program',
      'publicKey': '5rvWNrtYRAex2LwyXYhBFDpdsJT9vMQ8Yd9K4Wm4RSWL'
    },{
      'title': 'Market activation',
      'publicKey': '6S2QY1awirotv3UGXsK5LwEauAaDNb6LDjpHgG5L7yj8'
    },{
      'title': 'R&D',
      'publicKey': 'Bci48Ru2ngPsKrdUJojezJApgPTGLhcGt5YmTCwqS5fs'
    },{
      'title': 'Advisor',
      'publicKey': '6wVKWNrgpzZNdccuHFhDmBCZm31JFUVVXFH42FZDU4wS'
    },{
      'title': 'Reserve',
      'publicKey': '261Snk2C3hQDFxo51Xu8XexhsiUkULgxzsmnvbQNWTw2'
    }
  ]

  for (let i = 0; i < test_data.length; i++) {
    await obj.pushSearchTable(test_data[i].title, test_data[i].publicKey);
  }
  
  const res = await obj.getAllSignaturesFromName('Genesis wallet')

  console.log(res);
  // const res = await obj.getAllSignatures();
  
  // await Exporter.exportSearchedSignatureTable(res);

  // const parsed = await obj.parseSignatures(res);

  
}

main();