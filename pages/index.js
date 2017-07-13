import React from 'react';
import {graphql, QueryRenderer} from 'react-relay';
import RelayPage from '../components/RelayPage';
import environment from '../lib/relayEnvironment';
import HelloWorld from './HelloWorld';

let query = graphql`
  query indexQuery {
    viewer {
      ...HelloWorld_viewer
    }
  }
`;

export default RelayPage(
  query,
  () => (
    <QueryRenderer
      environment={environment}
      query={query}
      render={({error, props}) => error || !props
        ? <div>{JSON.stringify(error)}</div>
        : <HelloWorld viewer={props.viewer}/>}
    />
  )
);