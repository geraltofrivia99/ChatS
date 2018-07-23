import React from 'react';
import { Query } from "react-apollo";
import findIndex from 'lodash/findIndex';
import gql from "graphql-tag";
import decode from 'jwt-decode';

import Teams from '../components/Teams';
import Channels from '../components/Channels';
import AddChannelModal from '../components/AddchannelModal';

class SideBarWrap extends React.Component {
  state = {
    openAddChannelModal: false
  }
  handleAddChannelClick = () => { 
    this.setState({
      openAddChannelModal: true
    })
  }
  handleCloseAddChannelClick = () => { 
    this.setState({
      openAddChannelModal: false
    })
  }

  render () {
    const { currentTeamId, allTeams } = this.props;
    const teamIdx = currentTeamId ? findIndex(allTeams, ['id', parseInt(currentTeamId, 10)]) : 0;
        
        const team = allTeams[teamIdx]
        
        let username = '';
        try {
          const token = localStorage.getItem('token');
          const { user } = decode(token)
          
          username = user.username;
        } catch (err) {}
        
    return (
      <React.Fragment>
            <Teams key="team-sidebar" teams={allTeams.map(t => ({
              id: t.id,
              letter: t.name.charAt(0).toUpperCase(),
            }))} />
            <Channels
              key="channels-sidebar"
              teamName={team.name}
              username={username}
              channels={team.channels}
              users={[{ id: 1, name: " slackbot" }, { id: 2, name: "shit" }]}
              onAddChannelClick={this.handleAddChannelClick}
            />
            <AddChannelModal 
              onClose={this.handleCloseAddChannelClick}
              open={this.state.openAddChannelModal}
              key={'Add-chanel-mod'}/>
          </React.Fragment>
    );
  };
};

const Sidebar = ({currentTeamId}) => (
  <Query
      query={gql`
        {
          allTeams {
            id
            name
            channels {
              id
              name
            }
          }
        }
      `}
    >
      {({ loading, error, data: { allTeams } }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error :(</p>;

        return (
          <SideBarWrap allTeams={allTeams} currentTeamId={currentTeamId}/>
        );
      }}
    </Query>
)

export default Sidebar;