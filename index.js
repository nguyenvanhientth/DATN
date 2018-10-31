/** @format */
import React from 'react'
import {AppRegistry, Text,Image } from 'react-native'
import { DrawerNavigator,StackNavigator} from 'react-navigation';
import {name as appName} from './app.json';

import Splash from './component/screen/Splash';
import Login from './component/screen/Login';
import ForgotPassword from './component/screen/ForgotPassword';
import Main from './component/screen/Main';
import Information from './component/screen/Information';
import ChanePassword from './component/screen/ChanePassword';
import Logout from './component/screen/Logout';
import UpdateImage from './component/screen/UpdateImage';
import SignUpPage from './component/screen/SignUpPage';
import maps from './component/screen/maps/maps';
import ListCompany from './component/screen/ListCompany';
import SelectedRequest from './component/screen/SelectedRequest';

const menuIcon = require('./component/image/menuIcon.png') ;

const DrawerStack = DrawerNavigator({
  Main: { screen: Main },
  PersonalInformation: { screen: Information },
  ChanePassword: { screen: ChanePassword },
  Logout: { screen: Logout },
},
{
  drawerPosition: "right", // edit drawer stack
})

const DrawerNavigation = StackNavigator({
  DrawerStack: { screen: DrawerStack },
}, {
  headerMode: 'float',
  navigationOptions: ({navigation}) => ({
    headerStyle: {backgroundColor: '#288BF5'},
    title: 'Main',
    headerRight: <Text onPress={() => navigation.openDrawer()} style = {{
        alignItems: 'center',
        width:40,height:40}}
        >
          <Image source={menuIcon} style={{width:25,height:25,}} />
      </Text>, 
  })
})

const login = StackNavigator({
  SplashPage: { screen: Splash },
  LoginPage: { screen: Login},
});

const MyApp = StackNavigator({
  drawerStack: { screen: DrawerStack,
    headerMode: 'float',
    navigationOptions: ({navigation}) => ({
      headerStyle: {backgroundColor: '#288BF5'},
      title: 'Main',
      headerRight: <Text onPress={() => navigation.openDrawer()} style = {{
          alignItems: 'center',
          width:40,height:40}}
          >
            <Image source={menuIcon} style={{width:25,height:25,}} />
        </Text>, 
    })},
  UpdateImagePage: {screen: UpdateImage},
  SignUpPage:{screen: SignUpPage},
  MapsPage: {screen: maps},
  ForgotPassPage: { screen: ForgotPassword },
  ListCompanyPage: {screen: ListCompany},
  CheckedPage: {screen: SelectedRequest},
},);

const PrimaryNav = StackNavigator({
  loginStack: { screen: login },
  MainStack: {screen: MyApp},
  drawerStack: { screen: DrawerNavigation, }
}, {
  // Default config for all screens
  headerMode: 'none',
  title: 'Main',
  initialRouteName: 'loginStack', //**********comment */
  
})

AppRegistry.registerComponent(appName, () => PrimaryNav);