import React, {Component} from 'react';
import { Container, Input, Header, Button, Message, Form } from 'semantic-ui-react';
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

class LoginForm extends Component {
    state = {
      email: '',
      emailError: '',
      password: '',
      passwordError: '',

    }
    onSubmit = async () => {
      const {email, password} = this.state;
      const response = await this.props.login({
        variables: { email, password },
      })
      console.log(response);
      const {ok, token, refreshToken, errors} = response.data.login;
      if (ok) {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        this.props.history.push('/');
      } else {
        const err = {};
        errors.forEach(({ path, message }) => {
          // err['passwordError'] = 'too long..';
          err[`${path}Error`] = message;
        });
          this.setState(err);
      }
    }
    onChange = e => {
      const {name, value} = e.target;
      this.setState({
        [name]: value
      })
    }
  render() {
    const { email, password, emailError, passwordError } = this.state; 
    const errorList = [];

    if (passwordError) {
      errorList.push(passwordError);
    }

    if (emailError) {
      errorList.push(emailError);
    }
    return (
      <Container text>
        <Header as="h2">
          Login
        </Header>
        <Form>
          <Form.Field
            error={!!emailError}
          >
            <Input
              name="email"
              onChange={this.onChange}
              value={email}
              placeholder="Email"
              fluid
            />
          </Form.Field>
          <Form.Field error={!!passwordError}>
            <Input
              name="password"
              onChange={this.onChange}
              value={password}
              type="password"
              placeholder="Password"
              fluid
            />
          </Form.Field>
          <Button type="submit" onClick={this.onSubmit}>Submit</Button>
        </Form>
        {errorList.length !==0 && 
          <Message error header="There was some errors with your submission" list={errorList} />
        }
      </Container>
    )
  } 
};



export const Login = (props) => {
  return (
    <Mutation
        mutation = {gql`
        mutation($email: String!, $password: String!) {
          login(email: $email, password: $password){
            ok
            token
            refreshToken
            errors {
              message
              path
            }
          }
        }
      `}
      >
      {(login, { loading, error, data }) => {
          
          if (error) return <p>Error :(</p>;
          
          return (<LoginForm login={login} history={props.history}/>)
            
        }}
      </Mutation>
  );
}