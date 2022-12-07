import React from 'react'
import { Router } from '@reach/router'

import Nav from './Nav'

import styled from 'styled-components/macro'
import { media } from '../styles/media'
import theme from '../styles/theme'

const SiteWrapper = styled.div`
  padding-left: ${ theme.navWidth};
  ${media.tablet`
    padding-left: 0;
    padding-bottom : 50px;
  `}
`;

const Profile = () => {


  return (
    <SiteWrapper>
      <Nav>
        Profile
      </Nav>
    </SiteWrapper>
  )
}

export default Profile