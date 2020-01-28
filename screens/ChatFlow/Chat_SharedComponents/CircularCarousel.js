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
import { degToRad } from "../Util/ConnectionsScreenFunctions.js";
import {
  FlingGestureHandler,
  Directions,
  State
} from "react-native-gesture-handler";

const { height, width } = Dimensions.get("window");

import CircularCarouselItem from "./CircularCarouselItem";

export default class CircularCarousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayItems: [],
      viewIndex: 0 // index of currently view (focus) of user
    };
    this.circleSize = width * 1.7;
    this.itemSize = width * 0.2;
  }
  setDisplayItems = () => {
    let temp = [];
    for (let i = 0; i < this.props.matchUsersList.length; i++) {
      if (this.props.matchUsersList[i] !== undefined) {
        temp.push(this.props.matchUsersList[i]);
      }
    }
    this.setState({
      displayItems: temp,
    });
  };

  setDisplayItemAnimations = () => {
    this.itemAnimations = [];
    for (let i = 0; i < this.props.matchUsersList.length; i++) {
      this.itemAnimations.push({
        value: new Animated.ValueXY(this.returnItemsXY(this.state.viewIndex,i)),
        index: i,
      });
    }
  };

  componentDidMount() {
    //CircularCarousel has its own state (displayItems),

    //load all items into diplsayItems
    this.setDisplayItems();

    //load all items Animations into diplsayItems
    this.setDisplayItemAnimations();
  }

  returnItemsXY = (viewIndex, index) => {
    //below degree can fit all items on th CircularCarousel, but no margin
    //let degree = (index * 360) / this.props.matchUsersList.length;

    // the angle is relative to the viewIndex to the index of the item in the array
    let diffIndex = viewIndex - index;
    if (diffIndex <= -this.props.matchUsersList.length / 2) {
      diffIndex += this.props.matchUsersList.length;
    }
    if (diffIndex >= this.props.matchUsersList.length / 2) {
      diffIndex -= this.props.matchUsersList.length;
    }

    // todo: keep off screen items from overwriting viewiable items
    // better way would be to just make this invisible, but still have animation
    let limit = 8;
    if (diffIndex > limit) {
      diffIndex = limit;
    }
    if (diffIndex < -limit) {
      diffIndex = -limit;
    }

    let degree = 180 - diffIndex * 30;

    let angleRad = degToRad(degree);
    let radius = this.circleSize / 2;
    let center = radius;
    let x = radius * Math.cos(angleRad) + center - this.itemSize / 2;
    let y = radius * Math.sin(angleRad) + center - this.itemSize / 2;
    return { x, y };
  };

  goUp = () => {
    let temp = [];
    let viewIndex = this.state.viewIndex + 1;
    if (viewIndex >= this.state.displayItems.length) {
      viewIndex = 0;
    }
    this.setState({ viewIndex: viewIndex });
    for (let i = 0; i < this.state.displayItems.length; i++) {
      let { x, y } = this.returnItemsXY(
        viewIndex,
        this.itemAnimations[i].index
      );
      let animation = Animated.spring(this.itemAnimations[i].value, {
        toValue: { x, y }
      });
      temp.push(animation);
    }
    Animated.parallel(temp).start();
  };

  goDown = () => {
    let temp = [];
    let viewIndex = this.state.viewIndex - 1;
    if (viewIndex < 0) {
      viewIndex = this.state.displayItems.length - 1;
    }
    this.setState({ viewIndex: viewIndex });
    for (let i = 0; i < this.state.displayItems.length; i++) {
      let { x, y } = this.returnItemsXY(
        viewIndex,
        this.itemAnimations[i].index
      );
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
          matchUserData={this.state.displayItems[i]}
          navigation={this.props.navigation}
          onlineUserList={this.props.onlineUserList}
        />
      );
    }
    return object;
  };

  render() {
    let displayItems = this.createCircularItems();

    return (
      <FlingGestureHandler
        direction={Directions.UP}
        numberOfPointers={1}
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.ACTIVE) {
            this.goUp();
          }
        }}
      >
        <FlingGestureHandler
          direction={Directions.DOWN}
          numberOfPointers={1}
          onHandlerStateChange={({ nativeEvent }) => {
            if (nativeEvent.state === State.ACTIVE) {
              this.goDown();
            }
          }}
        >
          <View>
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
        </FlingGestureHandler>
      </FlingGestureHandler>
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
