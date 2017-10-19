import React, { Component } from 'react';
import { addDBListener } from '../services/firebase'
import List, { ListItem } from 'material-ui/List';
import { CircularProgress } from 'material-ui/Progress';
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import Icon from 'material-ui/Icon'
import IconButton from 'material-ui/IconButton'

export default class Raffles extends Component {
  state = {
    loading: true,
    raffles: [],
    newRaffleName: '',
    editUID: null
  }
  componentDidMount() { 
    this.dbref = addDBListener('/raffle', tree => {
      if(!tree) {
        return
      }
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
  create() {
    this.dbref.push().set({
      name: this.state.newRaffleName
    }).catch(err => {
      if(err.code === "PERMISSION_DENIED") {
        this.props.history.push('/settings?next=/raffles')
      }
    })
  }
  edit() {
    const {editUID, newRaffleName} = this.state
    this.dbref.child(editUID).set({ name: newRaffleName })
  }
  save(ev) {
    ev.preventDefault()
    if(this.isEditMode()) {
      this.edit()
    } else {
      this.create()
    }
    this.setState({newRaffleName: '', editUID: null})    
  }
  isEditMode() {
    return this.state.editUID !== null
  }
  setEditMode(raffle) {
    this.setState({editUID: raffle.uid, newRaffleName: raffle.name})
  }
  handleChange = name => ev => {
    this.setState({
      [name]: ev.target.value
    })
  }
  render() {
    const {loading, raffles, newRaffleName} = this.state
    const editMode = this.isEditMode()
    return (
      <main>
        {loading && (
          <div style={{display: 'flex', alignItems: 'center', padding: '.5rem'}}>
            <CircularProgress />
            <h3 style={{margin: '1rem'}}>Cargando ...</h3>
          </div>
        )}
        <List>
          {raffles.map(raffle => (
            <ListItem key={raffle.uid}>
              <Icon style={{verticalAlign: 'middle', paddingRight: 8}}>group</Icon>
              <p>{raffle.name}</p>
              <div style={{flex: 1}}></div>
              <IconButton aria-label="Editar" onClick={() => this.setEditMode(raffle)}>
                <Icon>edit</Icon>
              </IconButton>
            </ListItem>
          ))}
        </List>
        <form style={{padding: '1em', display: 'flex', alignItems: 'flex-end'}} 
              onSubmit={ev => this.save(ev)}>
          <TextField 
            style={{marginRight: '.5em'}}
            label="Nuevo sorteo"
            value={newRaffleName}
            onChange={this.handleChange("newRaffleName")}
          />
          <Button type="submit" raised color="primary">
            {editMode ? 'Guardar':'Crear'}
          </Button>
        </form>
      </main>
    );
  }
}