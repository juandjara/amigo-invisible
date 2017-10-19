import React from 'react'
import styled from 'styled-components'
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button'
import {Link, NavLink} from 'react-router-dom'
import teal from 'material-ui/colors/teal';
import Icon from 'material-ui/Icon'

const Nav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  align-items: flex-end;
  border-bottom: 1px solid #ccc;
`
const ToolbarLink = styled(NavLink)`
  color: #333;
  text-decoration: none;
`
const activeStyle = {
  color: teal[500],
  borderBottom: `2px solid ${teal[500]}`
}
const MainLink = styled(Link)`
  padding: 16px;
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`

const Header = () => (
  <Nav>
    <MainLink to="/">
      <Icon style={{verticalAlign: 'middle', marginRight: 16}}>group</Icon>
      Amigo Invisible
    </MainLink>
    <div style={{flex: 1}}></div>
    <Toolbar style={{padding: 0, minHeight: 0}}>
      <ToolbarLink activeStyle={activeStyle} to="/users">
        <Button style={{color: 'inherit'}}>Usuarios</Button>
      </ToolbarLink>
      <ToolbarLink activeStyle={activeStyle} to="/couples">
        <Button style={{color: 'inherit'}}>Parejas</Button>
      </ToolbarLink>
      <ToolbarLink activeStyle={activeStyle} to="/settings">
        <Button style={{color: 'inherit'}}>Mi cuenta</Button>
      </ToolbarLink>
    </Toolbar>
  </Nav>
)

export default Header
