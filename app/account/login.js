//import liraries
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Alert,
    AsyncStorage
} from 'react-native';
import {get, post} from '../common/request'
import Button from 'react-native-button'
// create a component
class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            phoneNumber: '',
            codeSended: false,
            verifyCode: ''
        }
    }

    _submit = () => {
        var me = this
        if (!this.state.phoneNumber) {
            Alert.alert('手机号不能为空')
            return;
        }

        if (!this.state.verifyCode) {
            Alert.alert('验证码不能为空')
            return;
        }

        post('u/verify', {
            phoneNumber: this.state.phoneNumber,
            verifyCode: this.state.verifyCode
        }).then(x => {

            if (x && x.success) {
                me
                    .props
                    .loginSuccess(x.data)
            } else {
                Alert.alert('登录失败，请检查手机号码是否正确')
            }
        }).catch(x => {
            Alert.alert('登录失败，请检查网络是否良好');
        })

    }

    _showVerifyCode() {
        this.setState({codeSended: true})
    }

    _senderVerifyCode = () => {
        if (!this.state.phoneNumber) {
            Alert.alert('手机d号d不能为空')
        }
        post('u/signup', {phoneNumber: this.state.phoneNumber}).then(rs => {
            if (rs && rs.success) {
                this._showVerifyCode()
            }
        }).catch(x => {})
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.signupBox}>
                    <Text style={styles.title}>快速登录</Text>
                    <TextInput
                        placeholder='请输入手机号'
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        keyboardType={'number-pad'}
                        style={styles.inputField}
                        onChangeText={(x) => {
                        this.setState({phoneNumber: x})
                    }}></TextInput>
                    {this.state.codeSended
                        ? <View style={styles.verifycodeBox}>
                                <TextInput
                                    placeholder='请输入验证码'
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    keyboardType={'number-pad'}
                                    style={styles.inputField}
                                    onChangeText={(x) => {
                                    this.setState({verifyCode: x})
                                }}></TextInput>
                            </View>
                        : null
}
                    {this.state.codeSended
                        ? <Button style={styles.btn} onPress={this._submit}>登录</Button>
                        : <Button style={styles.btn} onPress={this._senderVerifyCode}>获取验证码</Button>
}
                </View>

            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    verifycodeBox: {},
    btn: {
        marginTop: 10,
        padding: 10,
        backgroundColor: 'transparent',
        borderColor: '#ee735c',
        borderWidth: 1,
        borderRadius: 4,
        color: '#ee735c'
    },
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f9f9f9'
    },
    signupBox: {
        marginTop: 30
    },
    title: {
        marginBottom: 20,
        color: '#333',
        fontSize: 20,
        textAlign: 'center'
    },
    inputField: {
        height: 40,
        padding: 5,
        color: '#666',
        backgroundColor: '#fff',
        borderRadius: 4
    }
});

//make this component available to the app
export default Login;
