//import liraries
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  Image,
  Alert,
  Modal,
  TextInput
} from 'react-native';
import {Dimensions} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import sha1 from 'sha1'

import {get, post} from '../common/request'
import * as Progress from 'react-native-progress';
import Button from 'react-native-button'

var ImagePicker = require('react-native-image-picker');
const width = Dimensions
  .get('window')
  .width

var options = {
  title: '选择头像',
  customButtons: [
    // {   name: 'fb',   title: 'Choose Photo from Facebook' }
  ],
  cancelButtonTitle: '取消',
  takePhotoButtonTitle: '拍照',
  chooseFromLibraryButtonTitle: '从图片库选择',
  mediaType: 'photo',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

var CLOUDINARY = {
  'cloud_name': 'gougouapp',
  'api_key': '426754325587512',
  'api_secret': 'o-Ds9GSSSiR-hqqbsvMbuIe5FfM',
  'base': 'http://res.cloudinary.com/gougouapp',
  'image': 'https://api.cloudinary.com/v1_1/gougouapp/image/upload'
}

var formatAvatar = function (id, type) {
  return `${CLOUDINARY.base}/${type}/upload/${id}`
}

// create a component
class Account extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
      avatarProgress: 0,
      isUploading: false,
      modelVisible: false
    }
  }

  _pickImage = () => {
    ImagePicker.showImagePicker(options, (response) => {

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = 'data:image/jpeg;base64,' + response.data;

        var timestamp = Date.now();
        var tags = 'app,avatar'
        var folder = 'avatar'
        var signature = 'folder=' + folder + '&tags=' + tags + '&timestamp=' + timestamp + CLOUDINARY.api_secret
        signature = sha1(signature)

        var body = new FormData()
        body.append('folder', folder)
        body.append('signature', signature)
        body.append('tags', tags)
        body.append('timestamp', timestamp)
        body.append('api_key', CLOUDINARY.api_key)
        body.append('resource_type', 'image')
        body.append('file', source)

        this._uploadAvatar(body)
      }
    });
  }

  _uploadAvatar(body) {
    this.setState({isUploading: true})
    var xhr = new XMLHttpRequest()
    var url = CLOUDINARY.image
    xhr.open('POST', url)
    xhr.onload = () => {

      if (xhr.status != 200) {
        Alsert.alert('上传头像失败')
        return
      }

      if (!xhr.responseText) {
        Alsert.alert('上传头像失败')
        return
      }

      var response
      try {
        response = JSON.parse(xhr.responseText)
      } catch (e) {
        console.log(e)
      }

      if (response && response.public_id) {
        var user = this.state.user;
        user.avatar = formatAvatar(response.public_id, 'image');
        this.setState({user: user})

        AsyncStorage
          .getItem('user')
          .then(x => {
            var tuser = JSON.parse(x)
            tuser.avatar = user.avatar
            AsyncStorage.setItem('user', tuser)
          })
      }

      this.setState({isUploading: false})
    }

    if (xhr.upload) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          var percent = Number((event.loaded / event.total).toFixed(2))
          this.setState({avatarProgress: percent})
        }
      }
    }

    xhr.send(body)
  }

  componentDidMount() {
    AsyncStorage
      .getItem('user')
      .then(x => {
        if (x) {
          var user = JSON.parse(x);
          if (user && user.accessToken) {
            this.setState({user: user})
          }
        }
      })
  }

  _edit = () => {
    this.setState({modelVisible: true})
  }

  _close = () => {
    this.setState({modelVisible: false})
  }

  _changeUserState(key, value) {
    var user = this.state.user;
    user[key] = value;
    this.setState({user: user})
  }

  _submit = () => {
    this._close()
  }

  _logout = ()=> {
    this.props.logout()
  }

  render() {
    var user = this.state.user
    return (
      <View style={styles.container}>
        <View style={styles.toolBar}>
          <Text style={styles.toolBarTitle}>我的账户</Text>
          <Text style={styles.toolBarExtrl} onPress={this._edit}>编辑</Text>

        </View>
        {user.avatar
          ? <TouchableOpacity style={styles.avatarContainer} onPress={this._pickImage}>
              <Image
                source={{
                uri: user.avatar
              }}
                style={styles.avatarContainer}>
                <Text style={styles.avatarTip}>戳这里换头像</Text>
                <View style={styles.avatarBox}>
                  {this.state.isUploading
                    ? <Progress.Circle
                        size={75}
                        color={'#ee735c'}
                        showsText={true}
                        progress={this.state.avatarProgress}/>
                    : <Image
                      style={styles.avatar}
                      source={{
                      uri: user.avatar
                    }}></Image>
}
                </View>
              </Image>
            </TouchableOpacity>
          : <TouchableOpacity style={styles.avatarContainer} onPress={this._pickImage}>
            <Text style={styles.avatarTip}>添加小狗狗头像</Text>
            <View style={styles.avatarBox}>
              {this.state.isUploading
                ? <Progress.Circle
                    size={75}
                    color={'#ee735c'}
                    showsText={true}
                    progress={this.state.avatarProgress}/>
                : <Icon name={'plus'} style={styles.plusIcon}></Icon>
}
            </View>
          </TouchableOpacity>
}

        <Modal animationType={'fade'} visible={this.state.modelVisible}>
          <View style={styles.modelContainer}>
            <Icon
              name='close'
              style={styles.closeIcon}
              color='#ee735c'
              onPress={this._close}></Icon>
            <View style={styles.fieldItem}>
              <Text style={styles.labl}>昵称</Text>
              <TextInput
                placeholder={'输入你的昵称'}
                style={styles.inputField}
                defaultValue={user.nickname}
                onChangeText={(x) => {
                this._changeUserState('nickname', x)
              }}></TextInput>
            </View>
            <View style={styles.fieldItem}>
              <Text style={styles.labl}>性别</Text>
              <Icon.Button
                onPress={() => {
                this._changeUserState('gender', 'male')
              }}
                style={[
                styles.gender, user.gender == 'male' && styles.genderChecked
              ]}
                name={'male'}>男
              </Icon.Button>
              <Icon.Button
                onPress={() => {
                this._changeUserState('gender', 'female')
              }}
                style={[
                styles.gender, user.gender == 'female' && styles.genderChecked
              ]}
                name={'female'}>女
              </Icon.Button>
            </View>
            <View style={styles.fieldItem}>
              <Text style={styles.labl}>品种</Text>
              <TextInput
                placeholder={'输入你的品种'}
                style={styles.inputField}
                defaultValue={user.breed}
                onChangeText={(x) => {
                this._changeUserState('breed', x)
              }}></TextInput>
            </View>
            <Button style={styles.submitBtn} onPress={this._submit}>保存</Button>
          </View>
        </Modal>
        <Button style={styles.submitBtn} onPress={this._logout}>退出登录</Button>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  toolBar: {
    flexDirection: 'row',
    paddingTop: 25,
    paddingBottom: 12,
    backgroundColor: '#ee735c'
  },
  toolBarTitle: {
    flex: 1,
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600'
  },
  avatarContainer: {
    width: width,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee'
  },
  avatarTip: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
    fontWeight: '400'
  },
  avatarBox: {
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  plusIcon: {
    padding: 20,
    paddingLeft: 25,
    paddingRight: 25,
    color: '#666',
    fontSize: 24,
    backgroundColor: '#fff',
    borderRadius: 8
  },
  avatar: {
    marginBottom: 15,
    width: width * 0.2,
    height: width * 0.2,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: width *0.1
  },
  toolBarExtrl: {
    position: 'absolute',
    right: 10,
    top: 26,
    color: '#fff',
    textAlign: 'right',
    fontWeight: '600',
    fontSize: 14
  },
  modelContainer: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff'
  },
  fieldItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    paddingLeft: 15,
    paddingRight: 15,
    borderColor: '#eee',
    borderBottomWidth: 1
  },
  labl: {
    color: '#ccc',
    marginRight: 10
  },
  inputField: {
    height: 50,
    flex: 1,
    color: '#666',
    fontSize: 14
  },
  closeIcon: {
    position: 'absolute',
    width: 40,
    height: 40,
    right: 20,
    top: 30,
    fontSize: 32
  },
  genderChecked: {
    backgroundColor: '#ee735c'
  },
  gender: {},
  submitBtn: {
    alignSelf: 'center',
    width: width - 20,
    padding: 16,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ee753c',
    borderRadius: 4,
    color: '#ee753c',
    fontSize: 18
  }
});

//make this component available to the app
export default Account;
