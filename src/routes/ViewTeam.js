import React from 'react';
import SendMessage from '../components/SendMessage';
import Header from '../components/Header';
import AppLayout from '../components/AppLayout';
import Messages from '../components/Messages';
import Sidebar from '../containers/Sidebar';

export const ViewTeam = ({ match: { params } }) => (
  <AppLayout>
    <Sidebar currentTeamId={params.teamId}/>
    <Header channelName='General' />
    <Messages>
      <ul>
        <li>
        </li>
        <li></li>
      </ul>
    </Messages>
    <SendMessage channelName="General"/>
  </AppLayout>
);