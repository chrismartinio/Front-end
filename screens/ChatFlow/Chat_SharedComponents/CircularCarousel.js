import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  Animated,
  Button,
  Dimensions
} from "react-native";
import { degToRad } from "../Util/HomeScreenFunctions.js";

const { height, width } = Dimensions.get("window");

export default class CircularCarousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pageNumber: 0, displayItems: [] };
    this.circleSize = width * 1.7;
    this.itemSize = width * 0.2;

    //MAY NEED TO FIX SOMETHING HERE
    this.itemAnimations = [];
    for (let i = 0; i < this.props.matchedUsersList.length; i++) {
      this.itemAnimations.push({
        value: new Animated.ValueXY(this.returnItemsXY(i)),
        index: i
      });
    }
    //MAY NEED TO FIX SOMETHING HERE
  }

  setDisplayItems = () => {
    let temp = [];
    for (let i = 0; i < 12; i++) {
      if (this.props.matchedUsersList[i] !== undefined) {
        temp.push(this.props.matchedUsersList[i]);
      }
    }
    this.setState({
      displayItems: temp
    });
  };

  componentDidMount() {
    //Setup first 12th items to display on the screen
    this.setDisplayItems();
  }

  returnItemsXY = index => {
    //below degree can fit all items on th CircularCarousel, but no margin
    //let degree = (index * 360) / this.props.matchedUsersList.length;
    let degree = 240 - index * 30;
    let angleRad = degToRad(degree);
    let radius = this.circleSize / 2;
    let center = radius;
    let x = radius * Math.cos(angleRad) + center - this.itemSize / 2;
    let y = radius * Math.sin(angleRad) + center - this.itemSize / 2;
    return { x, y };
  };

  goUp = () => {
    let temp = [];
    for (let i = 0; i < this.props.matchedUsersList.length; i++) {
      let { x, y } = this.returnItemsXY(--this.itemAnimations[i].index);
      let animation = Animated.spring(this.itemAnimations[i].value, {
        toValue: { x, y }
      });
      temp.push(animation);
    }
    Animated.parallel(temp).start();
  };

  goDown = () => {
    let temp = [];
    for (let i = 0; i < this.props.matchedUsersList.length; i++) {
      let { x, y } = this.returnItemsXY(++this.itemAnimations[i].index);
      let animation = Animated.spring(this.itemAnimations[i].value, {
        toValue: { x, y }
      });
      temp.push(animation);
    }
    Animated.parallel(temp).start();
  };

  createCircularItems = () => {
    let object = [];
    for (let i = 0; i < this.state.displayItems.length; i++) {
      let itemAnimationsXY = this.itemAnimations[i].value.getLayout();
      object.push(
        <Animated.View
          key={i}
          style={[
            styles.item,
            {
              width: this.itemSize * 4,
              height: this.itemSize,
              borderRadius: this.itemSize / 2
            },
            itemAnimationsXY
          ]}
        >
          <Text style={{ color: "black" }}>
            {this.state.displayItems[i].matchedFirstName}
          </Text>
        </Animated.View>
      );
    }
    return object;
  };

  render() {
    let displayItems = this.createCircularItems();

    return (
      <View>
        <View style={{ position: "absolute", left: 0, top: 50 }}>
          <Button title={"UP"} color={"#fff"} onPress={this.goUp} />
        </View>
        <View style={{ position: "absolute", left: 0, bottom: 50 }}>
          <Button title={"DOWN"} color={"#fff"} onPress={this.goDown} />
        </View>
        <View
          style={[
            styles.circularCarousel,
            {
              width: this.circleSize,
              height: this.circleSize,
              borderRadius: this.circleSize / 2
            }
          ]}
        >
          {displayItems}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  circularCarousel: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderRadius: 500,
    borderStyle: "dotted",
    borderColor: "#fff",
    left: "20%"
  },
  item: {
    backgroundColor: "#fff",
    position: "absolute"
  }
});
