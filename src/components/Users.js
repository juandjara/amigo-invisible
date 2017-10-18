import React from 'react'
import { addDBListener } from '../services/firebase'
import List, { ListItem } from 'material-ui/List';
import { CircularProgress } from 'material-ui/Progress';
import Icon from 'material-ui/Icon'
import styled from 'styled-components'

const ListIcon = styled(Icon)`
  vertical-align: bottom;
  margin-right: 10px;
`

class Users extends React.Component {
  state = {
    loading: true,
    users: []
  }
  componentDidMount() { 
    this.dbref = addDBListener('/users', userTree => {
      const users = Object.keys(userTree).map(uid => ({
        uid, 
        ...userTree[uid]
      }))
      this.setState({users, loading: false})
    })
  }
  componentWillUnmount() {
    this.dbref.off()
  }
  render() {
    const {loading, users} = this.state
    return (
      <main> 
        {loading && (
          <div style={{display: 'flex', alignItems: 'center', padding: '.5rem'}}>
            <CircularProgress />
            <h3 style={{margin: '1rem'}}>Cargando ...</h3>
          </div>
        )}
        <List>
          {users.map((user, i) => (
            <ListItem key={i} style={{border: '1px solid #ccc', margin: '.5em 1em'}}>
              <div>
                <p style={{fontSize: 20, marginTop: 0}}>
                  <ListIcon>person</ListIcon>
                  <span>{user.name || user.email}</span>
                </p>
                <p style={{marginTop: 20, marginBottom: 10}}>
                  <ListIcon color="primary">thumb_up</ListIcon> 
                  <strong>Me gusta:</strong>
                </p>
                <div>{user.likes}</div>
                <p style={{marginTop: 20, marginBottom: 10}}>
                  <ListIcon color="error">thumb_down</ListIcon>
                  <strong>No me gusta:</strong>
                </p>
                <div>{user.dislikes}</div>                
              </div>
            </ListItem>
          ))}
        </List>
      </main>
    )
  }
}

export default Users
