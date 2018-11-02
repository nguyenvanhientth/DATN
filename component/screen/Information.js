import React, { Component } from 'react';
import {AppRegistry,StyleSheet,Text,View,Image,ScrollView,
    AsyncStorage,TouchableOpacity,ImageBackground,Picker} from 'react-native';
import DateTimePicker from "react-native-modal-datetime-picker";
import env from '../environment/env';
import Dialog from "react-native-dialog";


var STORAGE_KEY = 'key_access_token';
const background = require('../image/hinhnen.png') ;
const update = require('../image/update.png') ;
const date = require('../image/date.png') ;
const BASE_URL = env;

export default class Information extends Component {
    constructor(props) {
    super(props);
  
    this.state = {
      firstName: '',
      lastName: '',
      userName: '',
      Email: '',
      DOB: '',
      Address: '',
      Gender: '',
      Position: '',
      PhoneNumber: '',
      passOld: '',
      passNew: '',
      passConfig: '',
      dialogUpdate: false,
      firstName1: null,
      lastName1: null,
      DOB1: null,
      Address1: null,
      PhoneNumber1: null,
      isDateTimePickerVisible: false,
    };
  }
  
  componentWillMount() {
    try {
        AsyncStorage.getItem(STORAGE_KEY).then((user_data_json) => {
            let token = user_data_json;        
            //console.warn(token);
            fetch(BASE_URL + "Account/GetUserInformation",{
                //method: "GET",
                headers:{ 
                    'cache-control': 'no-cache',
                    Authorization: 'Bearer ' + token,
                }
            }).then((res)=>res.json())
            .then((resJson) => {
                //console.warn("resJson",resJson);debugger;
                this.setState({
                    firstName: resJson.firstName,
                    lastName: resJson.lastName,
                    userName: resJson.userName,
                    Email: resJson.email,
                    Address: resJson.address,
                    Position: resJson.role,
                    PhoneNumber: resJson.phoneNumber,
                    DOB: resJson.dateOfBirth,
                    Gender: resJson.gender
                });       
            })
            .catch ((error) => {
                console.warn('AsyncStorage error:' + error.message);
            })
        });


    } catch (error) {
        console.log('AsyncStorage error: ' + error.message);
        }            
  }
    dialogUpdate = ()=>{
        this.setState({
            dialogUpdate: true,
        })
    }
    _onChaneFist = (e)=>{
        this.setState({
            firstName1:e
        })
    }
    _onChaneLast=(e)=>{
        this.setState({
            lastName1:e
        })
    }
    _onChaneAddress=(e)=>{
        this.setState({
            Address1:e
        })
    }
    _onChanePhoneNumber=(e)=>{
        this.setState({
            PhoneNumber1:e
        })
    }
    handleCancel = ()=>{
        this.setState({
            dialogUpdate: false,
        })
    }
    handleUpdate = ()=>{
        AsyncStorage.getItem(STORAGE_KEY).then((user_data_json) => {
            let token = user_data_json;  
            let serviceUrl = BASE_URL+  "Account/ChangeInformationUser";
            let firstName = this.state.firstName1;
            let lastName = this.state.lastName1;
            let dateOfBirth = this.state.DOB1;
            let address = this.state.Address1;
            let PhoneNumber = this.state.PhoneNumber1;
            // kiem tra o day 
              fetch(serviceUrl,{
                  method: "PUT",          
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + token,
                  },
              body: JSON.stringify({
                  'FirstName': firstName,
                  'LastName': lastName,
                  'DateOfBirth': dateOfBirth,
                  'Address': address,
                  'PhoneNumber': PhoneNumber,
                  
                  })
              })
                  .then((responseJSON) => {  
                      console.warn('signup',responseJSON)
                          if(responseJSON.ok){
                              this.componentWillMount();
                              alert('Update Success!');
                          }
                          else {
                              alert('Update False!');
                          }
                          
                  })
                  .catch((error) => {
                      console.warn('asd',error);
                  });  
          })
        this.setState({
            dialogUpdate:false,
        })
    }
    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

     _handleDatePicked = date => {
        this.setState({ DOB1: date.toString() });
        this._hideDateTimePicker();
    };
 render() {
    const { isDateTimePickerVisible, DOB1 } = this.state;
        return (
            <ImageBackground style={[styles.container, styles.background]}
                source = {background}  resizeMode="cover">
                <Text style = {{color: "#0404B4", fontSize: 30}}> Hi {this.state.firstName}</Text>
                <View style={styles.ThongTin}>
                    <Text style = {{fontSize: 32, color: "#424040", textAlign: 'left'}}>Information:</Text>
                    <Text style={styles.text}> UserName: {this.state.userName} </Text>
                    <Text style={styles.text}> FirstName: {this.state.firstName} </Text>
                    <Text style={styles.text}> LastName: {this.state.lastName} </Text>
                    <Text style={styles.text}> Address: {this.state.Address} </Text>
                    <Text style={styles.text}> Email: {this.state.Email} </Text>
                    <Text style={styles.text}> DateOfBirth: {this.state.DOB} </Text>
                    <Text style={styles.text}> Gender: {this.state.Gender} </Text>
                    <Text style={styles.text}> Phone: {this.state.PhoneNumber} </Text>
                    <Text style={styles.text}> Role: {this.state.Position}</Text>
                </View>
                <View style={styles.footer}>
                    <TouchableOpacity activeOpacity={.5} onPress={this.dialogUpdate.bind(this)} keyboardShouldPersistTaps={true}>
                        <View style={styles.button}>
                            <Image style = {styles.iconAdd} source = {update} />
                        </View>   
                    </TouchableOpacity>
                </View>
                <Dialog.Container visible = {this.state.dialogUpdate}>
                <ScrollView style = {styles.container1}>
                    <Dialog.Title>Update Personal Information</Dialog.Title>
                    <Dialog.Input placeholder = 'First Name!' onChangeText = {this._onChaneFist.bind(this)} ></Dialog.Input>
                    <Dialog.Input placeholder = 'Last Name!' onChangeText = {this._onChaneLast.bind(this)} ></Dialog.Input>
                    <View style = {styles.DOB}>
                        <Text style={styles.textDate}>DateOfBirth: {DOB1}</Text>
                        <TouchableOpacity onPress={this._showDateTimePicker}>
                            <Image style = {styles.iconDate} source={date}></Image>
                        </TouchableOpacity>
                        <DateTimePicker
                            isVisible={isDateTimePickerVisible}
                            onConfirm={this._handleDatePicked}
                            onCancel={this._hideDateTimePicker}
                            mode= {'date'}
                            is24Hour = {false}
                        />
                    </View>
                    <Dialog.Input placeholder = 'Address' onChangeText = {this._onChaneAddress.bind(this)} ></Dialog.Input>
                    <Dialog.Input placeholder = 'Phone Number' onChangeText = {this._onChanePhoneNumber.bind(this)} ></Dialog.Input>
                    <View style = {styles.DOB}>
                        <Dialog.Button label="Ok" onPress={this.handleUpdate} />
                        <Dialog.Button label="Cancel" onPress={this.handleCancel} />
                    </View>
                </ScrollView>
                </Dialog.Container>
            </ImageBackground>
        );
  } 
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,    
  },
  container1: {
    flex: 0.8,
    height: '50%'  
  },
  footer: {
    position: 'absolute',
    flex:1,
    right: 0,
    bottom: 10,
 
    },
background:{
    width: null,
    height:null,
  },
  wrapper:{
      paddingHorizontal:15,
  },
    button:{
        paddingVertical: 8,
        marginVertical:3,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
        marginLeft: 20,
        marginRight: 20
    },
  buttonText: {
      fontSize: 16,
      color:'#FFFFFF',
      textAlign: 'center',   
  },
  text: {
    color: '#642EFE',
    fontSize: 20,
    textAlign: 'center'
  },
  textDate: {
    color: '#424040',
    fontSize: 16,
    justifyContent: 'flex-start',
    alignContent: 'center',
    width: '70%',
  },
  ThongTin: {
    alignItems: "flex-start",
    position: "relative",
    borderRadius: 20,
    margin: 10,
    paddingTop: 10,
    paddingBottom: 20
  },
  iconAdd:{
    marginTop: 10,
    width:50,
    height:50,
    },
    DOB: {
        flexDirection: 'row',
        flex: 0.4,
        alignContent: 'center',
    },
    iconDate: {
        width:40,
        height: 40,
        marginLeft: 10,
    },
});