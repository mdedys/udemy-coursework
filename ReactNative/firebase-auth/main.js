import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import firebase from 'firebase';

import SignUpForm from './components/SignUpForm';
import SignInForm from './components/SignInForm';

class App extends React.Component {

  componentDidMount() {
    const config = {
      apiKey: 'AIzaSyCIJr9i_dRI6fygi5JIBkmaMFLxP-K5-Co',
      authDomain: 'one-time-password-bb3fb.firebaseapp.com',
      databaseURL: 'https://one-time-password-bb3fb.firebaseio.com',
      projectId: 'one-time-password-bb3fb',
      storageBucket: 'one-time-password-bb3fb.appspot.com',
      messagingSenderId: '998529336467'
    };

    firebase.initializeApp(config);
  }

  render() {
    return (
      <View style={styles.container}>
        <SignUpForm />
        <SignInForm />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

Expo.registerRootComponent(App);
