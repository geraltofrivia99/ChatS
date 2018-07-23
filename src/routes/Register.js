import React, { Component } from 'react';
import { Container, Input, Header, Button, Message, Form } from 'semantic-ui-react';
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

class RegForm extends Component {
  state = {
    username: '',
    usernameError:'',
    email: '',
    emailError: '',
    password: '',
    passwordError: '',
  }
  onSubmit = async () => {
    this.setState({
      usernameError: '',
      emailError: '',
      passwordError: '',
    });

    const { username, email, password } = this.state;
    const response = await this.props.register({
      variables: { username, email, password },
    });

    const { ok, errors } = response.data.register;

    if (ok) {
      this.props.history.push('/');
      
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        // err['passwordError'] = 'too long..';
        err[`${path}Error`] = message;
      });
        this.setState(err);
    }

    console.log(response);
  };
  onChange = e => {
    const { name, value } = e.target;
    // name = "email";
    this.setState({ [name]: value });
  };

  render() {
    const { username, email, password, usernameError, emailError, passwordError } = this.state;
    const errorList = [];

    if (usernameError) {
      errorList.push(usernameError);
    }

    if (emailError) {
      errorList.push(emailError);
    }

    if (passwordError) {
      errorList.push(passwordError);
    }

    return (
      <div>
        <Container text>
              <Header as="h2">
                Register
              </Header>
                <Form>
                  <Form.Field
                  error={!!usernameError}>
                    <Input
                      
                      name="username"
                      onChange={this.onChange}
                      value={username}
                      placeholder="Username"
                      fluid
                    />
                  </Form.Field>
                  <Form.Field
                  error={!!emailError}>
                    <Input
                      name="email"
                      onChange={this.onChange}
                      value={email}
                      placeholder="Email"
                      fluid
                    />
                  </Form.Field>
                  <Form.Field
                  error={!!passwordError}>
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
      </div>
    )
  }
}

export const Register = (props) => {
  return (
    <Mutation
        mutation = {gql`
        mutation ($username: String!, $email: String!, $password: String!) {
          register(username: $username, email: $email, password: $password) {
            ok
            errors {
              path
              message
            }
          }
        }
      `}
      >
      {(register, { loading, error, data }) => {
          
          if (error) return <p>Error :(</p>;
          // let UserName, Email, Password
          
          return (
            <RegForm register={register} history={props.history}/>
          );
        }}
      </Mutation>
  );
}