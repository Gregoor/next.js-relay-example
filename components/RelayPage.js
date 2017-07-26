import React, {Component} from 'react';
import {
  createOperationSelector, getOperation, Environment, Network, RecordSource, Store
} from 'relay-runtime';
import QueryLookupRenderer from 'relay-query-lookup-renderer';
import 'isomorphic-fetch';

const network = Network.create((operation, variables) => (
  fetch('https://api.graph.cool/relay/v1/cixzyedcu0oii0144ltsfckbl', {
    method: 'POST',
    body: JSON.stringify({query: operation.text, variables}),
    headers: {'Content-Type': 'application/json'}
  })
    .then((response) => response.json())
));

const store = new Store(new RecordSource(
  typeof window !== 'undefined' && window.__NEXT_DATA__
    ? window.__NEXT_DATA__.props.recordSource
    : {}
));
const environment = new Environment({network, store});

export default (ComposedComponent, query, variables = {}) => class RelayPage extends Component {

  static async getInitialProps(ctx) {
    const {req} = ctx;
    const isServer = !!req;

    let pageProps = {};

    if (query) {
      const operation = createOperationSelector(getOperation(query), variables);
      environment.retain(operation.root);
      await new Promise((resolve) => environment.sendQuery({operation, onCompleted: resolve}));

      if (isServer) {
        pageProps = {...pageProps, recordSource: environment.getStore().getSource().toJSON()};
      }
    }

    if (ComposedComponent.getInitialProps) {
      pageProps = {...pageProps, ...await ComposedComponent.getInitialProps(ctx)};
    }

    return {...pageProps, isServer};
  }

  render() {
    return (
      <QueryLookupRenderer
        lookup
        environment={environment}
        query={query}
        variables={variables}
        render={({error, props}) => error || !props
          ? <div>{JSON.stringify(error)}</div>
          : <ComposedComponent {...props}/>
        }
      />
    );
  }

};