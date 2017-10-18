import React from 'react'
import { addDBListener } from '../services/firebase'
import List, { ListItem } from 'material-ui/List';
import { CircularProgress } from 'material-ui/Progress';

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
            <ListItem key={i}>
               {user.name}
            </ListItem>
          ))}
        </List>
      </main>
    )
  }
}

export default Users
