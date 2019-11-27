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
//2. make everything relate to profile into one folder
//3. make the edit button only visible to device's user
//4. make the profile edit screen
//5. make all the db call into one files
//6. on every fetch files, create an ip so other ppl can only change that ip to do fetch




import LoadingScreen from "../SignUpFlow/ProfileRegistrationClient/Components/LoadingScreen";

//SQLite
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("that.db");

class Profile extends React.Component {
  static navigationOptions = {
    title: "My Profile"
  };
  constructor(props) {
    super(props);
    this.state = {
      firstName: "Alex",
      lastName: "Wagner",
      age: "27",
      city: "San Francsico",
      state: "CA",
      userImage: "https://facebook.github.io/react-native/img/tiny_logo.png",
      likesArray: ["cycling", "film", "photography"],
      userBio:
        "Grew up in Portland, Oregion area. Survived middle school by becoming a skatar kid (still havne't grown out of it) Now I'm trying to pay my rent, play my msuic and maek my way. I'm into photography. so I like to snap pictures with either my phone or my camera whenever I find inspiration.",
      photosArray: [
        "https://facebook.github.io/react-native/img/tiny_logo.png",
        "https://facebook.github.io/react-native/img/tiny_logo.png",
        "https://facebook.github.io/react-native/img/tiny_logo.png",
        "https://facebook.github.io/react-native/img/tiny_logo.png",
        "https://facebook.github.io/react-native/img/tiny_logo.png",
        "https://facebook.github.io/react-native/img/tiny_logo.png"
      ],
      isSuccess: false
    };
    this.isFetched = false;
  }

  async componentDidMount() {
    //this.guid = await this.props.CreateProfileDataReducer.guid;

    this.guid = "5dddd2d8d302b94d37ade030";

    //on editing, siwtch isFetched = false
    if (!this.isFetched) {
      this.getDataFromDB();
      this.isFetched = true;
    }

    this.setState({
      isSuccess: true
    });
  }

  getDataFromDB = async () => {
    await fetch("http://74.80.250.210:4000/api/profile/query", {
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
      .then(res => {
        let object = JSON.parse(JSON.stringify(res));
        //console.log(object);
        //SUCCESS ON QUERYING DATA

        if (object.success) {
          let {
            firstName,
            lastName,
            birthDate,
            gender,
            country,
            zipCode,
            userBio,
            city,
            state
          } = object.result;

          //setState
          this.setState({
            firstName: firstName,
            lastName: lastName,
            birthDate: birthDate,
            zipCode: zipCode,
            userBio: userBio,
            city: city,
            state: state,
            isSuccess: true
          });

          //LocalStorage
          //Only insert or replace id = 1
          let insertSqlStatement =
            "INSERT OR REPLACE into device_user_aboutYou(id, createAccount_id, firstName, lastName, birthDate, gender, country, zipCode, userBio, city, state) " +
            "values(1, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

          db.transaction(
            tx => {
              //INSERT DATA
              tx.executeSql(
                insertSqlStatement,
                [
                  firstName,
                  lastName,
                  birthDate,
                  gender,
                  country,
                  zipCode,
                  userBio,
                  city,
                  state
                ],
                (tx, result) => {
                  console.log("inner success");
                },
                (tx, err) => {
                  console.log("inner error: ", err);
                }
              );

              //DISPLAY DATA
              tx.executeSql(
                "select * from device_user_aboutYou",
                null,
                (tx, result) => {
                  console.log(result);
                },
                (tx, err) => {
                  console.log("inner error: ", err);
                }
              );
            },
            (tx, err) => {
              console.log(err);
            },
            () => {
              console.log("outer success");
            }
          );

          //Redux
          this.props.SetAboutYouDataAction({
            firstName: firstName,
            lastName: lastName,
            birthDate: birthDate,
            gender: gender,
            country: country,
            zipCode: zipCode,
            userBio: userBio,
            city: city,
            state: state
          });
        } else {
          //INTERNAL ERROR
          throw new Error("internal Error");
        }
      })
      .catch(err => {
        //HANDLE ANY CATCHED ERRORS
        this.getDataFromLocalStorage()
          .then(result => {
            let {
              firstName,
              lastName,
              zipCode,
              userBio,
              city,
              state
            } = result.rows._array[0];
            //setState
            this.setState({
              firstName: firstName,
              lastName: lastName,
              zipCode: zipCode,
              userBio: userBio,
              city: city,
              state: state,
              isSuccess: true
            });
          })
          .catch(err => {
            //If error while fetching, direct user to failScreen
            //setState
            this.setState({
              isSuccess: false
            });
          });
      });
  };

  getDataFromLocalStorage = () => {
    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          //DISPLAY DATA
          tx.executeSql(
            "select * from device_user_aboutYou",
            null,
            (tx, result) => {
              if (result.rows.length <= 0) reject(new Error("Internal Error"));
              resolve(result);
            },
            (tx, err) => {
              reject(err);
            }
          );
        },
        (tx, err) => {
          reject(err);
        },
        () => {
          console.log("outer success");
        }
      );
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
            <ImageBackground
              source={{
                uri: this.state.userImage
              }}
              style={{ width: 350, height: 350, borderRadius: 50 }}
            >
              {/*Make this edit button only visible (also lock) to device user */}
              <View style={{ alignItems: "flex-end" }}>
                <TouchableOpacity
                  style={{
                    paddingLeft: 50,
                    paddingRight: 50,
                    paddingTop: 10,
                    paddingBottom: 10,
                    backgroundColor: "purple",
                    borderRadius: 50
                  }}
                  onPress={() => {
                    this.isFetched = false;
                    //this.props.navigation.navigate("EditScreen");
                    //when user do any updates on edit screen, trigger isFetched = false
                    //so the only time of update the profile screen would be editing any data or from login to profile screen
                  }}
                >
                  <Text style={{ color: "white" }}>Edit</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
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
