import React from 'react';
import {
    View,
    Button,
    Animated,
    ScrollView,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions
} from 'react-native';
import { LinearGradient } from 'expo';
import Hello from './hello'

import SetProfilePictureAction from '../../storage/actions/SetProfilePictureAction';
import { connect } from 'react-redux'
//import console = require('console');


//front end variables
var {height, width}= Dimensions.get('window')

var numOfMatches="7";
var numOfNewMatches="3";

var pic1='https://media.gq.com/photos/56d4902a9acdcf20275ef34c/master/w_806,h_1173,c_limit/tom-hardy-lead-840.jpg';
var name1="Tom";
var pic1Top=-(height*.56)
var pic1Left=width*.5
var pic1HW=width*.16

var pic2='https://www.guideposts.org/sites/guideposts.org/files/styles/hero_box_left_lg/public/story/dick_van_dyke_marquee.jpg';
var name2="Dick";
var pic2Top=-(height*.6)
var pic2Left=width/6
var pic2HW=width*.2

var pic3='http://shared.frenys.com/assets/1009731/6151100-Young-Harrison-Ford.jpg';
var name3="Harry";
var pic3Top=-(height*.6)
var pic3Left=width*.025
var pic3HW=width*.25

var pic4='https://www.famousbirthdays.com/faces/efron-zac-image.jpg'
var name4="Zac";
var pic4Top=-(height*.55)
var pic4Left=width*.1
var pic4HW=width*.2

var pic5='https://resizing.flixster.com/zYHoIjM-IBcqyt8S3ZJzudd9E24=/fit-in/1152x864/v1.cjszOTU0NDtqOzE4MDAwOzEyMDA7MzkyOzYwMA'
var name5="Chris";
var pic5Top=-(height*.54)
var pic5Left=width*.5
var pic5HW=width*.16


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
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height:50,
    //zIndex:100
    
  },
  btn1: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
     height:50,
    top:-50
  },
  btn2: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height:50,
    top:-100
  },
  btn3: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height:50,
    top:-150
  },
  btn4: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height:50,
    top:-200
  },
  btn5: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height:50,
    top:-250
  },
  btn6: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height:50,
    top:-300
  },
  btn7: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height:50,
    top:-350
  }
});

class SelfiePage extends React.Component {
  
  constructor() {
    super()
    var {height, width}= Dimensions.get('window')
    this.pic1='https://media.gq.com/photos/56d4902a9acdcf20275ef34c/master/w_806,h_1173,c_limit/tom-hardy-lead-840.jpg';

    this.startPosition =[.125,.25,.375,.5,.625,.75,.875,1];
    this.startPositionR =[0,.125,.25,.375,.5,.625,.75,.875];

    this.centerXOffset=width*.7;
    this.centerYOffset=-height*.275; //left and right
    this.animated = []
    this.animatedR = []

    this.counterTurn=false;
    for (let xX in this.startPosition)
    {
      this.animated[xX]=new Animated.Value(this.startPosition[xX]);
    }
    for (let xX in this.startPositionR)
    {
      this.animatedR[xX]=new Animated.Value(this.startPositionR[xX]);
    }
    this.generatedUsers = [];
      for (let i = 0; i < 8 ; i++){
          this.generatedUsers.push("Name"+i) ;
      }
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
            console.log("Pressed")
          this.animate()  
      }}>
            <TouchableOpacity style={styles}onPress={() => { 
                //console.log("Pressed")
              this.animate()  
          }}>
              <Button title={index.toString()} onPress={() => { 
                //console.log("Pressed")
              this.animate()  
          }}/>
              <Hello user = {this.generatedUsers[index]} >
              
              </Hello>
              
            </TouchableOpacity>
          </Animated.View>
          
          )
          
    }
  render(){

    return(

      <View style={{flex:1,height:height}}>
      <LinearGradient

          colors={['#18cdf6', '#43218c']}
          style={{flex:1}}
        >

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
          <Image //circle image
      //source={{ uri: '/Users/Drew/Documents/blindlyDateRMK/assets/images/WhiteCircle.PNG' }}
      source={require('../../assets/images/WhiteCircle.png')}
      style={styles.imageStyles}
      top={-10}
      left={width*.275}
      height={width*1}
      width={width*1}
      borderRadius={0}
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
        </LinearGradient>
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