import React from 'react'
import './App.css';
import LoginScreen from './components/LoginScreen';
import styled from 'styled-components';
import Profile from './components/Profile'
import GlobalStyle from "./styles/GlobalStyle"
import { token } from './spotify/index'

const AppContainer = styled.div`
  height: 100%;
  min-height: 100vh;
`;

function App() {
  const [accessToken,setAccessToken] = React.useState('');
  // console.log(token);

  React.useEffect(()=>{
    setAccessToken(token)
  },[])

  return (
    <AppContainer>
      <GlobalStyle/>
      {accessToken ? <Profile/> : <LoginScreen/>}
    </AppContainer>
  );
}

export default App;
