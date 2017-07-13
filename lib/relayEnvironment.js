import {Environment, Network, RecordSource, Store} from 'relay-runtime';

const network = Network.create((operation, variables) => (
  fetch('https://api.graph.cool/relay/v1/cixzyedcu0oii0144ltsfckbl', {
    method: 'POST',
    body: JSON.stringify({query: operation.text, variables}),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response.json())
));

let initial = {};
if (typeof window !== 'undefined' && window.__NEXT_DATA__) {
  initial = window.__NEXT_DATA__.recordSource;
}

const source = new RecordSource(initial);
const store = new Store(source);
export default new Environment({network, store});
