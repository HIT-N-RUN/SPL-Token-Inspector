import { Inspector } from './lib/inspector.js';

const WALLETS = [
  {
    'name': 'Genesis Wallet',
    'str_publicKey': 'DuhmSSKFmg7X29JgvKFxaR6bUfo2dtrontFz7H956m15'
  }, {
    'name': 'Team & Supporters',
    'str_publicKey': 'FDuY9VbY6HWYo4ofUZZ2G4VqHHDSwmaNtTkC6jhzkjuB'
  },{
    'name': 'Partner Program',
    'str_publicKey': '5rvWNrtYRAex2LwyXYhBFDpdsJT9vMQ8Yd9K4Wm4RSWL'
  },{
    'name': 'Market Activation',
    'str_publicKey': '6S2QY1awirotv3UGXsK5LwEauAaDNb6LDjpHgG5L7yj8'
  },{
    'name': 'R&D',
    'str_publicKey': 'Bci48Ru2ngPsKrdUJojezJApgPTGLhcGt5YmTCwqS5fs'
  },{
    'name': 'Advisor',
    'str_publicKey': '6wVKWNrgpzZNdccuHFhDmBCZm31JFUVVXFH42FZDU4wS'
  },
  {
    'name': 'Reserve',
    'str_publicKey': '261Snk2C3hQDFxo51Xu8XexhsiUkULgxzsmnvbQNWTw2'
  }
]

async function main() {
  const inspectObj = new Inspector({
    tokenMintAddress: '4KAFf8ZpNCn1SWLZFo5tbeZsKpVemsobbVZdERWxRvd2'
  })

  for (const wallet of WALLETS) {
    await inspectObj.addWallet({...wallet});
  }

  const parsedTransactions = await inspectObj.getParsedTransactionsOfWallet();
  console.log(parsedTransactions);
}

main();