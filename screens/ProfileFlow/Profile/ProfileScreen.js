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

import LoadingScreen from "../../../sharedComponents/LoadingScreen";

import NotificationsButton from "../../../screens/NotificationsFlow/NotificationsButton";

import SetDeviceUserImageUrlAction from "../../../storage/actions/ImageProcessingActions/SetDeviceUserImageUrlAction/";

import Footer from "../../../sharedComponents/Footer";

import { server_profile } from "../../../config/ipconfig";

import { Icon } from "react-native-elements";

const { height, width } = Dimensions.get("window");

import PhotosAlbumModal from "./PhotosAlbumModal";

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
  selectDataFromLocalStorage,
  selectIdByGuidFromLocalStorage
} from "../LocalStorage/localStorage.js";

import { Chevron } from "react-native-shapes";

class ProfileScreen extends React.Component {
  //Header
  static navigationOptions = ({ navigation }) => ({
    title: "My Profile",
    headerRight: (
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row" }}>
          {navigation.getParam("isDeviceUser") && (
            <View style={{ bottom: "35%", right: "50%" }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Edit", {
                    dataIsEdited: () => {
                      navigation.state.params.dataIsEdited();
                    }
                  });
                }}
              >
                <Icon
                  type="font-awesome"
                  name="cog"
                  size={25}
                  color="#6a0dad"
                />
              </TouchableOpacity>
            </View>
          )}
          {/*<NotificationsButton navigation={navigation} />*/}
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
      imageUrl:
        "https://cdn.pixabay.com/photo/2016/03/31/15/33/contact-1293388_960_720.png",
      likesArray: [],
      userBio: "",
      zipCode: "",
      photosArray: ["", "", "", "", "", ""],
      addressLatitude: 0,
      addressLongitude: 0,
      isSuccess: false,
      isEdited: false,
      isAlbumSectionVisible: false,
      selectedPhotoIndex: ""
    };
  }

  //detect if there is data edit in editscreen
  //if yes, fetch the new changed data from db
  //then reset the state to false
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.isEdited !== prevState.isEdited) {
      this.getDataFromDB();
      this.setState({
        isEdited: false
      });
    }
  }

  //This function will be pass into edit screen
  //everytime if data is edited,
  //set the isEdited to true
  //and componentDidUpdate will detect the state changes
  dataIsEdited = () => {
    this.setState({
      isEdited: true
    });
  };

  setAlbumSectionVisible = (isAlbumSectionVisible, selectedPhotoIndex) => {
    this.setState({ isAlbumSectionVisible, selectedPhotoIndex });
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

    /*
    ProfileScreen will receive only two paramaters passed from footer and LinksScreen
    footer : Redux guid and isDeviceUser = true
    linkscreen : regular guid and isDeviceUser = false

    Edit Screen
    In the static header, use the isDeviceUser to make the Edit button only visible to Device's user
    */

    const { navigation } = this.props;
    this.guid = navigation.getParam("guid");

    console.log("ProfileScreen");
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
    await fetch(`${server_profile}/api/profile/profile_query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
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
            zipCode,
            likesArray,
            addressLatitude,
            addressLongitude,
            imageUrl
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
            zipCode: zipCode,
            likesArray: likesArray,
            addressLatitude: addressLatitude,
            addressLongitude: addressLongitude,
            imageUrl: imageUrl,
            isSuccess: true
          });

          //LocalStorage
          //Check If this profile screen belongs to Device's User
          if (this.guid === this.props.CreateProfileDataReducer.guid) {
            //Store to device_user_createAccount
            let insertSqlStatement =
              "INSERT OR REPLACE into device_user_createAccount(id, guid, addressLatitude, addressLongitude) " +
              "values(1, ?, ?, ?);";

            let { success } = await insertDataIntoLocalStorage(
              insertSqlStatement,
              "device_user_createAccount",
              [this.guid, addressLatitude, addressLongitude],
              false
            );

            //Store to device_user_aboutYou
            insertSqlStatement =
              "INSERT OR REPLACE into device_user_aboutYou(id, createAccount_id, firstName, lastName, birthDate, userBio, city, state, zipCode) " +
              "values(1, 1, ?, ?, ?, ?, ?, ?, ?);";

            success = await insertDataIntoLocalStorage(
              insertSqlStatement,
              "device_user_aboutYou",
              [firstName, lastName, birthDate, userBio, city, state, zipCode],
              false
            );

            //Store to device_user_interests
            insertSqlStatement =
              "INSERT OR REPLACE into device_user_interests(id, createAccount_id, likesArray) " +
              "values(1, 1, ?);";

            let json_likesArray = JSON.stringify({
              likesArray: likesArray
            });

            success = await insertDataIntoLocalStorage(
              insertSqlStatement,
              "device_user_interests",
              [json_likesArray],
              false
            );

            //Store to device_user_imageProcessing
            insertSqlStatement =
              "INSERT OR REPLACE into device_user_imageProcessing(id, createAccount_id, imageUrl) " +
              "values(1, 1, ?);";

            success = await insertDataIntoLocalStorage(
              insertSqlStatement,
              "device_user_imageProcessing",
              [imageUrl],
              false
            );

            //store image url to redux
            this.props.SetDeviceUserImageUrlAction({
              url: imageUrl
            });

            if (!success) {
              console.log("failed storing data into localStorage");
              //handle error on inserting data into localStorage
            }
          } else {
            //If this profile screen not belongs device's user, it must be matched user profile
            //here is store to matched's user tables
            console.log("store matched profile info");
            //Find id by GUID
            let idObject = await selectIdByGuidFromLocalStorage(
              "matched_user_info",
              this.guid
            );
            let id;
            let insertSqlStatement;
            if (idObject.success) {
              id = idObject.result.rows._array[0].id;
              insertSqlStatement =
                "INSERT OR REPLACE into matched_user_info(id, guid, addressLatitude, addressLongitude, birthDate, firstName, lastName, zipCode, userBio, city, state, likesArray, imageUrl) " +
                `values(${id}, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
            } else {
              insertSqlStatement =
                "INSERT OR REPLACE into matched_user_info(id, guid, addressLatitude, addressLongitude, birthDate, firstName, lastName, zipCode, userBio, city, state, likesArray, imageUrl) " +
                `values(${null}, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
            }

            //Store to matched_user_info
            let json_likesArray = JSON.stringify({
              likesArray: likesArray
            });

            let { success } = await insertDataIntoLocalStorage(
              insertSqlStatement,
              "matched_user_info",
              [
                this.guid,
                addressLatitude,
                addressLongitude,
                birthDate,
                firstName,
                lastName,
                zipCode,
                userBio,
                city,
                state,
                json_likesArray,
                imageUrl
              ],
              false
            );

            return;
          }
        } else {
          //INTERNAL ERROR
          throw new Error("internal Error");
        }
      })
      .catch(async err => {
        console.log("ERROR");
        //console.log(err);
        //HANDLE ANY CATCHED ERRORS
        //AND WILL TRY TO GET DATA FROM LOCALSTORAGE
        //LocalStorage
        //Check if localstorage guid === current device's user guid
        if (this.guid === this.props.CreateProfileDataReducer.guid) {
          //Get Device's User Data from localStorage device_user_aboutYou table
          let aboutYouObject = await selectDataFromLocalStorage(
            "device_user_aboutYou",
            1
          );

          let interestsObject = await selectDataFromLocalStorage(
            "device_user_interests",
            1
          );

          let createAccountObject = await selectDataFromLocalStorage(
            "device_user_createAccount",
            1
          );

          let imageProcessingObject = await selectDataFromLocalStorage(
            "device_user_imageProcessing",
            1
          );

          if (
            aboutYouObject.success &&
            interestsObject.success &&
            createAccountObject.success &&
            imageProcessingObject.success
          ) {
            let { guid } = createAccountObject.result.rows._array[0];
            //if there is already a localstroage guid
            //and if that guid doesn't match the guid that is inside redux guid
            //then set the screen to false
            if (guid !== this.props.CreateProfileDataReducer.guid) {
              return this.setState({
                isSuccess: false
              });
            }

            let {
              firstName,
              lastName,
              birthDate,
              state,
              city,
              userBio,
              zipCode
            } = aboutYouObject.result.rows._array[0];

            let { likesArray } = interestsObject.result.rows._array[0];
            likesArray = JSON.parse(likesArray).likesArray;

            let {
              addressLatitude,
              addressLongitude
            } = createAccountObject.result.rows._array[0];

            let { imageUrl } = imageProcessingObject.result.rows._array[0];

            //store image url to redux
            this.props.SetDeviceUserImageUrlAction({
              url: imageUrl
            });

            //setState
            this.setState({
              firstName: firstName,
              lastName: lastName,
              birthDate: birthDate,
              userBio: userBio,
              age: _calculateAge(birthDate),
              city: city,
              state: state,
              zipCode: zipCode,
              likesArray: likesArray,
              addressLatitude: addressLatitude,
              addressLongitude: addressLongitude,
              imageUrl: imageUrl,
              isSuccess: true
            });
          } else {
            //If error while getting data from localstorage,
            //then direct user to erroscreen
            this.setState({
              isSuccess: false
            });
          }
        } else {
          //Get Matched User's Data from localStorage
          //Find id by GUID
          let idObject = await selectIdByGuidFromLocalStorage(
            "matched_user_info",
            this.guid
          );

          if (idObject.success) {
            let id = idObject.result.rows._array[0].id;
            let matched_user_infoObject = await selectDataFromLocalStorage(
              "matched_user_info",
              id
            );

            let {
              firstName,
              lastName,
              birthDate,
              state,
              city,
              userBio,
              zipCode,
              likesArray,
              addressLatitude,
              addressLongitude,
              imageUrl
            } = matched_user_infoObject.result.rows._array[0];
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
              zipCode: zipCode,
              likesArray: likesArray,
              addressLatitude: addressLatitude,
              addressLongitude: addressLongitude,
              imageUrl: imageUrl,
              isSuccess: true
            });
          } else {
            //fail query data
            this.setState({
              isSuccess: false
            });
          }
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

    let displayAlbumPhotos = this.state.photosArray.map((e, index = 0) => {
      return e === "" ? (
        <TouchableOpacity
          onPress={() => {
            if (this.props.navigation.getParam("isDeviceUser")) {
              this.setAlbumSectionVisible(true, index);
            }
          }}
          key={index++}
          style={{
            width: width * 0.267,
            height: width * 0.2,
            borderRadius: 15,
            backgroundColor: "#eeeeee",
            margin: 3
          }}
        >
          <View style={{ top: "20%" }}>
            <Text style={{ textAlign: "center", fontSize: 35 }}>+</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            if (this.props.navigation.getParam("isDeviceUser")) {
              this.setAlbumSectionVisible(true, index);
            }
          }}
          key={index++}
        >
          <Image
            source={{
              uri: e
            }}
            style={{
              width: width * 0.267,
              height: width * 0.2,
              borderRadius: 15,
              margin: 3
            }}
          />
        </TouchableOpacity>
      );
    });

    return (
      <View style={styles.container}>
        <View style={{ flex: 0.9 }}>
          <View style={{ padding: "1%" }} />
          <ScrollView>
            <View style={{ alignItems: "center" }}>
              {/**User Image */}
              <Image
                source={{
                  uri: this.state.imageUrl
                }}
                style={{
                  width: width * 0.93,
                  height: width * 0.93,
                  borderRadius: 15
                }}
              />
            </View>

            <View style={{ margin: 20 }}>
              <Text
                style={{ color: "#6a0dad", fontSize: 20, fontWeight: "500" }}
              >
                {/**User Name */}
                {this.state.firstName} {this.state.lastName}, {this.state.age}
              </Text>
              <Text />

              {/*Map*/}
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("ProfileLocation", {
                    addressLatitude: this.state.addressLatitude,
                    addressLongitude: this.state.addressLongitude
                  });
                }}
              >
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  <Icon
                    type="font-awesome"
                    name="map-marker"
                    size={width * 0.04}
                    color="#6a0dad"
                    iconStyle={{ bottom: 0 }}
                  />

                  <View style={{ padding: "1%" }} />

                  {/*Address*/}
                  <Text
                    style={{
                      color: "#6a0dad",
                      fontSize: 15,
                      fontWeight: "400"
                    }}
                  >
                    {this.state.city}, {this.state.state}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/**border line */}
            <View
              style={{
                borderWidth: 1,
                borderColor: "#d6d7da",
                marginLeft: "5%",
                marginRight: "5%"
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
              <Text
                style={{ color: "#6a0dad", fontSize: 17, fontWeight: "500" }}
              >
                Interests
              </Text>
            </View>
            {/*Likes*/}
            <View>
              <View style={{ flexDirection: "row", margin: "3%" }}>
                {displaylikesArray}
              </View>
            </View>
            <View style={{ padding: 7.5 }} />

            {/**border line */}
            <View
              style={{
                borderWidth: 1,
                borderColor: "#d6d7da",
                marginLeft: "5%",
                marginRight: "5%"
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
              <Text
                style={{ color: "#6a0dad", fontSize: 17, fontWeight: "500" }}
              >
                About Me
              </Text>
            </View>
            {/*Bio*/}
            <View style={{ margin: 15 }}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "100",
                  textAlign: "left",
                  lineHeight: 30,
                  color: "#6a0dad"
                }}
              >
                {this.state.userBio}
              </Text>
            </View>

            {/**border line */}
            <View
              style={{
                borderWidth: 1,
                borderColor: "#d6d7da",
                marginLeft: "5%",
                marginRight: "5%"
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
              <Text
                style={{ color: "#6a0dad", fontSize: 17, fontWeight: "500" }}
              >
                Photo
              </Text>
            </View>
            <View
              style={{
                margin: 20,
                alignItems: "center"
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap"
                }}
              >
                {displayAlbumPhotos}
              </View>
            </View>
          </ScrollView>
        </View>

        <PhotosAlbumModal
          isAlbumSectionVisible={this.state.isAlbumSectionVisible}
          selectedPhotoIndex={this.state.selectedPhotoIndex}
          setAlbumSectionVisible={this.setAlbumSectionVisible}
        />

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
    borderWidth: 1,
    backgroundColor: "#eeeaf3",
    borderColor: "#6a0dad",
    margin: 5
  },
  likeButton: {
    color: "#6a0dad",
    fontSize: 17
  }
});

const mapStateToProps = state => {
  return { ...state };
};

const mapDispatchToProps = dispatch => {
  return {
    SetDeviceUserImageUrlAction: payload =>
      dispatch(SetDeviceUserImageUrlAction(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileScreen);
