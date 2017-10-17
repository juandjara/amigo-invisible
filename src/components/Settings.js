import React, { Component } from 'react';
import firebase from '../services/firebase'
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button'
import Tabs, { Tab } from 'material-ui/Tabs';

export default class Settings extends Component {
  state = {
    email: '',
    password: '',
    tab: 0,
    user: null
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({user})
      user ? console.log("Logged in with email ", user.email) : console.log("Logged out")
    })
  }
  onSubmit(ev) {
    ev.preventDefault()
    const {email, password, tab} = this.state
    let promise;
    if(tab === 0) {
      promise = firebase.auth().signInWithEmailAndPassword(email, password)
    } else {
      promise = firebase.auth().createUserWithEmailAndPassword(email, password)      
    }
    promise.catch(err => console.error(err.message))
  }
  handleChange = name => ev => {
    this.setState({
      [name]: ev.target.value
    })
  }
  changeTab(tab) {
    this.setState({
      tab, email: '', password: ''
    })
  }
  renderForm() {
    const {email, password, tab} = this.state
    return (
      <form style={{padding: '1em'}} onSubmit={ev => this.onSubmit(ev)}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          required
          onChange={this.handleChange("email")}
        />
        <TextField
          fullWidth
          style={{margin: '1em 0'}} 
          label="Contraseña"
          type="password"
          value={password}
          required
          inputProps={{minLength: 6}}
          onChange={this.handleChange("password")}
        />
        <Button type="submit" raised color="primary">
          {tab === 0 ? 'Iniciar sesión' : 'Crear cuenta'}
        </Button>
      </form>
    );
  }
  renderRegister() {
    return (
      <div></div>
    )
  }
  renderTabs() {
    return (
      <div>
        <Tabs 
          value={this.state.tab} 
          onChange={(ev, tab) => this.changeTab(tab)}>
          <Tab label="Iniciar sesión" />
          <Tab label="Crear cuenta" />
        </Tabs>
        {this.renderForm()}
      </div>
    )
  }
  render() {
    const {user} = this.state
    return user ? (
      <div>
        <h2>Bienvenido {user.email}</h2>
        <Button onClick={() => firebase.auth().signOut()}>Cerrar sesi&oacute;n</Button>
      </div>
    ) : this.renderTabs()
  }
}