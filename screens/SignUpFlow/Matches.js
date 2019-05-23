import React from 'react';
import {
    View,
    Button,
    Animated,
    ScrollView,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    Modal,
    StyleSheet,
    Dimensions,
    ImageBackground
} from 'react-native';
import { LinearGradient } from 'expo';
import Hello from './hello'

import SetProfilePictureAction from '../../storage/actions/SetProfilePictureAction';
import { connect } from 'react-redux'
//import console = require('console');


//front end variables
var {height, width}= Dimensions.get('window')

var numOfMatches=8;
var numOfNewMatches=3;

var pic1='https://media.gq.com/photos/56d4902a9acdcf20275ef34c/master/w_806,h_1173,c_limit/tom-hardy-lead-840.jpg';
var name1="Tom";

var pic2='https://www.guideposts.org/sites/guideposts.org/files/styles/hero_box_left_lg/public/story/dick_van_dyke_marquee.jpg';
var name2="Dick";

var pic3='http://shared.frenys.com/assets/1009731/6151100-Young-Harrison-Ford.jpg';
var name3="Harry";

var pic4='https://www.famousbirthdays.com/faces/efron-zac-image.jpg'
var name4="Zac";

var pic5='https://resizing.flixster.com/zYHoIjM-IBcqyt8S3ZJzudd9E24=/fit-in/1152x864/v1.cjszOTU0NDtqOzE4MDAwOzEyMDA7MzkyOzYwMA'
var name5="Chris";

let name = "Bob"
let isFemale=false;
let himHer = "him"
let hisHer = "his"
if(isFemale)
{
  himHer="her";
  hisHer="her"
}

//end front end variables
const styles = StyleSheet.create({
  imageStyles: {
    alignContent: 'center',
    justifyContent: 'center',

  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
  btn0: {
    //Image: 'https://media.gq.com/photos/56d4902a9acdcf20275ef34c/master/w_806,h_1173,c_limit/tom-hardy-lead-840.jpg',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height:50,
    //zIndex:100

  },
  btn1: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
     height:50,
    top:-50
  },
  btn2: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height:50,
    top:-100
  },
  btn3: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height:50,
    top:-150
  },
  btn4: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height:50,
    top:-200
  },
  btn5: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height:50,
    top:-250
  },
  btn6: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height:50,
    top:-300
  },
  btn7: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height:50,
    top:-350
  },
  backgroundImage: {
    height: '100%',
    width: '100%',
    flex: 1,
  },
});

class SelfiePage extends React.Component {

  constructor() {
    super()
    var {height, width}= Dimensions.get('window')
    this.pic1='https://media.gq.com/photos/56d4902a9acdcf20275ef34c/master/w_806,h_1173,c_limit/tom-hardy-lead-840.jpg';

    this.startPosition =[.125,.25,.375,.5,.625,.75,.875,1];
    this.startPositionR =[0,.125,.25,.375,.5,.625,.75,.875];

    this.centerXOffset=width*.7;
    this.centerYOffset=-height*.25; //left and right
    this.animated = []
    this.animatedR = []
    this.currentName="";
    this.counterTurn=false;
    for (let xX in this.startPosition)
    {
      this.animated[xX]=new Animated.Value(this.startPosition[xX]);
    }
    for (let xX in this.startPositionR)
    {
      this.animatedR[xX]=new Animated.Value(this.startPositionR[xX]);
    }
    this.userNames = [name1,name2,name3,name4,name5,"Eric","Sean","Fred"];
    this.generatedUsers = [];
      for (let i = 0; i < numOfMatches ; i++){
          this.generatedUsers.push(this.userNames[i]);
      }
      this.generatedImages = [pic1,pic2,pic3,pic4,pic5,pic1,pic2,pic3]
    }/////////end constructor

  static navigationOptions = {
    //header: null,
    title: 'Matches',
    headerStyle: {
      backgroundColor: '#18cdf6',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize:24
    },
  };
  translateStyle(index){
    var snapshot = 50, radius = 200;
      //console.log(this.counterTurn);
      var inputRange = [], outputRange = [];
      let outputRangeX= [], outputRangeY= [];
      for (var i=0; i<=snapshot; ++i) {
          var value = i/snapshot;
          var moveX;

         moveX = Math.sin(value * Math.PI * 2) * radius; //clockwise
          //moveX = -Math.sin(value * Math.PI * 2) * radius; //counter-clockwise

          var moveY= -Math.cos(value * Math.PI * 2) * radius;
          moveX+=this.centerXOffset;
          moveY+=this.centerYOffset;

          inputRange.push(value);

          outputRangeX.push(moveX);
          outputRangeY.push(moveY);
      }
      if(this.counterTurn)
      {
        outputRange=outputRangeX;
        let translateX = this.animatedR[index].interpolate({ inputRange, outputRange });
        outputRange=outputRangeY;
        let translateY = this.animatedR[index].interpolate({ inputRange, outputRange });
        return { transform: [{ translateY: translateY }, {translateX: translateX}] };
      }
      outputRange=outputRangeX;
      let translateX = this.animated[index].interpolate({ inputRange, outputRange });
      outputRange=outputRangeY;
      let translateY = this.animated[index].interpolate({ inputRange, outputRange });
    return { transform: [{ translateY: translateY }, {translateX: translateX}] };
  }

