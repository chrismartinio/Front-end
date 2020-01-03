import React from "react";
import { View, Text, Slider, StyleSheet, Dimensions } from "react-native";
let val = 0;
class CSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      leftBound: "Daryl in Tank Top",
      rightBound: "Daryl in Polo",
      minimumValue: -50,
      maximumValue: 50,
      value: 0,
      displayValue: 0
    };
  }

  handleCallbackListener = value => {
    // callback listener must return true

    this.props.functionListener(value);
    console.log(value);
    val = value;
    this.setState({
      value: value
    });
  };
  /*
  handleRealTimeUpdate = value => {
    // callback listener must return true

    this.props.functionListener(value);
    console.log(value)
    val = value;
    this.setState({
      value: value
    });
  };
  */

  render() {
    return (
      <View style={{ flex: 1 }}>
        {/* <View style={styles.flexContainer}>
         <Text style={styles.text}> {-1*(Math.floor(this.state.value)-50)}  </Text>
         <Text style={styles.text}> {Math.floor(this.state.value)+50}  </Text>
       </View> */}
        <View style={{ alignItems: "center", paddingTop: 5 }}>
          <Text>{this.state.displayValue}</Text>
        </View>
        <Slider
          value={this.props.value}
          minimumValue={this.props.minimumValue}
          maximumValue={this.props.maximumValue}
          minimumTrackTintColor={"rgb(67, 33, 140)"}
          maximumTrackTintColor={"rgb(67, 33, 140)"}
          step={1}
          onSlidingComplete={value => {
            this.handleCallbackListener(value);
          }}
          onValueChange={val => {
            this.setState({ displayValue: val });
          }}
        />

        <View style={styles.flexContainer}>
          <Text style={styles.text}> {this.props.leftBound} </Text>
          <Text style={styles.text}> {this.props.rightBound} </Text>
        </View>
      </View>
    );
  }
}

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    //top: height *.45,
    flexDirection: "row",
    justifyContent: "space-between",
    //position:'absolute',
    alignItems: "stretch",
    width: "100%"
  },
  text: {
    color: "rgb(67, 33, 140)"
  }
});

export default CSlider;
