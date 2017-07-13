import React, {Component} from 'react';
import environment from '../lib/relayEnvironment';
import 'isomorphic-fetch';

export default (query, ComposedComponent) => class RelayPage extends Component {

  static async getInitialProps(ctx) {
    const {req} = ctx;
    const isServer = !!req;

    let pageProps = {};

    if (query) {
      const {
        createOperationSelector,
        getOperation,
      } = environment.unstable_internal;
      const operation = createOperationSelector(getOperation(query));
      const result = await new Promise((resolve) => environment.streamQuery({
        operation,
        onNext: () => resolve(environment.lookup(operation.fragment).data),
      }));

      pageProps = {...result};

      if (isServer) pageProps.recordSource = environment.getStore().getSource().toJSON();
    }

    if (ComposedComponent.getInitialProps) {
      pageProps = {...await ComposedComponent.getInitialProps(ctx)};
    }

    return {
      ...pageProps,
      // initialState: store.getState(),
      isServer
    };
  }

  render() {
    return <ComposedComponent {...this.props}/>;
  }

};