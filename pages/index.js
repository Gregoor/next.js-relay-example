import React from 'react';
import Relay, {getQueries} from 'react-relay';
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

export default class extends React.Component {

  static async getInitialProps() {
    return IsomorphicRelay.prepareData(rootContainerProps, networkLayer);
  }

  render() {
    const {props, data} = this.props;
    if (isServer) {
      return <IsomorphicRelay.Renderer {...rootContainerProps} {...props} />;
    } else {
      IsomorphicRelay.injectPreparedData(environment, data);
      return <Relay.Renderer {...{environment}} {...rootContainerProps} />
    }
  }

}