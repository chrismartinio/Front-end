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
  Dimensions
} from "react-native";

//Redux
import { connect } from "react-redux";
import SetIsContinueUserAction from "../../../storage/actions/RegistrationActions/SetIsContinueUserAction";

import LoadingScreen from "../Profile_SharedComponents/LoadingScreen";

import CollapsibleScreenTab from "../Profile_SharedComponents/CollapsibleScreenTab";

class EditScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //Toggle
      aboutYouToggle: false,
      preferencesToggle: false,
      interestsToggle: false,
      wouldYouRatherToggle: false,
      localDestinationToggle: false,

      //Status
      aboutYouStatus: "empty",
      preferencesStatus: "empty",
      interestsStatus: "empty",
      wouldYouRatherStatus: "empty",
      localDestinationStatus: "empty",

      isLoading: false,
      scrollY: 0
    };
  }

  async componentDidMount() {
    this.props.SetIsContinueUserAction({
      isContinueUser: true,
      checklist: {
        createAccount: true,
        aboutYou: true,
        preferences: true,
        interests: true,
        wouldYouRather: true,
        localDestination: true
      }
    });

    this.setState({
      isLoading: true
    });
  }

  //Handle the status of screen
  handlePassed = (componentName, passed) => {
    this.props.navigation.state.params.dataIsEdited();
    let toggleName = componentName + "Toggle";
    let statusName = componentName + "Status";
    //1 means screen is passed
    //2 means screen is not passed; something has changed; some fields is not filled yet
    //3 means there error on api fetchting or server internal error

    if (passed === 1) {
      this.setState(
        {
          [statusName]: "passed",
          [toggleName]: false
        },
        () => {
          this.scrollView.scrollTo({ y: 0, animated: true });
        }
      );
    } else if (passed === 2) {
      this.setState({
        [toggleName]: true, //keep the toggle remain
        [statusName]: "empty"
      });
    } else {
      //Handle Duplicate Email; let the createAccount screen stay remain
      this.setState({
        [toggleName]: true, //keep the toggle remain
        [statusName]: "error"
      });
    }
  };

  //If screen tab is pressed, Toggle its states to oppsoite
  handleToggle = (componentName, evt) => {
    let pageY = evt !== null ? evt.nativeEvent.pageY : 0;
    let offset = 125;
    let toggle = componentName + "Toggle";
    this.setState(
      {
        [toggle]: !this.state[toggle]
      },
      () => {
        if (this.state[toggle]) {
          this.scrollView.scrollTo({
            y: this.state.scrollY + pageY - offset,
            animated: true
          });
        } else {
          this.scrollView.scrollTo({ y: 0, animated: true });
        }
      }
    );
  };

  //handlescroll : update current screen top y
  handleScroll = ({ nativeEvent }) => {
    const { contentOffset } = nativeEvent;
    this.setState({
      scrollY: contentOffset.y
    });
  };

  successScreen = () => {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          ref={scrollView => {
            this.scrollView = scrollView;
          }}
          onScroll={this.handleScroll}
          scrollEventThrottle={16}
          //Remove this line may have warning for the scrollview?
          //use 16 may cause frame drop?
        >
          <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.inner}>
                {/*Spaces*/}
                <View
                  style={{
                    padding: "10%"
                  }}
                />

                {/*About You*/}
                <View>
                  <CollapsibleScreenTab
                    componentToggle={this.state.aboutYouToggle}
                    componentPassed={true}
                    componentStatus={this.state.aboutYouStatus}
                    componentName={"aboutYou"}
                    handleToggle={this.handleToggle}
                    handlePassed={this.handlePassed}
                  />
                </View>

                {/*Preferences*/}
                <View>
                  <CollapsibleScreenTab
                    componentToggle={this.state.preferencesToggle}
                    componentPassed={true}
                    componentStatus={this.state.preferencesStatus}
                    componentName={"preferences"}
                    handleToggle={this.handleToggle}
                    handlePassed={this.handlePassed}
                  />
                </View>

                {/*interests*/}
                <View>
                  <CollapsibleScreenTab
                    componentToggle={this.state.interestsToggle}
                    componentPassed={true}
                    componentStatus={this.state.interestsStatus}
                    componentName={"interests"}
                    handleToggle={this.handleToggle}
                    handlePassed={this.handlePassed}
                  />
                </View>

                {/*wouldYouRather*/}
                <View>
                  <CollapsibleScreenTab
                    componentToggle={this.state.wouldYouRatherToggle}
                    componentPassed={true}
                    componentStatus={this.state.wouldYouRatherStatus}
                    componentName={"wouldYouRather"}
                    handleToggle={this.handleToggle}
                    handlePassed={this.handlePassed}
                  />
                </View>

                {/*localDestination*/}
                <View>
                  <CollapsibleScreenTab
                    componentToggle={this.state.localDestinationToggle}
                    componentPassed={true}
                    componentStatus={this.state.localDestinationStatus}
                    componentName={"localDestination"}
                    handleToggle={this.handleToggle}
                    handlePassed={this.handlePassed}
                  />
                </View>

                {/*Temporay solution for scrollView; without this would not scroll properly*/}
                <View style={{ padding: "100%" }} />
              </View>
            </TouchableWithoutFeedback>
          </SafeAreaView>
        </ScrollView>
      </View>
    );
  };

  loadingScreen = () => {
    //display fetching data
    return <LoadingScreen />;
  };

  render() {
    return this.state.isLoading ? this.successScreen() : this.loadingScreen();
  }
}

const { height, width } = Dimensions.get("window");

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
  joinBlindlyText: {
    color: "rgb(67, 33, 140)",
    fontSize: Math.round(width / 15),
    top: 10,
    fontWeight: "500"
  },
  joinBlindlyTextWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    right: 30
  }
});

const mapStateToProps = state => {
  return { ...state };
};

const mapDispatchToProps = dispatch => {
  return {
    SetIsContinueUserAction: payload =>
      dispatch(SetIsContinueUserAction(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditScreen);
