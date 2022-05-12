import React, { Component } from 'react';
import { 
    StyleSheet,
    View,
    AsyncStorage,                   
    Image,
    ActivityIndicator,
    Alert
  } from 'react-native';
import { LoginComponent, Background, ForgotPassModal } from '../components';
import * as firebase from 'firebase'
import  languageJSON  from '../common/language';
import { colors } from '../common/theme';
import { Button } from 'react-native-elements';

import { LoginButton, LoginManager, AccessToken } from 'react-native-fbsdk';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
// import * as AppleAuthentication from 'expo-apple-authentication';
import appleAuth, { AppleButton,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
  AppleAuthCredentialState,
  AppleAuthError,} from '@invertase/react-native-apple-authentication';
// import {GoogleSignin} from "react-native-google-signin";
import { GoogleSignin } from "@react-native-community/google-signin";
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Crypto from "expo-crypto";

GoogleSignin.configure({
  offlineAccess: true,
  webClientId: Platform.OS=='ios'?"973504609258-15d2qudohcvi1bedp358bk8m4lgvpttr.apps.googleusercontent.com":"973504609258-so1vh038vm48kjk9pco1gm4dhvpnam16.apps.googleusercontent.com",
  androidClientId: '973504609258-0iotvuhh5aaimv8ms0gb41n11luvbr2o.apps.googleusercontent.com',
  scopes: ['profile', 'email']
});

export default class LoginScreen extends Component {
    constructor(props){
      super(props);
      this.state = {
        email:'',
        password:'',
        emailValid:true,
        passwordValid:true,
        driver: '',
        showForgotModal:false,
        emailerror:null,
        loading: false,
        progressVisible:false
      }
      
    }

    closeModal(){ 
      this.setState({ showForgotModal: false })
    }

    //go to register page
    onPressRegister() {
      this.props.navigation.navigate('DriverReg');
    }

    //forgot password press
    forgotPassPress() {
        this.setState({showForgotModal:true})
    }
    
    onPressForgotPass(email) {
      var auth = firebase.auth();
      return auth.sendPasswordResetEmail(email)
        .then((res) =>{
        //console.log("A Password Reset Link sent to your email please check and reset your New Password")
        this.setState({showForgotModal:false},()=>{
          setTimeout(() => {
            alert(languageJSON.password_reset_link)        
          }, 600);
        });
      })
      .catch((error) =>{
        //console.log("email not sent"+error)
        alert(error)  
      })
    }

    //on press login after all validation
    async onPressLogin(email, password){
      // alert(password)
      this.setState({progressVisible:true})
      this.setState({loading: true},()=>{

        firebase.auth().signInWithEmailAndPassword(email,password)
        .then( res => {
          console.log(res);
          this.setState({progressVisible:false, loading: false}); 
        }).catch(res=>{
          this.setState({progressVisible:false})

          alert(res.message);
          this.setState({loading: false}); 
        })

      })
    }

    _onGoogleLogin = async () => {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      GoogleSignin.signIn()
          .then(data => {
              const credential = auth.GoogleAuthProvider.credential(data.idToken);
              return auth().signInWithCredential(credential);
          })
          .then(user => {
              // console.warn('user: ', user);
              // this.updateUserProfile(user.user.uid, user.user.displayName, user.user.email, "g+", user.user.photoURL + '?sz=300');
          })
          .catch(error => {
            console.log(error)
              const {code, message} = error;
              alert(message + " Errorcode " + code);
          });
    };
  
    updateUserProfile(uid, name, email, loginWith, photoUrl) {
      // var userName = name.split(" ").join("_");
      var userRef = 
          database()
          .ref("users/" + uid);
      userRef.once("value").then(snapshot => {
          if (snapshot.exists()) {
              // if (loginWith == "FB") {
              //     this.openDrawerPage("facebookloggedin");
              //     return;
              // }
              // this.openDrawerPage("googleLoggedin");
          } else {
              userRef
                  .set({
                      uid: uid,
                      email: email,
                      userName: name,
                      fullName: name,
                      latitude: 0,
                      user_Dob: "0",
                      longitude: 0,
                      isVarified: true,
                      isLogin: true,
                      profileImageURL: photoUrl
                  })
                  .then(ref => {
                      // var userRef = firebase
                      // .database()
                      // .ref("Users/FaithMeetsLove/ChatUserList/" + uid)
                      // .set({
                      //     ids:uid,
                      //     online: true
                      // });
  
                      // if (loginWith == "FB") {
                      //     this.openDrawerPage("facebookloggedin");
                      //     return;
                      // }
                      // this.openDrawerPage("googleLoggedin");
                  });
          }
      });
    }
  
