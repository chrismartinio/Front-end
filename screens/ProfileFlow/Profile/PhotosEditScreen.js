import React from "react";
import { ExpoConfigView } from "@expo/samples";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  Keyboard,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  TouchableOpacity
} from "react-native";

//Redux
import { connect } from "react-redux";

import LoadingScreen from "../../../sharedComponents/LoadingScreen";

import { StackActions, NavigationActions } from "react-navigation";

class PhotosEditScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSuccess: false
    };
  }

  async componentDidMount() {
    this.setState({
      isSuccess: true
    });
  }

  successScreen = () => {
    return (
      <View style={{ flex: 1 }}>
        <Text>Some photos</Text>
      </View>
    );
  };

  loadingScreen = () => {
    //display fetching data
    return <LoadingScreen navigation={this.props.navigation} />;
  };

  render() {
    return this.state.isSuccess ? this.successScreen() : this.loadingScreen();
  }
}

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

const mapStateToProps = state => {
  return { ...state };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhotosEditScreen);
