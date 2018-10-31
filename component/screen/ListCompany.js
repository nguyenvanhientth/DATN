import React, { Component } from "react";
import { Text, TouchableOpacity, View, StyleSheet, FlatList, AsyncStorage,Image } from "react-native";
import Dialog from "react-native-dialog";
import env from '../environment/env';

const BASE_URL = env;
var STORAGE_KEY = 'key_access_token';
const edit = require('../image/edit.png') ;
 
export default class ListChecked extends Component {
    static navigationOptions = {
        title: 'List Users',
    };
    constructor(props){
        super(props);
        this.state = {
            data: [],
            dialogStatus: false,
            id:'',
            dialogEdit: false,
            companyName:'',
            addressCompany: ''
    }
  };
  componentDidMount(){
    AsyncStorage.getItem(STORAGE_KEY).then((user_data_json) => {
        let token = user_data_json;   
        if(token === undefined){
          var { navigate } = this.props.navigation;
          navigate('LoginPage');
        }    
        let url = BASE_URL + 'Company/GetAllCompany';
        fetch(url,{
            headers: {
              'cache-control': 'no-cache',
              Authorization: 'Bearer ' + token,
              },
          })
          .then((res) => res.json())
          .then((resData) => { 
              this.setState({
                  data : resData
                });
                //console.warn('data',this.state.data);
            })
          .catch((err) => {
            console.warn(' loi update Area1',err);
          })
        })
    }
 
  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          flex: 1,
          backgroundColor: "#607D8B",
          paddingHorizontal: 5,
        }}
      />
    );
  }
  changeStatus =(id) =>{
    this.setState({
        dialogStatus: true,
        id: id,
    })
  }
  handleCancel = ()=>{
    this.setState({
        dialogStatus: false,
        dialogEdit: false
    })
  }
  handleChange = () =>{
    AsyncStorage.getItem(STORAGE_KEY).then((user_data_json) => {
        let token = user_data_json;  
        let serviceUrl = BASE_URL+  "Company/ChangeCompanyStatus";
        let id = this.state.id;
        // kiem tra o day 
          fetch(serviceUrl,{
              method: "PUT",          
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token,
              },
          body: JSON.stringify({
              'CompanyId': id,
              })
          })
              .then((responseJSON) => {  
                  //console.warn('creacte company',responseJSON)
                      if(responseJSON.ok){
                          this.componentDidMount();
                          alert('Change Success!');
                      }
                      else {
                          alert('Change False!');
                      }
                      
              })
              .catch((error) => {
                  console.warn('Error: ',error);
              });  
      })
      this.setState({
          dialogStatus:false,
      })
  }
    _onChaneName=(e)=>{
        this.setState({
            companyName: e
    })
}
    _onChaneAddress=(e)=>{
        this.setState({
            addressCompany: e
    })
}
  handleEdit = () =>{
    AsyncStorage.getItem(STORAGE_KEY).then((user_data_json) => {
        let token = user_data_json;  
        let serviceUrl = BASE_URL+  "Company/ChangeInformationCompany";
        let id = this.state.id;
        let name = this.state.companyName;
        let address = this.state.addressCompany;
        // kiem tra o day 
          fetch(serviceUrl,{
              method: "PUT",          
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token,
              },
          body: JSON.stringify({
              'CompanyId': id,
              'Name': name,
              'Address':address
              })
          })
              .then((responseJSON) => {  
                  //console.warn('creacte company',responseJSON)
                      if(responseJSON.ok){
                          this.componentDidMount();
                          alert('Edit Success!');
                      }
                      else {
                          alert('Edit False!');
                      }
                      
              })
              .catch((error) => {
                  console.warn('Error: ',error);
              });  
      this.setState({
          dialogEdit: false
      })
  })
}

  _renderList = ({ item }) => {
    return (
     <TouchableOpacity style={styles.flatview} onPress={() =>this.changeStatus(item.id)}>
        <View style = {styles.nameList}>
            <Text style={styles.name} >{item.name}</Text>
            <Text style={styles.address} >Address: {item.address}</Text>
            <Text style={styles.status} >Status: {String(item.status)}</Text>
        </View>
        <TouchableOpacity style= {styles.iconWrap} onPress = {()=>this.setState({dialogEdit: true,id:item.id})}><Image source = {edit} style={styles.icon} /></TouchableOpacity>
     </TouchableOpacity>
    );

  }

  render() {
    return (
      <View style={styles.container} > 
        <Text style={styles.h2text}>
          Company 
        </Text>
          <FlatList
          data={this.state.data}
          ItemSeparatorComponent = {this.FlatListItemSeparator}
          renderItem={this._renderList}
          keyExtractor={item => item.id}
        />
        <Dialog.Container visible = {this.state.dialogStatus}>
            <Dialog.Title> You are want change status! </Dialog.Title>
            <Dialog.Button label="Ok" onPress={this.handleChange} />
            <Dialog.Button label="Cancel" onPress={this.handleCancel} />
        </Dialog.Container>
        <Dialog.Container visible = {this.state.dialogEdit}>
            <Dialog.Title> Edit Company! </Dialog.Title>
            <Dialog.Input placeholder = 'Company Name' onChangeText = {this._onChaneName.bind(this)} ></Dialog.Input>
            <Dialog.Input placeholder = 'Address' onChangeText = {this._onChaneAddress.bind(this)} ></Dialog.Input>
            <Dialog.Button label="Ok" onPress={this.handleEdit} />
            <Dialog.Button label="Cancel" onPress={this.handleCancel} />
        </Dialog.Container>
      </View>
    );
  }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      //alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    h2text: {
      marginTop: 10,
      fontFamily: 'Helvetica',
      fontSize: 36,
      fontWeight: 'bold',
      alignItems: 'center',
      textAlign: 'center'
    },
    flatview: {
      justifyContent: 'flex-start',
      flex: 1,
      flexDirection: 'row',
      backgroundColor: '#CECEF6',
      paddingRight: 100,
      
    },
    name: {
      fontFamily: 'Verdana',
      fontSize: 18,
    },
    address: {
      color: '#4000FF',
      justifyContent: 'flex-start'
    },
    status: {
        color: 'red',
        right: 0
      },
    footer: {
        flex:1,
        backgroundColor:'#1C1C1C',
        height: 1,
    },
    icon:{
       width: 25,
       height: 25,
        },
    iconWrap:{
        paddingHorizontal:7,
        alignItems: "center",
        justifyContent: 'center',
        alignContent: "center",
        position: 'absolute',
        flex:1,
        right: 10,
        top: 20
        },
    nameList: {
        left: 0,
        padding: 10
    },
})