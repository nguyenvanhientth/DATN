import React, { Component } from 'react';
import {StyleSheet,Text,View,Image,ScrollView,AsyncStorage,TouchableOpacity} from 'react-native';
import env from '../environment/env';

const BASE_URL = env;
var STORAGE_KEY = 'key_access_token';

export default class Request extends Component{
    constructor(props){
        super(props);
        this.state = {
            images: [],
            id: this.props.navigation.getParam('id'),
            content:'',
            address:'',
            repairPersonId: '',
            PersonName: ''
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
                      repairPersonId: resData.supervisorId,
                    });
                    //console.warn('data',this.state.repairPersonId);
                })
                .catch((err) => {
                    console.warn('Error: ',err);
                })
              //person
            let urlPerson = BASE_URL + 'Account/GetStaffInfoById?staffId=' + this.state.repairPersonId;
            fetch(urlPerson,{
                headers: {
                  'cache-control': 'no-cache',
                  Authorization: 'Bearer ' + token,
                  },
              })
                .then((res) => res.json())
                .then((resData) => { 
                  this.setState({
                    PersonName: resData.lastName + resData.firstName,
                    });
                    console.warn('data',this.state.PersonName);
                })
                .catch((err) => {
                    console.warn('Error: ',err);
              })
            })
    }
    renderImage(image) {
        return <Image style={styles.image} source={{uri:image}} />
    }
    
    renderAsset(image) {
        return this.renderImage(image);
    }

    render(){
        return (
            <ScrollView>
                <ScrollView horizontal = {true}>
                {this.state.images ? this.state.images.map(i => <View key={i.uri}>{this.renderAsset(i)}</View>) : null}
                </ScrollView>
                <Text style= {styles.textTitle}>Content: <Text style = {styles.text}>{this.state.content}</Text></Text>
                <Text style={styles.textTitle}>Address: <Text style = {styles.text}>{this.state.address}</Text> </Text>
                <Text style={styles.textTitle}>RepairPerson: <Text style = {styles.text}>{this.state.repairPersonId}</Text></Text>
                <View style={styles.footer}>
                    <TouchableOpacity activeOpacity={.5} onPress={()=>this.props.navigation.navigate('UpdateImagePage')} keyboardShouldPersistTaps={true}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}> Receive </Text>
                        </View>   
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={.5} onPress={()=>this.props.navigation.navigate('UpdateImagePage')} keyboardShouldPersistTaps={true}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}> Finished </Text>
                        </View>   
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal:15,
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
        justifyContent:'center'
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