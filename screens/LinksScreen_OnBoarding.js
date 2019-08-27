import React from "react";
import { ScrollView, StyleSheet, Text, View, Button } from "react-native";
import { ExpoLinksView } from "@expo/samples";

//These are running the onBoardingScreen inside the IndividualScreensBackUp

import { connect } from "react-redux";

//TESTING USES
import InsertDummyData from "../storage/actions/InsertDummyData";
//TESTING USES

class LinksScreen extends React.Component {
  static navigationOptions = {
    title: "Testing Screen"
  };

  testcase = () => {
    //TESTING USE BELOW (When onAuth work functionally (login pass data to redux, remove below))
    //SETUP DUMMY DATA
    let mode = "";
    let gui = "";

    let userData = { gui: "", email: "", password: "" };
    let profData = {
      firstName: "",
      lastName: "",
      birthDate: "",
      gender: "",
      country: "",
      zipCode: ""
    };
    let interestedData = {
      ageRange: 0,
      distanceRange: [20, 108],
      interestedGender: ""
    };
    let likesData = { likesArray: [] };
    let wouldRatherData = {
      s1r1: 50,
      s1r2: 50,
      s2r1: 50,
      s2r2: 50,
      s3r1: 50,
      s3r2: 50
    };
    let weekendLocation = "";

    //Options
    //Option #1 : Regular User Registration
    //Option #2  : Third Parties Services User Registration
    //Option #3  : Third Parties Services Undone User Registration or Regular Undone User Registration
    let option = 3;

    switch (option) {
      //Regular User Registration
      case 1:
        mode = "";
        break;

      //Third Parties Services User Registration
      //Test Case : only email screen and about you's fistname and lastname is filled up
      case 2:
        mode = "undone";

        userData = { gui: "", email: "zzz@live.com", password: "12345Abc" };
        profData = {
          firstName: "Ryan",
          lastName: "Albert",
          birthDate: "",
          gender: "",
          country: "",
          zipCode: ""
        };
        break;

      //Third Parties Services Undone User Registration or Regular Undone User Registration
      //Test Case : only email screen, about you screen and wouldyouRather screen is filled up
      case 3:
        mode = "undone";
        userData = {
          gui: "5d5b2d8b1dc6d2bd12a1dc7e",
          email: "hhh@live.com",
          password: "12345Abc"
        };
        profData = {
          firstName: "Ryan",
          lastName: "Albert",
          birthDate: "01-18-1996",
          gender: "male",
          country: "France",
          zipCode: "94612"
        };
        wouldRatherData = {
          s1r1: 10,
          s1r2: 90,
          s2r1: 50,
          s2r2: 50,
          s3r1: 60,
          s3r2: 40
        };

        break;

      default:
        mode = "";
        break;
    }

    this.props.InsertDummyData({
      mode: mode,
      userData: userData,
      profData: profData,
      interestedData: interestedData,
      likesData: likesData,
      wouldRatherData: wouldRatherData,
      weekendLocation: weekendLocation
    });

    //TESTING USE ABOVE
  };

  componentDidMount() {
    this.testcase();
  }

  constructor(props) {
    super(props);
    this.buttonAry = [
      "TestCollapsible",
      "TestSignUp",
      "TestAboutYou",
      "TestTellUsMore",
      "TestImInterestedIn",
      "TestSpendWeekend",
      "TestWouldRather",
      "TestRegistrationComplete"
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

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  //TESTING USE
  InsertDummyData: payload => dispatch(InsertDummyData(payload))
  ///TESTING USE
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LinksScreen);
