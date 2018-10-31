import React, { Component } from 'react';
import {Image,Text,View,StyleSheet,TextInput,TouchableOpacity,AsyncStorage,ImageBackground} from 'react-native';
import env from '../environment/env';

const BASE_URL = env;
const icon = require('../image/ic_lock.png');
const background = require('../image/hinhnen.jpg') ;

class ChanePassword extends Component {
   
    static navigationOptions = {
        title: 'ChanePassWord',
        headers: null
      };
      constructor(props) {
        super(props);
        this.state = {
          OldPassWord: '',
          NewPassword: '',
          ConPassword: '',
        };
      }
      _onChaneOld = (OldPassWord) => {
          this.setState({
            OldPassWord,
          })
      }
      _onChaneNew = (NewPassword) => {
        this.setState({NewPassword})
      }
      _onChaneConfim = (ConPassword) => {
        this.setState({ConPassword})
      }
      _onPressForgot = () => {
        AsyncStorage.getItem(STORAGE_KEY).then((user_data_json) => {
          let token = user_data_json;
          if (token === undefined) {
              var{navigate} = this.props.navigation;
              navigate('LoginPage');
          }
          let passN = this.state.NewPassword;
          let passO = this.state.OldPassWord;
          let passC = this.state.ConPassword;
          if (passN !== passC) {
              alert('You input password new and confirm not duplicate!')
          } else {
              let url = BASE_URL + 'Account/ChangePassword'
              fetch(url,{
                  method: 'POST',
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                       Authorization: 'Bearer ' + token,
                  },
                  body: JSON.stringify({
                      'CurrentPassword':passO,
                      'NewPassword': passN,
                      'NewPasswordConfirm': passC
                  })
              })
              .then((res) => {
                  if (res.ok) {
                      var {navigate} = this.props.navigation;
                      navigate('MainPage');
                      alert('ChanePassword Success!')
                  } else {
                      alert('ChanePassword False!')
                  }
              })
              .catch((err) => {
                  console.log(err)
              })
          }
      })
    }
  render() {
    return (
      <ImageBackground style={[styles.container, styles.background]}
        source = {background}  resizeMode="cover">
            <View style={styles.container}/>
            <View style={styles.wrapper}>
                <View style={styles.inputWrap}>
                    <View style={styles.iconWrap}>
                        <Image source={icon} resizeMode="contain" style={styles.icon}/>
                    </View>
                    <TextInput  style={styles.input} placeholder="OldPassword" secureTextEntry={true} onChangeText={this._onChaneOld.bind(this)} underlineColorAndroid="transparent"/>
                </View>
                <View style={styles.inputWrap}>
                    <View style={styles.iconWrap}>
                        <Image source={icon} resizeMode="contain" style={styles.icon}/>
                    </View>
                    <TextInput style={styles.input} placeholder="NewPassword" secureTextEntry={true} onChangeText={this._onChaneNew.bind(this)} underlineColorAndroid="transparent"/>
                </View>
                <View style={styles.inputWrap}>
                    <View style={styles.iconWrap}>
                        <Image source={icon} resizeMode="contain" style={styles.icon}/>
                    </View>
                    <TextInput style={styles.input} placeholder="ConfirmPassword" secureTextEntry={true} onChangeText={this._onChaneConfim.bind(this)} underlineColorAndroid="transparent"/>
                </View>
                <TouchableOpacity activeOpacity={.5} onPress={this._onPressForgot.bind(this)} keyboardShouldPersistTaps={true}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}> Change </Text>
                    </View>      
                </TouchableOpacity>
            </View>  
            <View style={styles.container}/>       
        </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    wrapper:{
        paddingHorizontal:15,
    },
    background:{
      width: null,
      height:null,
    },
    inputWrap:{
        flexDirection:"row",
        marginVertical: 5,
        height:36,
        backgroundColor:"transparent",
    },
    input:{
      flex: 1,
      paddingHorizontal: 5,
      backgroundColor:'#FFF',
      },
    iconWrap:{
      paddingHorizontal:7,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:"#2E9AFE"
      },
    icon:{
      width:20,
      height:20,
      },
    button:{
      backgroundColor:"#2ECCFA",
      paddingVertical: 8,
      marginVertical:8,
      alignItems: "center",
      justifyContent: "center",
      },
  
  
    buttonText: {
        fontSize: 16,
        color:'#000000',
        textAlign: 'center',
       
    },
})

module.exports = ChanePassword;