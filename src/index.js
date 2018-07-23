import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import Routes from './routes';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, from } from 'apollo-link';
import { onError } from 'apollo-link-error'
// import { withClientState } from 'apollo-link-state';
import 'semantic-ui-css/semantic.min.css';

const cache = new InMemoryCache();

const httpLink = new HttpLink({ uri: 'http://localhost:8081/graphql' });

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext({
    headers: {
      'x-token': localStorage.getItem('token'),
      'x-refresh-token': localStorage.getItem('refreshToken'),
    } 
  });

  return forward(operation);
})

const afterWare = onError(({ response }) => {
  const { headers } = response;
  if (headers) { 
  const token = headers.get('x-token');
  const refreshToken = headers.get('x-refresh-token'); 
  
  if (token) {
    localStorage.setItem('token', token);
  }

  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken)
  }
  }
})

const client = new ApolloClient({
  // uri: 'http://localhost:8081/graphql'
 link: from([authMiddleware, afterWare, httpLink]),
 cache
});

const App = () => (
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
