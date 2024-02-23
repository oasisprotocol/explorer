;(async () => {
  const results = await (await fetch('https://nexus.oasis.io/v1/sapphire/events?limit=1000&offset=0')).json()

  console.log(`
    import {Results} from './types';
    const examples1000: Results = ${JSON.stringify(results, null, 2)};
  `)
})()
