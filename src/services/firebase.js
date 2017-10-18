import config from '../firebaseConfig'
import firebase from 'firebase'

firebase.initializeApp(config)

export const loginObserver = cb => firebase.auth().onAuthStateChanged(cb)

export function login(email, password) {
  return firebase.auth().signInWithEmailAndPassword(email, password)
  .then(user => user.uid)
  .then(getProfile)
}
export function getProfile(uid) {
  return firebase.database()
    .ref('/users/' + uid)
    .once('value')
    .then(snaphost => snaphost.val() || {})
}
export function updateProfile(uid, data) {
  return firebase.database()
    .ref('/users/' + uid)
    .set(data)
}
export function register(email, password) {
  return firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(user => user.uid)
  .then(getProfile)
}
export function logout() {
  return firebase.auth().signOut()
}


export default firebase
