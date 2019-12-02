import React, { Component } from "react";
import { Text, View, TouchableOpacity, Button } from "react-native";

//Redux
import { connect } from "react-redux";

class Footer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "flex-end"
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <View
              style={{
                width: 100,
                height: 75,
                backgroundColor: "powderblue"
              }}
            >
              <Button
                title="Go to Profile"
                onPress={() =>
                  this.props.navigation.navigate("Profile", {
                    guid: this.props.CreateProfileDataReducer.guid,
                    isDeviceUser: true
                  })
                }
              />
            </View>
            <View
              style={{ width: 100, height: 75, backgroundColor: "skyblue" }}
            >
              <Button
                title="Go to Match"
                onPress={() => this.props.navigation.navigate("Match")}
              />
            </View>
            <View
              style={{
                width: 100,
                height: 75,
                backgroundColor: "powderblue"
              }}
            >
              <Button
                title="Go to Setting"
                onPress={() => this.props.navigation.navigate("Setting")}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return { ...state };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Footer);
