import React, {Component} from 'react';
import {Button, Modal, Text, TouchableHighlight, View, Alert} from 'react-native';

let name = "Bob"
let isFemale=false;
let himHer = "him"
let hisHer = "his"
if(isFemale)
{
  himHer="her";
  hisHer="her"
}
export default class ModalExample extends Component {
  state = {
    modalVisible: false,
  };
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    return (
      <View style={{marginTop: 22}}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{left:"12%",width:"75%",height:200,top:"25%",backgroundColor:'white',borderColor:"black",borderWidth:"2",borderRadius:15}}>
            <View style={{fontSize:24,color:'white',top: 0,backgroundColor:"#63289a",alignSelf:"center",width:"100%",
            borderTopEndRadius:13,borderTopStartRadius:13}}>
              <Text style={{fontSize:24,color:'white',top: "15%",alignSelf:"center"}}>Notice</Text>
              
              <TouchableHighlight style={{backgroundColor:'#ff2ae8',top: 125,width:"25%",alignSelf:"center",borderRadius:25}}>
              
                <Button  onPress={() => 
                { this.setModalVisible(!this.state.modalVisible);}} color="white"title="OK" type="solid" />
              </TouchableHighlight>
            </View>
            <Text style={{fontSize:16,color:'black',top: "10%",alignSelf:"center",textAlign:"center"}}>Looks like {name} hasn't responded!
            </Text>
              <Text style={{fontSize:16,color:'black',top: "10%",alignSelf:"center",textAlign:"center"}}>
              Ask some questions to get to know {himHer} and see {hisHer} photo.
              </Text>

          </View>
        </Modal>

        <TouchableHighlight
          onPress={() => {
            this.setModalVisible(true);
          }}>
          <Text>Show Modal</Text>
        </TouchableHighlight>
      </View>
    );
  }
}