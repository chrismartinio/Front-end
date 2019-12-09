import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  Animated,
  Button,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { degToRad } from "../Util/HomeScreenFunctions.js";

const { height, width } = Dimensions.get("window");

import CircularCarouselItem from "./CircularCarouselItem";

export default class CircularCarousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pageNumber: 0, displayItems: [] };
    this.circleSize = width * 1.7;
    this.itemSize = width * 0.2;
  }

  setDisplayItems = (nextInitial, nextFinal) => {
    let temp = [];
    for (let i = nextInitial; i < nextFinal; i++) {
      if (this.props.matchedUsersList[i] !== undefined) {
        temp.push(this.props.matchedUsersList[i]);
      }
    }
    this.setState({
      displayItems: temp
    });
  };

  setDisplayItemAnimations = (nextInitial, nextFinal) => {
    this.itemAnimations = [];
    for (let i = nextInitial; i < nextFinal; i++) {
      this.itemAnimations.push({
        value: new Animated.ValueXY(this.returnItemsXY(i)),
        index: i
      });
    }
  };

  componentDidMount() {
    //Setup first 12th items to display on the screen
    this.setDisplayItems(0, 12);
    this.setDisplayItemAnimations(0, 12);
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

  nextMatchedList = () => {
    let pageNumber = this.state.pageNumber + 1;
    if (pageNumber > Math.round(this.props.matchedUsersList.length / 12) - 1) {
      pageNumber = Math.round(this.props.matchedUsersList.length / 12) - 1;
    }
    this.setState({ pageNumber: pageNumber });
    let nextInitial = pageNumber * 12;
    let nextFinal = pageNumber * 12 + 12;
    this.setDisplayItems(nextInitial, nextFinal);
  };

  previousMatchedList = () => {
    let pageNumber = this.state.pageNumber - 1;
    if (pageNumber < 0) {
      pageNumber = 0;
    }
    this.setState({ pageNumber: pageNumber });
    let nextInitial = pageNumber === 0 ? 0 : pageNumber * 12;
    let nextFinal = pageNumber * 12 + 12;
    this.setDisplayItems(nextInitial, nextFinal);
  };

  goUp = () => {
    let temp = [];
    for (let i = 0; i < this.state.displayItems.length; i++) {
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
    for (let i = 0; i < this.state.displayItems.length; i++) {
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
        <CircularCarouselItem
          key={i}
          width={this.itemSize * 4}
          height={this.itemSize * 1.1}
          borderRadius={this.itemSize / 2}
          itemAnimationsXY={itemAnimationsXY}
          itemData={this.state.displayItems[i]}
          navigation={this.props.navigation}
        />
      );
    }
    return object;
  };

  render() {
    let displayItems = this.createCircularItems();

    return (
      <View>
        <View style={{ position: "absolute", left: 0, top: width * 0.0 }}>
          <TouchableOpacity
            style={{ margin: 5 }}
            onPress={this.nextMatchedList}
          >
            <Text style={{ color: "#fff" }}>NEXT LIST</Text>
          </TouchableOpacity>
        </View>

        <View style={{ position: "absolute", left: 0, top: width * 0.2 }}>
          <TouchableOpacity
            style={{ margin: 5 }}
            onPress={this.previousMatchedList}
          >
            <Text style={{ color: "#fff" }}>PREVIOUS LIST</Text>
          </TouchableOpacity>
        </View>

        <View style={{ position: "absolute", left: 0, top: width * 0.4 }}>
          <TouchableOpacity style={{ margin: 5 }} onPress={this.goUp}>
            <Text style={{ color: "#fff" }}>GO UP</Text>
          </TouchableOpacity>
        </View>

        <View style={{ position: "absolute", left: 0, top: width * 0.6 }}>
          <TouchableOpacity style={{ margin: 5 }} onPress={this.goDown}>
            <Text style={{ color: "#fff" }}>GO DOWN</Text>
          </TouchableOpacity>
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
