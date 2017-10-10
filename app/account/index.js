/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  Alert,
  Image,
  View
} from 'react-native';

export default class Account extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <View>
        <Text>
          账户页面2
        </Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  tabText: {
    fontSize: 14,
    color: 'black'
  },
  selectedTabText: {
    fontSize: 14,
    color: '#108ee9'
  },
});
