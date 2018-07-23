import React, {Component} from 'react';
import { Container, Input, Header, Button, Message, Form } from 'semantic-ui-react';
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

class TeamForm extends Component {
    state = {
      name: '',
      errors: {},

    }
    onSubmit = async () => {
      const { name } = this.state;
      let response = null;
      try {
        response = await this.props.createTeam({
          variables: { name },
        });
      } catch (err) {
        this.props.history.push('/login');
        return;
      }
    
      console.log(response);
      const {ok, errors, team } = response.data.createTeam;
      if (ok) {
        this.props.history.push(`/view-team/${team.id}`);
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
    const { name, errors: { nameError } } = this.state; 
    const errorList = [];

    if (nameError) {
      errorList.push(nameError);
    }

    return (
      <Container text>
        <Header as="h2">
          CreateTeam
        </Header>
        <Form>
          <Form.Field
            error={!!nameError}
          >
            <Input
              name="name"
              onChange={this.onChange}
              value={name}
              placeholder="Name"
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



export const CreateTeam = (props) => {
  return (
    <Mutation
        mutation = {gql`
        mutation($name: String!) {
          createTeam(name: $name){
            ok
            team {
              id
            }
            errors {
              message
              path
            }
          }
        }
      `}
      >
      {(createTeam, { loading, error, data }) => {
          
          if (error) return <p>Error :(</p>;
          
          return (<TeamForm createTeam={createTeam} history={props.history}/>)
            
        }}
      </Mutation>
  );
}