    async openDrawerPage(_val) {
      // AsyncStorage.setItem("checkLoggedType", _val);
      // var fullName;
      // var gender;
      // var latitude;
      // var longitude;
      // var email;
      // var user_Dob;
      // var profileImageURL;
      // var uidUser = await firebase.auth().currentUser.uid;
      // var displayUserInfo = firebase
      //     .database()
      //     .ref("Users/FaithMeetsLove/Registered/" + uidUser);
      // await displayUserInfo.once("value").then(snapshot => {
      //     fullName = snapshot.val().fullName;
      //     gender = snapshot.val().gender;
      //     latitude = snapshot.val().latitude;
      //     longitude = snapshot.val().longitude;
      //     email = snapshot.val().email;
      //     user_Dob = snapshot.val().user_Dob;
      //     profileImageURL = snapshot.val().profileImageURL;
      // });
  
      // AsyncStorage.setItem("reg_user_name", fullName);
      // AsyncStorage.setItem("reg_user_gender", "" + gender);
      // AsyncStorage.setItem("reg_user_latitude", "" + latitude);
      // AsyncStorage.setItem("reg_user_longitude", "" + longitude);
      // AsyncStorage.setItem("reg_user_email", email);
      // AsyncStorage.setItem("reg_user_dob", user_Dob);
      // AsyncStorage.setItem("reg_user_profileImageURL", profileImageURL);
  
      // if (Platform.OS === "android") {
      //     if (apiVersion >= 23) {
      //         this.requestLocationPermission(_val);
      //     } else {
      //         Actions.home();
      //     }
      // } else {
      //     Actions.home();
      // }
  }

  async FbLogin() {
    LoginManager.logInWithPermissions(["public_profile", "email"]).then(
      function(result) {
        if (result.isCancelled) {
          console.log("==> Login cancelled");
        } else {
          console.log(
            "==> Login success with permissions: " +
              result.grantedPermissions.toString()
          );
        }
       },
       function(error) {
        console.log("==> Login fail with error: " + error);
       }
     );

    // try {
    //   await Facebook.initializeAsync({
    //     appId: '438262897026677',
    //   });
    //   const {
    //     type,
    //     token
    //   } = await Facebook.logInWithReadPermissionsAsync({
    //     permissions: ['public_profile', "email"],
    //   });
    //   if (type === 'success') {

    //     // Get the user's name using Facebook's Graph API
    //     const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
    //     const credential = firebase.auth.FacebookAuthProvider.credential(token);
    //     firebase.auth().signInWithCredential(credential)
    //       .then((user) => {
    //         console.log('user', user)
    //         if (user) {
    //           if (user.additionalUserInfo.isNewUser == true) {
    //             //console.log("user found");
    //             var data = user.additionalUserInfo;
    //             this.props.navigation.navigate("Reg", { requireData: data })
    //           } else {
    //             this.props.navigation.navigate('Root');
    //           }
    //         }
    //       }).catch(error => {
    //         console.log('error', error);
    //         alert(languageJSON.facebook_login_error)
    //       }
    //       )
    //   } else {
    //     // type === 'cancel'
    //   }
    // } catch ({ message }) {
    //   alert(languageJSON.facebook_login_auth_error`${message}`);
    // }
  }

