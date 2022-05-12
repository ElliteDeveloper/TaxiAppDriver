import React from 'react';
import AppContainer from './src/navigation/AppNavigator';
import {Asset} from 'expo-asset';
import * as Font from 'expo-font';
// import { AppLoading } from 'expo';
import AppLoading from 'expo-app-loading'
import * as firebase from 'firebase'

var firebaseConfig = {
  apiKey: "AIzaSyBCWOuH1lkPxQu7fox5LFx7YgkvsCDg4Qk",
    authDomain: "skystep.firebaseapp.com",
    databaseURL: "https://skystep.firebaseio.com",
    projectId: "skystep",
    storageBucket: "skystep.appspot.com",
    messagingSenderId: "973504609258",
    appId: "1:973504609258:web:967ed449b538ce4c451093"
};


firebase.initializeApp(firebaseConfig);

export default class App extends React.Component {

  state = {
    assetsLoaded: false,
  };

  constructor(){
    super();
    console.disableYellowBox = true;
  }

//resource load at the time of app loading
  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/background.png'),
        require('./assets/images/logo.png'),
      ]),
      Font.loadAsync({
        'Roboto-Bold': require('./assets/fonts/Poppins-Regular.ttf'),//require('./assets/fonts/Roboto-Bold.ttf'),
        'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
        'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
        'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
        'Roboto-Light': require('./assets/fonts/Roboto-Light.ttf'),
      }),
    ]);
  };
  
  render() {
    return (
        this.state.assetsLoaded ? 
          <AppContainer/>
          :         
          <AppLoading
            startAsync={this._loadResourcesAsync}
            onFinish={() => this.setState({ assetsLoaded: true })}
            onError={console.warn}
            autoHideSplash={true}
          />
    );
  }
}