/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
  AppRegistry,
  Button,
  StyleSheet,
  Text,
  Alert,
  Image,
  View,
  Navigator
} from 'react-native';

import List from './app/creation/index'
import Edit from './app/edit/index'
import Account from './app/account/index'
import Detail from './app/creation/detail'

import TabNavigator from 'react-native-tab-navigator';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Dimensions} from 'react-native'

import {StackNavigator} from 'react-navigation';

const deviceW = Dimensions
  .get('window')
  .width
const basePx = 375
function px2dp(px) {
  return px * deviceW / basePx
}

const ListNavigation = StackNavigator({
  Main: {
    screen: List
  },
  Detail: {
    screen: Detail,
    path: 'detail/:id'
  }
}, {headerMode: 'none'});

const tabItemSelectedIconSize = px2dp(16)
const tabItemSelectedIconBg = '#108ee9'

export default class App extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'camera'
    }
  }

  render() {
    return (
      <TabNavigator style={styles.container}>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'camera'}
          title="camera"
          titleStyle={styles.tabText}
          selectedTitleStyle={styles.selectedTabText}
          renderIcon={() => <Icon name="video-camera" size={tabItemSelectedIconSize}/>}
          renderSelectedIcon={() => <Icon
          name="video-camera"
          color={tabItemSelectedIconBg}
          size={tabItemSelectedIconSize}/>}
          onPress={() => this.setState({selectedTab: 'camera'})}>
          <ListNavigation></ListNavigation>
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'microphone'}
          title="microphone"
          titleStyle={styles.tabText}
          selectedTitleStyle={styles.selectedTabText}
          renderIcon={() => <Icon name="microphone" size={tabItemSelectedIconSize}/>}
          renderSelectedIcon={() => <Icon
          name="microphone"
          color={tabItemSelectedIconBg}
          size={tabItemSelectedIconSize}/>}
          onPress={() => this.setState({selectedTab: 'microphone'})}>
          <Edit/>
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'bars'}
          title="barsLog"
          titleStyle={styles.tabText}
          selectedTitleStyle={styles.selectedTabText}
          renderIcon={() => <Icon name="bars" size={tabItemSelectedIconSize}/>}
          renderSelectedIcon={() => <Icon name="bars" color={tabItemSelectedIconBg} size={tabItemSelectedIconSize}/>}
          onPress={() => this.setState({selectedTab: 'bars'})}>
          <Account/>
        </TabNavigator.Item>
      </TabNavigator>
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
  }
});