  animate() {
    if(this.counterTurn){

        for (let xX in this.startPositionR)
        {
          this.animatedR[xX].setValue(this.startPositionR[xX])

          Animated.timing(this.animatedR[xX], {
            toValue: this.startPositionR[xX]+.125,
            duration: 1000,
          }).start();
          if(this.startPositionR[xX]>=.875)this.startPositionR[xX]=0
              else this.startPositionR[xX]+=.125
        }
      }
      else {

        for (let xX in this.startPosition)
        {
            this.animated[xX].setValue(this.startPosition[xX])

            Animated.timing(this.animated[xX], {
              toValue: this.startPosition[xX]-.125,
              duration: 1000,
            }).start();
            if(this.startPosition[xX]<=.125)this.startPosition[xX]=1
                else this.startPosition[xX]-=.125;
          }

      }
      //console.log(this.startPosition);
    }
    satUsers(translateStyles,styles,index)
    {
        return(

          <Animated.View key = {index} style={[ translateStyles ]} onPress={() => {
            //console.log("Pressed")
          //this.animate()
      }}>
            <TouchableOpacity style={styles}onPress={() => {
              this.currentName=this.generatedUsers[index]
              //console.log("Start Position: "+this.startPosition[index])
              //console.log("Name: "+this.generatedUsers[index])
              //console.log("Current Name: "+this.currentName)
              this.setModalVisible(true);
              //if(this.startPosition[index]!=.75)
                //this.animate()
          }}>
              <Hello user = {this.generatedUsers[index]} image={this.generatedImages[index]}>
              </Hello>
            </TouchableOpacity>
          </Animated.View>
          )
    }
    state = {
      modalVisible: false,
    };
    setModalVisible(visible) {
      this.setState({modalVisible: visible});
    }
  render(){

    return(

      <View style={{flex:1,height:height}}>

      <LinearGradient

          colors={['#18cdf6', '#43218c']}
          style={{flex:1}}
        >
        <ImageBackground source={require('../../assets/Assets_V1/Butterfly_Background/butterflyBackground.png')} style={styles.backgroundImage}>

        <ScrollView>
        <Text style={{fontSize:60,top:height*.3,left:width/3,color:'white', alignSelf:"center"}}>
              {numOfMatches}
          </Text>
          <Text style={{fontSize:24,top:height*.3,left:width/3,color:'white', alignSelf:"center"}}>
            Matches
          </Text>
          <Text style={{fontSize:18,top:height*.3,left:width/3,color:'white', alignSelf:"center"}}>
            {numOfNewMatches} new
          </Text>
          <TouchableOpacity style={{backgroundColor:'#ff2ae8',top: -75,width:"25%",alignSelf:"center",borderRadius:25,borderColor:"white",borderWidth:1}}>
          <Button  onPress={() =>{ this.animate();}} color="white"title="SPIN" type="solid" />
          </TouchableOpacity>

          <Image //circle image
            source={require('../../assets/images/WhiteCircle.png')}
            style={styles.imageStyles}
            top={-10}
            left={width*.275}
            height={width*1}
            width={width*1}
            borderRadius={0}
            zIndex={-10}
          />

        {
          this.generatedUsers.map((user, index)=>{
           if(index==0) return this.satUsers(this.translateStyle(index), styles.btn0,index)
           else if(index==1) return this.satUsers(this.translateStyle(index), styles.btn1,index)
           else if(index==2) return this.satUsers(this.translateStyle(index), styles.btn2,index)
           else if(index==3) return this.satUsers(this.translateStyle(index), styles.btn3,index)
           else if(index==4) return this.satUsers(this.translateStyle(index), styles.btn4,index)
           else if(index==5) return this.satUsers(this.translateStyle(index), styles.btn5,index)
           else if(index==6) return this.satUsers(this.translateStyle(index), styles.btn6,index)
           else if(index==7) return this.satUsers(this.translateStyle(index), styles.btn7,index)
          }
        )}


        </ScrollView>
        </ImageBackground>

        </LinearGradient>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{left:"12%",width:"75%",height:200,top:"25%",backgroundColor:'white',borderColor:"black",borderWidth:"2",borderRadius:15}}>
            <View style={{fontSize:24,color:'white',top: 0, height:50,backgroundColor:"#63289a",alignSelf:"center",width:"100%",
            borderTopEndRadius:13,borderTopStartRadius:13}}>
              <Text style={{fontSize:24,color:'white',top: "15%",alignSelf:"center"}}>CHAT</Text>


            </View>
            <Text style={{fontSize:16,color:'black',top: "10%",alignSelf:"center",textAlign:"center"}}>
            Would you like to ask {this.currentName} to chat?
            </Text>

              <TouchableHighlight style={{backgroundColor:'#ff2ae8',left:"-30%",top: 50,width:"30%",alignSelf:"center",borderRadius:25,borderColor:"black",borderWidth:1}}>
                <Button  onPress={() =>
                { this.setModalVisible(!this.state.modalVisible);}} color="white"title="YES" type="solid" />
              </TouchableHighlight>
              <TouchableHighlight style={{backgroundColor:'#ff2ae8',left:"30%",top: 10,width:"30%",alignSelf:"center",borderRadius:25,borderColor:"black",borderWidth:1}}>
                <Button  onPress={() =>
                { this.setModalVisible(!this.state.modalVisible);}} color="white"title="NO" type="solid" />
              </TouchableHighlight>
          </View>
        </Modal>
      </View>

      )
  }
}

const mapStateToProps = (state) => ({
   ...state
})

const mapDispatchToProps = (dispatch) => ({
  SetProfilePictureAction: (payload) => dispatch(SetProfilePictureAction(payload))
})



export default connect(mapStateToProps,mapDispatchToProps)(SelfiePage);