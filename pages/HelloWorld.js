import React from 'react';
import {createFragmentContainer, graphql} from 'react-relay';

export default createFragmentContainer(
  ({viewer}) => (
    <div>
      {viewer.allHelloTargets.edges.map(({node}) => (
        <h1 key={node.id}>Hello {node.name}</h1>
      ))}
    </div>
  ),
  graphql`
    fragment HelloWorld_viewer on Viewer {
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
);