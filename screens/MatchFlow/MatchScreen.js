import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Button,
  TouchableOpacity,
  Dimensions,
  Image
} from "react-native";

import { connect } from "react-redux";

import LoadingScreen from "../ChatFlow/components/LoadingScreen";

import NotificationButton from "../../sharedComponents/NotificationButton";

import Footer from "../../sharedComponents/Footer";

class MatchScreen extends React.Component {
  //Header

  constructor(props) {
    super(props);
    this.state = {
      isSuccess: true
    };
  }

  successScreen = () => {
    return (
      <View style={styles.container}>
        {/*Footer*/}
        <Footer navigation={this.props.navigation} />
      </View>
    );
  };

  loadingScreen = () => {
    return <LoadingScreen />;
  };

  render() {
    return this.state.isSuccess ? this.successScreen() : this.loadingScreen();
  }
}

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 0.9,
    justifyContent: "center",
    backgroundColor: "white"
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
)(MatchScreen);
