import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  Picker, 
  TextInput,
  Dimensions
} from "react-native";
import { LinearGradient } from "expo";
// import Categories from '../../components/SignUpFlow/Categories'
import t from "tcomb-form-native";
import { connect } from "react-redux";
//import SetInterestedDataAction from "../../storage/actions/SetInterestedDataAction";
//import firebase from "../../utils/mainFire";
import Slider from ".././CSlider";
import { Math } from "core-js";
import MultiSlider from '@ptomasroos/react-native-multi-slider'

class TellUsMore extends React.Component {
  constructor(props) {
    super(props);
    this.inputRefs = {};
    this.state = {
      pickedMen: "transparent",
      pickedWomen: "transparent",
      ageRange: 18,
      distanceRange: 0,
      sliderOneChanging: false,
        sliderOneValue: [5],
        multiSliderValue: [20, 108],
        nonCollidingMultiSliderValue: [0, 100],
    };
  }
  handleSubmit = () => {
    this.props.navigation.navigate("TestImInterestedIn");
  };
  setDistanceRange = arg => {
    this.setState({
      distanceRange: arg
    });
    //console.log(this.state.distanceRange)
  };
  handleRedux = name => {
    const likes = this.props.CreateProfileReducer.likes;
    //console.log(name);

    // replacing initial state
    if (likes[0] === null) {
      return this.props.SetProfileFirstLike(name);
    }
    // blocks duplicates
    for (let i = 0; i < likes.length; i++) {
      if (likes[i] === name) {
        return;
      }
    }
    this.props.SetProfileLikesAction(name);

    //after clicked, gray the buttons
    //copy categories.js
  };

  render() {
    let displaylikes = likes.map((e, index = 0) => {
      return (
        <TouchableOpacity
          key={index++}
          style={styles.likeButtonWrap}
          onPress={() => this.handleRedux(e)}
        >
          <Text style={styles.likeButton}>{e}</Text>
        </TouchableOpacity>
      );
    });

    return (
      <View style={styles.wholeWrap}>
        {/**Tell Us More Text */}
        <View style={styles.tellUsMoreTextWrap}>
          <Text style={styles.tellUsMoreText}>Im Interested In</Text>
          {/*Spaces*/}
          <View
            style={{
              padding: "3%"
            }}
          />
          {/** What are you into? Text*/}
          <Text style={styles.whatAreYouIntoText}>Pick one or both</Text>
        </View>
        {/*Spaces*/}
        <View
          style={{
            padding: "3%"
          }}
        />
        <View style={styles.likeWrapCenter}>
          <View style={styles.likesWrap}>{displaylikes}</View>
        </View>
        {/*Spaces*/}
        <View
          style={{
            padding: "5%"
          }}
        />
<Text style={styles.titleText2}>Set your preferences</Text>
              <Text style={styles.textTop}>Preferred age range</Text>
              <View style={styles.flexContainer}>
                        <Text style={styles.text2}> {this.state.multiSliderValue[0]}  </Text>
                        <Text style={styles.text2}> {this.state.multiSliderValue[1]}  </Text>
                      </View>
              <View style={styles.slider1}>
              <MultiSlider
                  values={[
                            this.state.multiSliderValue[0],
                            this.state.multiSliderValue[1],
                        ]}
                  sliderLength={320}
                  onValuesChange={this.multiSliderValuesChange}
                  min={18}
                  max={110}
                  step={1}
                  allowOverlap
                  snapped
                  trackStyle={{
                    //height: 10,
                    shadowColor: 'red',
                }}
                  
                        />
                      
                {/* <Slider
                  functionListener={this.setAgeRange}
                  minimumValue={18}
                  maximumValue={110}
                  leftBound={"18"}
                  rightBound={"110"}
                /> */}
              </View>
              <Text style={styles.textTop}>
                Preferred match radius (miles)
              </Text>
              <View style={{paddingBottom:50}}>
                <Slider
                  functionListener={this.setDistanceRange}
                  minimumValue={0}
                  maximumValue={110}
                  leftBound={"0"}
                  rightBound={"110"}
                />
              </View>
              
              
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tellUsMoreText: {
    color: "#fff",
    fontSize: 45,
    fontWeight: "100"
  },
  whatAreYouIntoText: {
    color: "#fff",
    paddingTop: "5%",
    fontSize: 20
  },
  tellUsMoreTextWrap: {
    alignItems: "center"
  },
  likeButton: {
    color: "#fff",
    fontSize: 20
  },
  likeButtonWrap: {
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#fff",
    //width: "30%",
    margin: "1%"
  },
  button: {
    alignItems: "center",
    padding: 10,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    width: "70%"
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20
  },
  likesWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  likeWrapCenter: {
    alignItems: "center"
    //marginTop: "15%"
  },
  wholeWrap: {
    //borderRadius: 4,
    //borderWidth: 0.5,
    //borderColor: "#d6d7da",
    marginLeft: "5%",
    marginRight: "5%"
    //marginTop: "40%"
  },
  titleText2:{
    margin:10,
    color: '#fff',
    fontSize:24,
    textAlign:"center",
  },
  textTop: {
    margin: 10,
    color: "#fff",
    fontSize: 20,
    textAlign: "center"
  },
  flexContainer: {
    
    //top: height *.45,
    flexDirection: 'row',
    justifyContent:'space-between',
    //position:'absolute',
    alignItems:'stretch',
    
    
  },
  text2:{
    color:'white',
  },
});

const likes = [
  "Women",
  "Men"
];

const mapStateToProps = state => {
  return { ...state };
};

const mapDispatchToProps = dispatch => {
  return {
    SetProfileLikesAction: payload => dispatch(SetProfileLikesAction(payload)),
    SetProfileFirstLike: payload => dispatch(SetProfileFirstLike(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TellUsMore);