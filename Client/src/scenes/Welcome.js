import React, { Component, PropTypes, StyleSheet } from 'react';
import { View, Text, Image, IntentAndroid,NativeModules } from 'react-native';
import { Card, Button, COLOR, TYPO } from 'react-native-material-design';
//import CrosswalkWebView from 'react-native-webview-crosswalk';
import AppStore from '../stores/AppStore';
//import WebViewAndroid from 'react-native-webview-android';
//var CrosswalkWebViewManager = NativeModules.CrosswalkWebViewManager;
//module.exports = NativeModules.ToastCustomAndroid;
export default class Welcome extends Component {
    constructor(props) {
      super(props);
      //console.log(props);
      //this._token=props.token;
    }

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };
    componentWillUnmount(){

          // CrosswalkWebViewManager.callWithResponse("wtfWithPara(1,2)", (text) => {
          //   //console.log(text);
          // });
    }
    render() {
        const { navigator } = this.context;
        const theme = AppStore.getState().theme;
        const local = false;
        return (
            
          <View>
          </View>

        );

        
    }


}
var styles = {
  containerWebView: {
    flex: 1,
  }
};