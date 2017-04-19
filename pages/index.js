import React from 'react';
import {graphql, QueryRenderer} from 'react-relay';
import {Environment, Network} from 'relay-runtime';

import HelloWorld from './HelloWorld';

const network = Network.create((operation, variables) => (
  fetch('https://api.graph.cool/relay/v1/cixzyedcu0oii0144ltsfckbl', {
    method: 'POST',
    body: JSON.stringify({query: operation.text, variables})
  }).then(response => response.json())
));
const environment = new Environment({network});

export default () => (
  <QueryRenderer
    environment={environment}
    query={graphql`
      query indexQuery {
        viewer {
          ...HelloWorld_viewer
        }
      }
    `}
    render={({error, props}) => error
      ? <div>{JSON.stringify(error)}</div>
      : <HelloWorld viewer={props.viewer}/>
    }
  />
);