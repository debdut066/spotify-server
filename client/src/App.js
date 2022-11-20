import './App.css';
import LoginScreen from './components/LoginScreen';
import styled from 'styled-components';
import GlobalStyle from "./styles/GlobalStyle"

const AppContainer = styled.div`
  height: 100%;
  min-height: 100vh;
`;

function App() {
  return (
    <AppContainer>
      <GlobalStyle/>
      <LoginScreen/>
    </AppContainer>
  );
}

export default App;
