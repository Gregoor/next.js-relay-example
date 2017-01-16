import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import Relay from 'react-relay';
import IsomorphicRelay from 'isomorphic-relay';


const networkLayer = new Relay.DefaultNetworkLayer(
  'https://api.graph.cool/relay/v1/cixzyedcu0oii0144ltsfckbl'
);
const environment = new Relay.Environment();
environment.injectNetworkLayer(networkLayer);

const HelloWorld = Relay.createContainer(
  ({viewer}) => (
    <div>
      {viewer.allHelloTargets.edges.map(({node}) => (
        <h1 key={node.id}>Hello {node.name}</h1>
      ))}
    </div>
  ),
  {fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        allHelloTargets(first: 1) {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    `
  }}
);

const rootContainerProps = {
  queryConfig: {
    name: 'ViewerRoute',
    queries: {viewer: () => Relay.QL`query { viewer }`},
    params: {}
  },
  Container: HelloWorld
};

const isServer = typeof window == 'undefined';

export default class extends Document {

  static async getInitialProps() {
    const {data, props} = await IsomorphicRelay.prepareData(rootContainerProps, networkLayer);
    return {...props, preloadedData: data};
  }

  render() {
    let {props} = this;
    if (!isServer) {
      const node = window.document.getElementById('preloadedData');
      if (node) {
        const data = JSON.parse(node.textContent);
        IsomorphicRelay.injectPreparedData(environment, data);
        // props = IsomorphicRelay.prepareInitialRender({...rootContainerProps, environment}).props;
      }
    }
    return (
      <html>
        <Head/>
        <body>
          <IsomorphicRelay.Renderer {...props}/>
          <Main/>
          <NextScript/>
          <div id="preloadedData">{JSON.stringify(this.props.preloadedData)}</div>
        </body>
      </html>
    );
  }

}