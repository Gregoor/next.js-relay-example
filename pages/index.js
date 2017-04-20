import React from 'react';
import {graphql, QueryRenderer} from 'react-relay';
import {Environment, Network, RecordSource, Store,} from 'relay-runtime';
import 'isomorphic-fetch';

import HelloWorld from './HelloWorld';

const network = Network.create((operation, variables) => (
  fetch('https://api.graph.cool/relay/v1/cixzyedcu0oii0144ltsfckbl', {
    method: 'POST',
    body: JSON.stringify({query: operation.text, variables}),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response.json())
));

const source = new RecordSource();
const store = new Store(source);
const environment = new Environment({network, store});

const query = graphql`
  query indexQuery {
    viewer {
      ...HelloWorld_viewer
    }
  }
`;

export default class extends React.Component {

  static async getInitialProps() {
    const {
      createOperationSelector,
      getOperation,
    } = environment.unstable_internal;
    const operation = createOperationSelector(getOperation(query));
    environment.retain(operation.root);
    return new Promise((resolve) => environment.streamQuery({
      operation,
      onNext: () => resolve(environment.lookup(operation.fragment).data)
    }));
  }

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={query}
        render={({error, props}) => error || !props
          ? <div>{JSON.stringify(error)}</div>
          : <HelloWorld viewer={props.viewer}/>
        }
      />
    )
  }

}