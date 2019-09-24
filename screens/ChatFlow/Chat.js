import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  RefreshControl,
  Image,
  ImageBackground,
  Dimensions
} from 'react-native';
import ChatMain from './chatMain'
import Header from "./ComponentHeader";
//import console = require("console");
//import { url } from "inspector";
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
//import console = require("console");
var {height, width}= Dimensions.get('window')

export default class Chat extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      value:0.2,
      currentTime:90,
      currentSlider:0,
      blurRadius: 10,
      intervalId:null,
      maxVal:90
    }
  }
  componentDidMount = () => {
    const id = setInterval(this.handleTimer, 1000)
    this.setState({
      intervalId:id,
      maxVal:this.state.currentTime
    })
  }
  handleTimer = () => {

    let timer = this.state.currentTime
    let slider = this.state.currentSlider
    let blurR = this.state.blurRadius
    //console.log(this.props.message)

      this.setState({
        currentTime:--timer,
        currentSlider:++slider,
      })
      if(this.state.currentTime === 0){
        this.props.backToUsers()
        clearInterval(this.state.intervalId)
      }


  }
  static navigationOptions = {
    //header: null,
    title: 'Match Chat',
    headerStyle: {
      backgroundColor: '#18cdf6',
    },
    footerStyle: {
      backgroundColor: '#fff',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize:24
    },
  };
  render() {
    const { refreshing = true } = this.props;

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <Header text={this.props.chatWithUser}>
          {this.props.inChatRoom && (
            <TouchableOpacity onPress={this.props.backToUsers}>
              <View style={styles.leave_button}>
                <Text style={styles.leave_button_text}>Leave</Text>
              </View>
            </TouchableOpacity>
          )}
        </Header>

        <View style={styles.body}>
          <ScrollView
            style={styles.messages}
            contentContainerStyle={styles.scroll_container}
            ref={this.props.setScrollViewRef}
            refreshControl={
              <RefreshControl
                refreshing={this.props.refreshing}
                onRefresh={this.props.loadPreviousMessages}
              />
            }>

            <Image
              style={{width:40,height:40,borderRadius:20}}
              blurRadius={this.state.currentTime/20}
              source={{uri: "https://media.gq.com/photos/56d4902a9acdcf20275ef34c/master/w_806,h_1173,c_limit/tom-hardy-lead-840.jpg"}}
            />
            <Image
              style={{left:45,top:-30,width:this.state.maxVal*2,height:10}}
              source={require('../../assets/Assets_V1/greybar.jpg')}

            />
            <Image
              style={{left:45,top:-40,width:this.state.currentSlider*2,height:10}}
              source={require('../../assets/Assets_V1/bluebar.jpg')}

            />
            <Text  style={{left:45,top:-40, color:"#18cdf6"}} >
                {Math.ceil(this.state.currentTime)} sec left
              </Text>
            <Image
              style={{left:width*.775,top:height*.525, width:80,height:80,borderRadius:40}}
              source={require('../../assets/Assets_V1/Ghost/Ghost_Pink/Ghosty_Pink@1.png')}
            />
                        <FlatList data={this.props.messages} renderItem={this.renderItem} />

          </ScrollView>

          {this.props.chatWithUserIsTyping && (
            <View style={styles.typing_indicator}>
              <Text style={styles.typing_indicator_text}>
                {this.props.chatWithUser} is typing...
              </Text>
            </View>
          )}
          <View style={styles.message_box}>
            <TextInput
              style={styles.text_field}
              multiline={true}
              onChangeText={this.props.updateMessage}
              value={this.props.message}
              placeholder="Type your message..."
            />

            <View style={styles.button_container}>
              {this.props.inChatRoom && (
                <TouchableOpacity onPress={this.props.sendMessage}>
                  <View style={styles.send_button}>
                    <Text style={styles.send_button_text}>Send</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>

        </View>


      </KeyboardAvoidingView>
    );
  }

  // next: add renderItem
  // app/screens/Chat.js
  renderItem = ({ item }) => {

    let box_style = item.isCurrentUser ? 'current_user_msg' : 'other_user_msg';
    let username_style = item.isCurrentUser
      ? 'current_user_username'
      : 'other_user_username';

    //alert('line 81, item:',item);
    return (
      <View key={item.key} style={styles.msg}>
        <View style={styles.msg_wrapper}>
          <View style={styles.username}>
            <Text style={[styles.username_text, styles[username_style]]}>
              {item.username}
            </Text>
          </View>
          <View style={[styles.msg_body, styles[box_style]]}>
            <Text style={styles[`${box_style}_text`]}>{item.msg}</Text>
          </View>
        </View>
      </View>
    );
  };
}

// previously added styles here..

const styles = StyleSheet.create({
  container: {
    flex: 10,
    alignSelf: "stretch"
  },
  leave_button: {
    marginRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FFF"
  },
  leave_button_text: {
    color: "#FFF",
    fontSize: 16
  },
  body: {
    flex: 9,
  },
  scroll_container: {
    paddingBottom: 20
  },
  messages: {
    flex: 8,
    flexDirection: "column",
    padding: 8
  },
  current_user_msg: {
    backgroundColor: "#439bff",
    alignSelf: "flex-end",
    alignItems: "flex-end"
  },
  current_user_msg_text: {
    color: "#fff"
  },
  current_user_username: {
    opacity: 0
  },

  other_user_msg: {
    backgroundColor: "#f6f8fa",
    alignSelf: "flex-start",
    alignItems: "flex-start"
  },
  other_user_msg_text: {
    color: "#333"
  },
  other_user_username: {
    color: "#484848"
  },
  message_box: {
    flex: 0.1,
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    backgroundColor:"white",
    borderTopColor: "#e5e5e5",
    justifyContent: "space-between",
  },
  username: {
    marginTop: 15
  },
  username_text: {
    fontSize: 12,
    marginBottom: 2,
    marginLeft: 5
  },
  msg_body: {
    flex: 10,
    padding: 8,
    borderRadius: 10,
    maxWidth: 250
  },
  typing_indicator: {
    padding: 5
  },
  typing_indicator_text: {
    fontSize: 10,
    color: "#ccc"
  },
  text_field: {
    height: 40,
    flex: 8
  },
  button_container: {
    flex: 2,
    alignSelf: "center",
    alignItems: "flex-end"
  },
  send_button_text: {
    color: "#0064e1",
    fontWeight: "bold",
    fontSize: 16
  },
  backgroundImage: {
    height: '100%',
    width: '100%',
    flex: 1,
  },
});








// InterpolateContainer = (array) => {
//         for(let i = 0; i < array.length - 1; i++){

//         }
//       }

//       SetComponentInterpolate = (componentX, componentY, direction=1) => {
//         var snapshot= 50, radius = 100
//         var inputRange = [], outputRange = [];
//         for (var i=0; i<=snapshot; ++i) {
//             var value = i/snapshot;
//             var move = direction * Math.sin(value * Math.PI * 2) * radius;
//             move+=this.centerXOffset;
//             inputRange.push(value);
//             outputRange.push(move);
//         }
//         componentX = this.animated.interpolate({ inputRange, outputRange });

//         /// translateY
//         inputRange = [], outputRange = [];
//         for (i=0; i<=snapshot; ++i) {
//             value = i/snapshot;
//             move = -Math.cos(value * Math.PI * 2) * radius;
//             move+=this.centerYOffset;
//             inputRange.push(value);
//             outputRange.push(move);
//         }
//         this.translateY = this.animated.interpolate({ inputRange, outputRange });
// }
