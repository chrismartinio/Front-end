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

import LoadingScreen from "../../sharedComponents/LoadingScreen";

import NotificationButton from "../../sharedComponents/NotificationButton";

import Footer from "../../sharedComponents/Footer";

class MatchingScreen extends React.Component {
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
        <View style={{ flex: 0.9 }}>
          {/*Room list */}
          <ScrollView
            ref={scrollView => {
              this.scrollView = scrollView;
            }}
            onScroll={this.handleScroll}
            scrollEventThrottle={16}
          >
            <Text>MatchScreen</Text>
            <Text>MatchScreen</Text>
            <Text>MatchScreen</Text>
            <Text>MatchScreen</Text>
            <Text>MatchScreen</Text>
            <Text>MatchScreen</Text>
            <Text>MatchScreen</Text>
            <Text>MatchScreen</Text>
            <Text>MatchScreen</Text>
            <Text>MatchScreen</Text>
            <Text>MatchScreen</Text>
          </ScrollView>
        </View>
        {/*Footer*/}
        <Footer navigation={this.props.navigation} />
      </View>
    );
  };

  loadingScreen = () => {
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
)(MatchingScreen);
