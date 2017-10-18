import React, { Component } from 'react';
import { addDBListener } from '../services/firebase'
import List, { ListItem } from 'material-ui/List';
import { CircularProgress } from 'material-ui/Progress';
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'

export default class Raffles extends Component {
  state = {
    loading: true,
    raffles: [],
    newRaffleName: ''
  }
  componentDidMount() { 
    this.dbref = addDBListener('/raffle', tree => {
      const raffles = Object.keys(tree).map(uid => ({
        uid,
        ...tree[uid]
      }))
      this.setState({raffles, loading: false})
    })
  }
  componentWillUnmount() {
    this.dbref.off()
  }
  create(ev) {
    ev.preventDefault()
    this.dbref.push().set({
      name: this.state.newRaffleName
    }).catch(err => {
      if(err.code === "PERMISSION_DENIED") {
        this.props.history.push('/settings?m=Debes iniciar sesión para realizar esta acción')
      }
    })
    this.setState({newRaffleName: ''})
  }
  handleChange = name => ev => {
    this.setState({
      [name]: ev.target.value
    })
  }
  render() {
    const {loading, raffles, newRaffleName} = this.state
    return (
      <main>
        {loading && (
          <div style={{display: 'flex', alignItems: 'center', padding: '.5rem'}}>
            <CircularProgress />
            <h3 style={{margin: '1rem'}}>Cargando ...</h3>
          </div>
        )}
        <form style={{padding: '1em', display: 'flex', alignItems: 'flex-end'}} 
              onSubmit={ev => this.create(ev)}>
          <TextField 
            style={{marginRight: '.5em'}}
            label="Nuevo sorteo"
            value={newRaffleName}
            onChange={this.handleChange("newRaffleName")}
          />
          <Button type="submit" raised color="primary">Crear</Button>
        </form>
      </main>
    );
  }
}