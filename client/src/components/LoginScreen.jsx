import React from 'react'
import styled from 'styled-components/macro'
import theme from '../styles/theme';
import mixins from "../styles/mixins";
import Main from "../styles/Main";

const { colors, fontSizes } = theme;

const Login = styled(Main)`
  ${mixins.flexCenter};
  flex-direction : column;
  min-height:100vh;
  h1{
    font-size : ${fontSizes.xxl}
  }
`;

const LoginButton = styled.a`
  display: inline-block;
  background-color: ${colors.green};
  color: ${colors.white};
  border-radius: 30px;
  padding: 17px 35px;
  margin: 20px 0 70px;
  min-width: 160px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-align: center;
  &:hover,
  &:focus {
    background-color: ${colors.offGreen};
  }
`;
// console.log(process.env.NODE_ENV)

const LOGIN_URI = process.env.NODE_ENV !== "production" ? "http://localhost:8888/login" : "https://spotify-profile.herkouapp.com/login";

const LoginScreen = () => {
  return (
    <Login>
      <h1>Spotify Profile</h1>
      <LoginButton href={LOGIN_URI}>Log in to Spotify</LoginButton>
    </Login>
  )
}

export default LoginScreen;