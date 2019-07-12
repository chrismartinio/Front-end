import React from "react";
import { ScrollView, StyleSheet, Text, View, Button } from "react-native";
import { ExpoLinksView } from "@expo/samples";

//These are running the onBoardingScreen inside the IndividualScreensBackUp

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: "Testing Screen"
  };
  constructor(props) {
    super(props);
    this.buttonAry = [
      "TestSignUp",
      "TestCollapsible",
      "TestAboutYou",
      "TestTellUsMore",
      "TestImInterestedIn",
      "TestSpendWeekend",
      "TestWouldRather"
    ];
  }

  render() {
    let displayButton = this.buttonAry.map((e, index = 0) => {
      return (
        <Button
          key={index++}
          title={e}
          onPress={() => this.props.navigation.navigate(e)}
        />
      );
    });
    return (
      <ScrollView style={styles.container}>
        {/*<Form
            style={{color:'black'}}
            type={details}
            ref={d => this._form = d}
            onChange={this.handleChange}
        />
        <Button
          title={'Press me'}
          onPress={this.getData}
        />*/}

        {displayButton}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
