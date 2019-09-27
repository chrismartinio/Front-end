import React, { Component } from "react";
import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from "react-native";

//background color
import { LinearGradient } from "expo-linear-gradient";

//Collapsible Components
import CollapsibleScreenTab from "./Components/CollapsibleScreenTab";
import LoadingScreen from "./Components/LoadingScreen";

//Icons
import { Chevron } from "react-native-shapes";
import { Icon, Input } from "react-native-elements";

//Redux
import { connect } from "react-redux";
import ResetReduxDataAction from "../../../storage/actions/RegistrationActions/ResetReduxDataAction";
import SetIsContinueUserAction from "../../../storage/actions/RegistrationActions/SetIsContinueUserAction";
import SetUserAllDataAction from "../../../storage/actions/RegistrationActions/SetUserAllDataAction";
import SetGUIAction from "../../../storage/actions/RegistrationActions/SetGUIAction";

//direction: decrypt jwt -> retrieve gui and checklist -> store gui into redux ->

const { height } = Dimensions.get("window");

class TestScrollView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createAccountToggle: true, //true or false
      aboutYouToggle: false,
      preferencesToggle: false,
      interestsToggle: false,
      wouldYouRatherToggle: false,
      localDestinationToggle: false,
      isLoading: true,
      screenHeight: height,
      isLoading: false
    };
    this.scrollY = 0;
  }

  //handlescroll : update current screen top y
  handleScroll = ({ nativeEvent }) => {
    const { contentOffset } = nativeEvent;
    this.scrollY = contentOffset.y;
    console.log(this.scrollY);
  };

  async componentDidMount() {
    this.setState({
      isLoading: true
    });
  }
  handleToggle = () => {
    console.log(this.scrollY);
    this.scrollView.scrollTo({ y: this.scrollY + 500, animated: true });
  };

  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ screenHeight: contentHeight });
  };

  successScreen = () => {
    return (
      <LinearGradient
        textStyle={{ color: "#fff" }}
        colors={["#18cdf6", "#43218c"]}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollView => {
            this.scrollView = scrollView;
          }}
          onContentSizeChange={this.onContentSizeChange}
          onScroll={this.handleScroll}
          scrollEventThrottle={16}
          //Remove this line may have warning for the scrollview?
          //use 16 may cause frame drop?
        >
          {/*Spaces*/}
          <View
            style={{
              padding: "15%"
            }}
          />
          <View style={styles.joinBlindlyTextWrap}>
            <Text style={styles.joinBlindlyText}>Join Blindly</Text>
          </View>
          {/*Spaces*/}
          <View
            style={{
              padding: "15%"
            }}
          />

          {/*createAccount*/}
          <View>
            {/*Header*/}
            <View>
              <TouchableOpacity
                onPress={evt => {
                  let { pageY } = evt.nativeEvent;
                  this.setState({
                    createAccountToggle: !this.state.createAccountToggle
                  });
                  this.scrollView.scrollTo({
                    y: this.scrollY + pageY,
                    animated: true
                  });
                }}
              >
                <Text style={{ color: "white", fontSize: 24 }}>
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>
            {/*Body*/}
            <View
              style={{
                paddingTop: "25%",
                paddingBottom: "25%",
                borderRadius: 4,
                borderWidth: 0.5,
                borderColor: "#d6d7da",
                display: this.state.createAccountToggle ? "block" : "none"
              }}
            >
              <Text style={{ color: "white", fontSize: 16 }}>
                Hello CreateAccount
              </Text>
            </View>
          </View>

          {/*aboutYou*/}
          <View>
            {/*Header*/}
            <View>
              <TouchableOpacity
                onPress={evt => {
                  let { pageY } = evt.nativeEvent;
                  this.setState({
                    aboutYouToggle: !this.state.aboutYouToggle
                  });
                  this.scrollView.scrollTo({
                    y: this.scrollY + pageY,
                    animated: true
                  });
                }}
              >
                <Text style={{ color: "white", fontSize: 24 }}>aboutYou</Text>
              </TouchableOpacity>
            </View>
            {/*Body*/}
            <View
              style={{
                paddingTop: "25%",
                paddingBottom: "25%",
                borderRadius: 4,
                borderWidth: 0.5,
                borderColor: "#d6d7da",
                display: this.state.aboutYouToggle ? "block" : "none"
              }}
            >
              <Text style={{ color: "white", fontSize: 16 }}>
                Hello aboutYou
              </Text>
            </View>
          </View>

          {/*preferences*/}
          <View>
            {/*Header*/}
            <View>
              <TouchableOpacity
                onPress={evt => {
                  let { pageY } = evt.nativeEvent;
                  this.setState({
                    preferencesToggle: !this.state.preferencesToggle
                  });
                  this.scrollView.scrollTo({
                    y: this.scrollY + pageY,
                    animated: true
                  });
                }}
              >
                <Text style={{ color: "white", fontSize: 24 }}>
                  preferences
                </Text>
              </TouchableOpacity>
            </View>
            {/*Body*/}
            <View
              style={{
                paddingTop: "25%",
                paddingBottom: "25%",
                borderRadius: 4,
                borderWidth: 0.5,
                borderColor: "#d6d7da",
                display: this.state.preferencesToggle ? "block" : "none"
              }}
            >
              <Text style={{ color: "white", fontSize: 16 }}>
                Hello preferences
              </Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    );
  };

  loadingScreen = () => {
    return <LoadingScreen />;
  };

  render() {
    return this.state.isLoading ? this.successScreen() : this.loadingScreen();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "flex-start",
    marginLeft: "5%",
    marginRight: "5%"
  },
  header: {
    fontSize: 36,
    marginBottom: 48
  },
  input: {
    height: 40,
    borderColor: "#000000",
    borderBottomWidth: 1,
    marginBottom: 36
  },
  btnContainer: {
    backgroundColor: "white",
    marginTop: 12
  },
  button: {
    color: "#fff",
    fontSize: 20
  },
  _textInput: {
    color: "#fff",
    fontSize: 20,
    textAlign: "left",
    paddingTop: "20%",
    borderBottomWidth: 1,
    borderColor: "#fff"
  },
  smallText: {
    margin: 10,
    color: "#fff",
    fontSize: 10
  },
  titleText: {
    margin: 10,
    color: "#fff",
    fontSize: 48,
    textAlign: "center",
    fontWeight: "100"
  },
  button2: {
    alignItems: "center",
    //backgroundColor: '#fff',
    padding: 10,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    width: "55%"
  },
  backgroundImage: {
    height: "100%",
    width: "100%",
    flex: 1
  },
  joinBlindlyText: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "100"
  },
  joinBlindlyTextWrap: {
    alignItems: "center"
  }
});
const mapStateToProps = state => {
  return { ...state };
};

const mapDispatchToProps = dispatch => {
  return {
    ResetReduxDataAction: payload => dispatch(ResetReduxDataAction(payload)),
    SetIsContinueUserAction: payload =>
      dispatch(SetIsContinueUserAction(payload)),
    SetUserAllDataAction: payload => dispatch(SetUserAllDataAction(payload)),
    SetGUIAction: payload => dispatch(SetGUIAction(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestScrollView);
