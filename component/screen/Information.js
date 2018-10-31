import React, { Component } from 'react';
import {AppRegistry,StyleSheet,Text,View,Image,ScrollView,
    AsyncStorage,TouchableOpacity,ImageBackground,Picker} from 'react-native';
import env from '../environment/env';
import Dialog from "react-native-dialog";


var STORAGE_KEY = 'key_access_token';
const background = require('../image/hinhnen.jpg') ;
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
            firstName:e
        })
    }
    _onChaneLast=(e)=>{
        this.setState({
            lastName:e
        })
    }
    _onChaneDOB=(e)=>{
        this.setState({
            DOB:e
        })
    }
    _onChaneAddress=(e)=>{
        this.setState({
            Address:e
        })
    }
    _onChanePhoneNumber=(e)=>{
        this.setState({
            PhoneNumber:e
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
            let firstName = this.state.firstName;
            let lastName = this.state.lastName;
            let dateOfBirth = this.state.DOB;
            let address = this.state.Address;
            let PhoneNumber = this.state.PhoneNumber;
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
                              var { navigate } = this.props.navigation;
                              navigate('drawerStack');
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

 render() {
        return (
            <ImageBackground style={[styles.container, styles.background]}
                source = {background}  resizeMode="cover">
                <Text style = {{color: "#0404B4", fontSize: 30}}> Hi {this.state.firstName}</Text>
                <View style={styles.ThongTin}>
                    <Text style = {{fontSize: 32, color: "black", textAlign: 'left'}}>Thong Tin:</Text>
                    <Text style={styles.text}> userName: {this.state.userName} </Text>
                    <Text style={styles.text}> firstName: {this.state.firstName} </Text>
                    <Text style={styles.text}> lastName: {this.state.lastName} </Text>
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
                            <Text style={styles.buttonText}> Update Information </Text>
                        </View>   
                    </TouchableOpacity>
                </View>
                <Dialog.Container visible = {this.state.dialogUpdate}>
                    <Dialog.Title>Update Personal Information</Dialog.Title>
                    <Dialog.Input placeholder = 'First Name!' onChangeText = {this._onChaneFist.bind(this)} ></Dialog.Input>
                    <Dialog.Input placeholder = 'Last Name!' onChangeText = {this._onChaneLast.bind(this)} ></Dialog.Input>
                    <Dialog.Input placeholder = 'DateOfBirth! (mm/dd/yy)' onChangeText = {this._onChaneDOB.bind(this)} ></Dialog.Input>
                    <Dialog.Input placeholder = 'Address' onChangeText = {this._onChaneAddress.bind(this)} ></Dialog.Input>
                    <Dialog.Input placeholder = 'Phone Number' onChangeText = {this._onChanePhoneNumber.bind(this)} ></Dialog.Input>
                    <Dialog.Button label="Ok" onPress={this.handleUpdate} />
                    <Dialog.Button label="Cancel" onPress={this.handleCancel} />
                </Dialog.Container>
            </ImageBackground>
        );
  } 
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,    
  },
  footer: {
    position: 'absolute',
    flex:1,
    left: 0,
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
        backgroundColor:"#5858FA",
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
    color: 'black',
    fontSize: 20,
    textAlign: 'center'
  },
  ThongTin: {
    backgroundColor: '#fff',
    alignItems: "flex-start",
    position: "relative",
    borderRadius: 20,
    margin: 10,
    paddingTop: 10,
    paddingBottom: 20
  },
});