   appleSigin = async () => {

    const csrf = Math.random().toString(36).substring(2, 15);
    const nonce = Math.random().toString(36).substring(2, 10);
    const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce);
    try {
      // const applelogincredentials = await appleAuth.signInAsync({
      //   requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      //   state: csrf,
      //   nonce: hashedNonce
      // });
      // const provider = new firebase.auth.OAuthProvider('apple.com');
      // const credential = provider.credential({
      //   idToken: applelogincredentials.identityToken,
      //   rawNonce: nonce,
      // });
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
    
      const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
    
    
      if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
        // user is authenticated
        firebase.auth().signInWithCredential(credential)
          .then((user) => {
            if (user) {
              if (user.additionalUserInfo.isNewUser == true) {
                var data = user.additionalUserInfo;
                this.props.navigation.navigate("Reg", { requireData: data })
              } else {
                this.props.navigation.navigate('Root');
              }
            }
          })
          .catch((error) => {
            alert("Apple Signin is not configured in developer.appple.com");
            console.log(error);
          });
      }
      

    } catch (e) {
      if (e.code === 'ERR_CANCELED') {
          console.log("Cencelled");
      } else {
        console.log(e);
        alert(e);
      }
    }
  }

  render() {
    // if (this.state.progressVisible) {
    //   return (
    //       <View style={[styles.containerLoader, styles.horizontal]}>
    //           {/* <Image source={Images.loginLogo} style={styles.logoStyle}/> */}
    //           <ActivityIndicator size="large" color="grey"/>
    //       </View>
    //   );
    // } else {
      return (
        <Background>
            <View style={styles.logo}>
                <Image source={require('../../assets/images/logo.png')} />
            </View>
            <View style={styles.logInCompStyl}/>
            <View style={styles.containerView}>
              <LoginComponent
                complexity={'any'}
                loading={this.state.loading}
                onPressRegister={()=>{this.onPressRegister()}} 
                onPressLogin={(email, password)=>this.onPressLogin(email, password)} 
                onPressForgotPassword={()=>{this.forgotPassPress()}}
              />
              
            </View>

            <ForgotPassModal
                modalvisable={this.state.showForgotModal}
                requestmodalclose={()=>{this.closeModal()}}

                inputEmail={this.state.email}
                emailerrorMsg={this.state.emailerror}
                onChangeTextInput={(value)=>{this.setState({emailerror:null,email:value})}}
                
                onPressForgotPass={(email)=>this.onPressForgotPass(email)} 
            />

          <View style={styles.facebookButtonStyle}>
            {/* <TouchableOpacity onPress={()=> this._onGoogleLogin()} style={{width:'80%', backgroundColor:'red', padding:10, justifyContent:'center', alignItems:'center', borderRadius:20, marginTop:'50%'}}>
              <Text style={{color:'white'}}>Google</Text>
            </TouchableOpacity> */}
            <Button
              title="Google Login"
              icon={
                <Icon
                  name="google"
                  size={15}
                  color="white"
                />
              }
              loading={false}
              titleStyle={styles.fbButtonTitleStyle}
              loadingProps={{ size: "large", color: colors.BLUE.default.primary }}
              buttonStyle={styles.googleLoginButtonStyle}
              containerStyle={styles.fbLoginButtonContainer}
              onPress={() => { this._onGoogleLogin() }}
            />
          </View>
          <View style={styles.facebookButtonStyle}>
            <Button
              title="Facebook Login"
              icon={
                <Icon
                  name="facebook"
                  size={15}
                  color="white"
                />
              }
              loading={false}
              titleStyle={styles.fbButtonTitleStyle}
              loadingProps={{ size: "large", color: colors.BLUE.default.primary }}
              buttonStyle={styles.fbLoginButtonStyle}
              containerStyle={styles.fbLoginButtonContainer}
              onPress={() => { this.FbLogin() }}
            />
          </View>
          {Platform.OS == 'ios' ?
            <View style={styles.facebookButtonStyle2}>
              <AppleButton
                buttonType={AppleButton.Type.SIGN_IN}
                buttonStyle={AppleButton.Style.BLACK}
                cornerRadius={5}
                style={{ width: 200, height: 44, elevation: 5,shadowColor: colors.BLACK,shadowRadius: 10,shadowOpacity: 0.6,hadowOffset: { width: 0, height: 4 } }}
                onPress={() => { this.appleSigin() }}
              />
            </View>
            : null} 
          <ForgotPassModal
            modalvisable={this.state.showForgotModal}
            requestmodalclose={() => { this.closeModal() }}
            inputEmail={this.state.email}
            emailerrorMsg={this.state.emailerror}
            onChangeTextInput={(value) => { this.setState({ emailerror: null, email: value }) }}
            onPressForgotPass={(email) => this.onPressForgotPass(email)}
          />
          
        </Background>
     );
    }
    
  // }
}

//Screen Styling
const styles = StyleSheet.create({
    containerView: {flex: 1, marginTop:70, justifyContent:'center', alignItems:'center'},
    containerLoader: {
        flex: 1,
        justifyContent: "center"
    },
    horizontal: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 30
    },
    logo:{
        flex:1,
        position:'absolute',
        top:80,
        width:'100%',
        justifyContent:"flex-end",
        alignItems:'center'      
    },
    logInCompStyl:{
        height: 100
    },

    facebookButtonStyle: {
      flex: 0.2,
      alignItems: "center"
    },
    facebookButtonStyle2: {
      flex: 0.4,
      alignItems: "center",
     
    },
    fbButtonTitleStyle: {
      fontSize: 16,
      paddingLeft:10
    },
    fbLoginButtonStyle: {
      backgroundColor: 'blue',
      height: 44,
      width: 200,
      //borderRadius: 210 / 2,
    },
    googleLoginButtonStyle: {
      backgroundColor: 'red',
      height: 44,
      width: 200,
      //borderRadius: 210 / 2,
    },
    fbLoginButtonContainer: {
      flex: 1,
      elevation: 5,
      shadowColor: colors.BLACK,
      shadowRadius: 10,
      shadowOpacity: 0.6,
      shadowOffset: { width: 0, height: 4 }
    },
});