import React from "react";
import { View, Text, Slider, StyleSheet, Dimensions } from "react-native";

let val = 0;
class CSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      leftBound: "Daryl in Tank Top",
      rightBound: "Daryl in Polo",
      value: 0,
      leftPercentage: 50,
      rightPercentage: 50
    };
  }

  handleCallbackListener = value => {
    // callback listener must return true

    this.props.functionListener(value);
    //console.log(value)
    val = value;
    this.setState({
      value: value
    });
  };
  handleRealTimeUpdate = value => {
    // callback listener must return true

    this.props.functionListener(value);
    //console.log(value)

    // this.setState({
    //   value:value
    // })

    // this.setState({
    //   currValue:value,
    //   leftPercentage: -1 * (-50 + Math.floor(value)),
    //   rightPercentage: Math.floor(value) + 50
    // })
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Slider
          style={styles.slider}
          value={this.props.value}
          minimumValue={-50}
          maximumValue={50}
          minimumTrackTintColor={"#6a0dad"}
          maximumTrackTintColor={"#6a0dad"}
          onSlidingComplete={value => {
            //this.handleCallbackListener(value)
          }}
          onSlidingComplete={value => {
            this.handleRealTimeUpdate(value);
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
    color: "#6a0dad"
  },
  slider: {
    //top:height * .4
  },
  textFlexContainer: {
    //flex:1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  }
});

export default CSlider;
