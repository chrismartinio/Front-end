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
  TouchableOpacity,
  CameraRoll,
  TouchableHighlight,
  Modal,
  Alert
} from "react-native";

//Redux
import { connect } from "react-redux";

import { StackActions, NavigationActions } from "react-navigation";

const { height, width } = Dimensions.get("window");

class MeetupMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.modalVisible}
      >
        <View
          style={{
            position: "absolute",
            height: width * 1.0,
            width: width * 0.8,
            top: "20%",
            alignSelf: "center",
            backgroundColor: "#3399ff",
            borderRadius: 30
          }}
        >
          <View>
            {/*X button*/}
            <View
              style={{
                alignItems: "center",
                top: "5%"
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.openMenu(!this.props.modalVisible);
                }}
              >
                <Text style={{ color: "#fff" }}>Close</Text>
              </TouchableOpacity>
            </View>

            <View style={{ padding: "5%" }} />

            {/*Content*/}
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: "#fff" }}>Menu</Text>
            </View>

            <View>
              <View
                style={{
                  justifyContent: "center"
                }}
              >
                <TouchableOpacity
                  style={{
                    margin: 10,
                    padding: "5% 0% 5% 0%",
                    backgroundColor: "#fff",
                    borderRadius: 50,
                    alignItems: "center"
                  }}
                  onPress={() => {
                    this.props.openMenu(!this.props.modalVisible);
                    this.props.navigation.navigate("LocationServices");
                  }}
                >
                  <Text style={{ color: "black" }}> Pick a place </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  image: {
    width: width / 3.1,
    height: width / 3.1,
    margin: 1,
    borderWidth: 1,
    borderColor: "#fff"
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
)(MeetupMenu);
