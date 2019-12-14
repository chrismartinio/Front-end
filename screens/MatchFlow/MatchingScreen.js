import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Image
} from "react-native";

import { connect } from "react-redux";

import LoadingScreen from "../../sharedComponents/LoadingScreen";

import Footer from "../../sharedComponents/Footer";

class MatchingScreen extends React.Component {
  //Header

  constructor(props) {
    super(props);
    this.state = {
      isSuccess: true,
      foundaMatch: false
    };
    //Set up a socket that after socket send they found a match
    //then change the foundaMatch = true
  }

  componentDidMount() {
    console.log("Matching");
    this.props.navigation.setParams({ backFromMatch: this.backFromMatch });
  }

  backFromMatch = () => {
    this.setState({
      foundaMatch: false
    });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.foundaMatch !== this.state.foundaMatch) {
      if (this.state.foundaMatch) {
        //also send a private room id to match screen
        this.props.navigation.navigate("FoundaMatch", {
          backFromMatch: () => {
            this.props.navigation.state.params.backFromMatch();
          }
        });
      }
    }
  }

  successScreen = () => {
    return (
      <View style={styles.container}>
        <View style={{ flex: 0.9 }}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator size="large" color="black" />
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 24 }}>Finding a match</Text>
              {/*Testing Use*/}
              <Button
                title={"found a match"}
                color={"black"}
                onPress={() => {
                  this.setState({
                    foundaMatch: true
                  });
                }}
              />
            </View>
          </View>
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
