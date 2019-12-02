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

//1. any user edit, make the profile screen to hit the db
//2. query all createAccount data in profile screen and store into localstorage

import LoadingScreen from "../Profile_SharedComponents/LoadingScreen";

import NotificationButton from "../../../sharedComponents/NotificationButton";

function _calculateAge(birthday) {
  birthday = new Date(birthday);
  // birthday is a date
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

//SQLite
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("that.db");
import {
  insertDataIntoLocalStorage,
  selectDataFromLocalStorage
} from "../LocalStorage/localStorage.js";

class Profile extends React.Component {
  //Header
  static navigationOptions = ({ navigation }) => ({
    title: "My Profile",
    headerRight: (
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row" }}>
          {navigation.getParam("isDeviceUser") && (
            <Button
              title={"Edit"}
              color={"black"}
              onPress={() => {
                navigation.navigate("Edit", {
                  dataIsEdited: () => {
                    navigation.state.params.dataIsEdited();
                  }
                });
              }}
            />
          )}
          <NotificationButton navigation={navigation} />
        </View>
      </View>
    )
  });

  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      age: "",
      city: "",
      state: "",
      userImage: "https://facebook.github.io/react-native/img/tiny_logo.png",
      likesArray: [],
      userBio: "",
      photosArray: [
        "https://facebook.github.io/react-native/img/tiny_logo.png",
        "https://facebook.github.io/react-native/img/tiny_logo.png",
        "https://facebook.github.io/react-native/img/tiny_logo.png",
        "https://facebook.github.io/react-native/img/tiny_logo.png",
        "https://facebook.github.io/react-native/img/tiny_logo.png",
        "https://facebook.github.io/react-native/img/tiny_logo.png"
      ],
      isSuccess: false,
      isEdited: false
    };
  }

  //detect if there is data edit in editscreen
  //if yes, fetch the new changed data from db
  //then reset the state to false
  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.state.isEdited !== prevState.isEdited) {
      this.getDataFromDB();
      this.setState({
        isEdited: false
      })
    }
  }

  //This function will be pass into edit screen
  //everytime if data is edited,
  //set the isEdited to true
  //and componentDidUpdate will detect the state changes
  dataIsEdited = () => {
    this.setState({
      isEdited: true
    })
  };

  async componentDidMount() {
    //LOGIC
    //ProfileScreen would also accept the guid pass from navigation
    //Home - > Profile (pass redux guid through navigation)
    //Chat - > Profile (pass other user guid through navigation)
    //so either device's user or matched's user can use this screen
    //edit button would only display when user login and go to profile screen

    //And inside the edit screen, it only use the redux guid (it would not use the navigation guid)
    //And redux guid would only be store or update by registration and login

    const { navigation } = this.props;
    //Retrieve the GUID passed from Homescreen
    this.guid = navigation.getParam("guid");

    console.log("ProfileScreen")
    console.log("USER GUID: ", this.guid);

    //Set Params for Navigation so EditScreen can use ProfileScreen function
    this.props.navigation.setParams({ dataIsEdited: this.dataIsEdited });

    //Query Data
    this.getDataFromDB();

    this.setState({
      isSuccess: true
    });
  }

  getDataFromDB = async () => {
    await fetch("http://74.80.250.210:4000/api/profile/profile_query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        //guid: this.guid,
        guid: this.guid,
        collection: "aboutYou"
      })
    })
      .then(res => res.json())
      .then(async res => {
        let object = JSON.parse(JSON.stringify(res));
        //console.log(object);
        //SUCCESS ON QUERYING DATA

        if (object.success) {
          let {
            firstName,
            lastName,
            birthDate,
            state,
            city,
            userBio,
            likesArray
          } = object.result;

          //setState
          this.setState({
            firstName: firstName,
            lastName: lastName,
            birthDate: birthDate,
            userBio: userBio,
            age: _calculateAge(birthDate),
            city: city,
            state: state,
            likesArray: likesArray,
            isSuccess: true
          });

          //LocalStorage
          if (this.guid === this.props.CreateProfileDataReducer.guid) {
            //Store to device_user_aboutYou
            let insertSqlStatement =
              "INSERT OR REPLACE into device_user_aboutYou(id, createAccount_id, firstName, birthDate, userBio, city, state) " +
              "values(1, 1, ?, ?, ?, ?, ?);";

            let { success } = await insertDataIntoLocalStorage(
              insertSqlStatement,
              "device_user_aboutYou",
              [firstName, birthDate, userBio, city, state],
              true
            );

            //Store to device_user_interests
            let json_likesArray = JSON.stringify({
              likesArray: likesArray
            });
            insertSqlStatement =
              "INSERT OR REPLACE into device_user_interests(id, createAccount_id, likesArray) " +
              "values(1, 1, ?);";

            success = await insertDataIntoLocalStorage(
              insertSqlStatement,
              "device_user_interests",
              [json_likesArray],
              true
            );

            if (!success) {
              console.log("failed storing data into localStorage");
              //handle error on inserting data into localStorage
            }
          } else {
            //here is store to matched's user tables
            //code coming soon
            return;
          }
        } else {
          //INTERNAL ERROR
          throw new Error("internal Error");
        }
      })
      .catch(async err => {
        //console.log(err);
        //HANDLE ANY CATCHED ERRORS

        //LocalStorage
        if (this.guid === this.props.CreateProfileDataReducer.guid) {
          //Get Device's User Data from localStorage device_user_aboutYou table
          let aboutYouObject = await selectDataFromLocalStorage(
            "device_user_aboutYou"
          );

          let interestsObject = await selectDataFromLocalStorage(
            "device_user_interests"
          );

          if (aboutYouObject.success && interestsObject.success) {
            let {
              firstName,
              lastName,
              birthDate,
              state,
              city,
              userBio
            } = aboutYouObject.result.rows._array[0];

            let { likesArray } = interestsObject.result.rows._array[0];
            likesArray = JSON.parse(likesArray).likesArray;

            //setState
            this.setState({
              firstName: firstName,
              lastName: lastName,
              birthDate: birthDate,
              userBio: userBio,
              age: _calculateAge(birthDate),
              city: city,
              state: state,
              likesArray: likesArray,
              isSuccess: true
            });
          } else {
            //Get Matched User's Data from localStorage
            //code coming soon
            return;
          }
        } else {
          //If error while fetching, direct user to failScreen
          //setState
          this.setState({
            isSuccess: false
          });
        }
      });
  };

  successScreen = () => {
    let displaylikesArray = this.state.likesArray.map((e, index = 0) => {
      return (
        <View key={index++}>
          <TouchableOpacity style={styles.likeButtonWrap}>
            <Text style={styles.likeButton}>#{e}</Text>
          </TouchableOpacity>
        </View>
      );
    });

    let displayphotosArray = this.state.photosArray.map((e, index = 0) => {
      return (
        <TouchableOpacity key={index++}>
          <Image
            source={{
              uri: e
            }}
            style={{ width: 100, height: 75, borderRadius: 15, margin: 3 }}
          />
        </TouchableOpacity>
      );
    });

    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={{ alignItems: "center" }}>
            {/**User Image */}
            <Image
              source={{
                uri: this.state.userImage
              }}
              style={{ width: 350, height: 350, borderRadius: 50 }}
            />
          </View>

          {/**User Name */}
          <View style={{ margin: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: "500" }}>
              {this.state.firstName} {this.state.lastName}, {this.state.age}
            </Text>
            <Text />
            <Text style={{ fontSize: 15, fontWeight: "400" }}>
              {this.state.city}, {this.state.state}
            </Text>
          </View>

          {/**border line */}
          <View
            style={{
              borderWidth: 1,
              borderColor: "#d6d7da"
            }}
          />

          {/**Interest */}
          <View
            style={{
              marginLeft: 15,
              marginRight: 15,
              marginTop: 20,
              marginBottom: 3
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: "500" }}>Interests</Text>
          </View>
          <View>
            <View style={{ flexDirection: "row" }}>{displaylikesArray}</View>
          </View>
          <View style={{ padding: 7.5 }} />

          {/**border line */}
          <View
            style={{
              borderWidth: 1,
              borderColor: "#d6d7da"
            }}
          />

          {/**About Me */}
          <View
            style={{
              marginLeft: 15,
              marginRight: 15,
              marginTop: 20,
              marginBottom: 3
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: "500" }}>About Me</Text>
          </View>
          <View style={{ margin: 15 }}>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "100",
                textAlign: "left",
                lineHeight: 30
              }}
            >
              {this.state.userBio}
            </Text>
          </View>

          {/**border line */}
          <View
            style={{
              borderWidth: 1,
              borderColor: "#d6d7da"
            }}
          />

          {/**Photo */}
          <View
            style={{
              marginLeft: 15,
              marginRight: 15,
              marginTop: 20,
              marginBottom: 3
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: "500" }}>Photo</Text>
          </View>
          <View
            style={{
              margin: 20
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap"
              }}
            >
              {displayphotosArray}
            </View>
          </View>
        </ScrollView>
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
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white"
  },
  likeButtonWrap: {
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 7.5,
    paddingBottom: 7.5,
    width: "auto",
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "rgb(67, 33, 140)",
    margin: 5
  },
  likeButton: {
    color: "rgb(67, 33, 140)",
    fontSize: 17
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
)(Profile);