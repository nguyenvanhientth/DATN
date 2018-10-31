import React from 'react'
import { StyleSheet, AsyncStorage } from 'react-native'

export default class Screen1 extends React.Component {
  render() {
    var { navigate } = this.props.navigation;
      navigate('LoginPage');
    return null
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})