import React, { Component } from 'react';
import {StyleSheet,Text,View,Image,ScrollView,AsyncStorage,TouchableOpacity} from 'react-native';
import env from '../environment/env';

const BASE_URL = env;
var STORAGE_KEY = 'key_access_token';

export default class Request extends Component{
    static navigationOptions = {
        headerMode: 'none',
        title: 'Detail',
        headerStyle: {
            backgroundColor: '#189B8B',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
      };
    constructor(props){
        super(props);
        this.state = {
            images: [],
            id: this.props.navigation.getParam('id'),
            content:'',
            address:'',
            repairPersonId: '',
            PersonName: '',
            Position:''
        }
    }
    componentDidMount(){
        AsyncStorage.getItem(STORAGE_KEY).then((user_data_json) => {
            let token = user_data_json;   
            if(token === undefined){
              var { navigate } = this.props.navigation;
              navigate('LoginPage');
            } 
            let id = this.state.id;   
            let url = BASE_URL + 'Request/GetRequestById?requestId=' + id;
            fetch(url,{
                headers: {
                  Authorization: 'Bearer ' + token,
                  },
              })
                .then((res) => res.json())
                .then((resData) => { 
                  this.setState({
                      images : resData.pictureRequest,
                      content: resData.content,
                      address: resData.address,
                      repairPersonId: resData.timeBeginRequest,
                    });
                    //console.warn('data',this.state.repairPersonId);
                })
                .catch((err) => {
                    console.warn('Error: ',err);
                })
            //   //person
            // let urlPerson = BASE_URL + 'Account/GetStaffInfoById?staffId=' + this.state.repairPersonId;
            // fetch(urlPerson,{
            //     headers: {
            //       'cache-control': 'no-cache',
            //       Authorization: 'Bearer ' + token,
            //       },
            //   })
            //     .then((res) => res.json())
            //     .then((resData) => { 
            //       this.setState({
            //         PersonName: resData.lastName + resData.firstName,
            //         });
            //         console.warn('data',this.state.PersonName);
            //     })
            //     .catch((err) => {
            //         console.warn('Error: ',err);
            //   })
            //})
            //----------------------------------------------------------------------------
            fetch(BASE_URL + "Account/GetUserInformation",{
                //method: "GET",
                headers:{ 
                    'cache-control': 'no-cache',
                    Authorization: 'Bearer ' + token,
                    }
                })
                .then((res)=>res.json())
                .then((resJson) => {
                    //console.warn("resJson",resJson);debugger;
                    this.setState({
                        Position: resJson.role,
                    });   
                   // console.warn(this.state.Position)    
                })
                .catch ((error) => {
                    console.warn('AsyncStorage error:' + error.message);
                }) 
            })
    }
    renderImage(image) {
        return <Image style={styles.image} source={{uri:image}} />
    }
    
    renderAsset(image) {
        return this.renderImage(image);
    }
    _receive = () =>{
        AsyncStorage.getItem(STORAGE_KEY).then((user_data_json) => {
            let token = user_data_json;   
            if(token === undefined){
              var { navigate } = this.props.navigation;
              navigate('LoginPage');
            } 
            let id = this.state.id;   
            let url = BASE_URL + 'Request/RepairPersonReceive';
            fetch(url,{
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                  },
                body: JSON.stringify({
                    'RequestId': id
                })
              })
              .then((responseJSON) => {  
                  //console.warn(responseJSON);
                    if(responseJSON.ok){
                        this.props.navigation.navigate('drawerStack');
                        alert('Reqair Success!');
                    }
                    else {
                        alert('Reqair False!');
                    }
                    
                })
                .catch((err) => {
                    console.warn('Error: ',err);
                })
        })
    }
    _finish = () =>{
        AsyncStorage.getItem(STORAGE_KEY).then((user_data_json) => {
            let token = user_data_json;   
            if(token === undefined){
              var { navigate } = this.props.navigation;
              navigate('LoginPage');
            } 
            let id = this.state.id;   
            let url = BASE_URL + 'Request/SupervisorConfirm';
            fetch(url,{
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                  },
                body: JSON.stringify({
                    'RequestId': id
                })
              })
              .then((responseJSON) => {  
                  console.warn(responseJSON);
                    if(responseJSON.ok){
                        this.props.navigation.navigate('drawerStack');
                        alert('Confirm Success!');
                    }
                    else {
                        alert('Confirm False!');
                    }
                    
                })
                .catch((err) => {
                    console.warn('Error: ',err);
                })
        })
    }
    render(){
        if(this.state.Position !== "Supervisor"){
            return (
                <ScrollView style = {styles.container}>
                    <ScrollView horizontal = {true} style = {{marginTop: 10}}>
                    {this.state.images ? this.state.images.map(i => <View key={i.uri}>{this.renderAsset(i)}</View>) : null}
                    </ScrollView>
                    <Text style= {styles.textTitle}>Content: <Text style = {styles.text}>{this.state.content}</Text></Text>
                    <Text style={styles.textTitle}>Address: <Text style = {styles.text}>{this.state.address}</Text> </Text>
                    <Text style={styles.textTitle}>TimeRequest: <Text style = {styles.text}>{this.state.repairPersonId}</Text></Text>
                    <View style={styles.footer}>
                        <TouchableOpacity  onPress={this._receive.bind(this)} keyboardShouldPersistTaps={true}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}> Receive </Text>
                            </View>   
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={.5} onPress={()=>this.props.navigation.navigate('FinishPage',{id:this.state.id})} keyboardShouldPersistTaps={true}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}> Finished </Text>
                            </View>   
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )
        }
        else {
            return (
                <ScrollView style = {styles.container}>
                    <ScrollView horizontal = {true}>
                    {this.state.images ? this.state.images.map(i => <View key={i.uri}>{this.renderAsset(i)}</View>) : null}
                    </ScrollView>
                    <Text style= {styles.textTitle}>Content: <Text style = {styles.text}>{this.state.content}</Text></Text>
                    <Text style={styles.textTitle}>Address: <Text style = {styles.text}>{this.state.address}</Text> </Text>
                    <Text style={styles.textTitle}>TimeRequest: <Text style = {styles.text}>{this.state.repairPersonId}</Text></Text>
                    <View style={styles.footer}>
                        <TouchableOpacity  onPress={this._finish.bind(this)} keyboardShouldPersistTaps={true}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}> Confirm </Text>
                            </View>   
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal:15,
        backgroundColor: '#E5E5E5'
    },
    image: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
        marginLeft: 10
    },
    text: {
        padding: 10,
        marginTop: 1,
        justifyContent: 'flex-start',
        fontSize: 20,
        color: 'black'

    },
    textTitle: {
        padding: 10,
        justifyContent: 'flex-start',
        fontSize: 23,
        color: '#0101DF',
        fontFamily: 'Helvetica',
        fontWeight:'bold',
        fontStyle: 'italic'
    },
    footer: {
        flex:0.2,
        flexDirection: 'row',
        justifyContent:'center',
        bottom: 0,
        left: 0,
        right: 0,
    },
    button:{
        backgroundColor:"#5858FA",
        paddingVertical: 8,
        marginVertical:3,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
        marginLeft: 20
    },
    buttonText: {
        fontSize: 16,
        color:'#FFFFFF',
        textAlign: 'center',   
    },
})