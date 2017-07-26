import React from 'react';
import {graphql} from 'react-relay';
import RelayPage from '../components/RelayPage';
import HelloWorld from './HelloWorld';

export default RelayPage(
  (viewer) => <HelloWorld viewer={viewer}/>,
  graphql`
    query pagesQuery {
      viewer {
        ...HelloWorld_viewer
      }
    }
  `
);