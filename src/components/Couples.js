import React, {Component} from 'react'
import Button from 'material-ui/Button'
import { addDBListener } from '../services/firebase'
import { CircularProgress } from 'material-ui/Progress';
import Icon from 'material-ui/Icon'

export default class Couples extends Component {
  state = {
    loading: true,
    users: [],
    couples: []
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
  computeCouples() {
    const {users} = this.state
    const shuffledUsers = this.shuffle(users)
    const couples = shuffledUsers.map((user, index) => {
      const nextIndex = (index + 1) % shuffledUsers.length
      const couple = shuffledUsers[nextIndex]
      return [user, couple]
    })
    return couples
  }
  shuffle(array) {
    return array.sort(() => Math.random() - 0.5)
  }
  setCouples() {
    const couples = this.computeCouples()
    this.setState({couples})
  }
  render() {
    const {loading, users, couples} = this.state
    const userNames = users.map(user => user.name).join(', ')
    return (
      <main>
        {loading && (
          <div style={{display: 'flex', alignItems: 'center', padding: '.5rem'}}>
            <CircularProgress />
            <h3 style={{margin: '1rem'}}>Cargando ...</h3>
          </div>
        )}
        {couples.map((couple, i) => (
          <div key={i} style={{fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <span>{couple[0].name}</span>
            <Icon style={{margin: '1em 2em'}}>arrow_forward</Icon>
            <span>{couple[1].name}</span>            
          </div>
        ))}
        <div style={{padding: '1em', textAlign: 'center'}}>
          <p><strong>Participantes:</strong> {userNames}</p>
          <Button style={{margin: '1em auto', display: 'block'}} 
                  onClick={() => this.setCouples()}
                  raised color="primary">
            Asignar parejas
          </Button>
        </div>
      </main>
    )
  }
}
