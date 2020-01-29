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
import { server_match } from "../../config/ipconfig";
import LoadingScreen from "../../sharedComponents/LoadingScreen";
import Footer from "../../sharedComponents/Footer";
import axios from "axios";
import SetNewMatchlistAction from "../../storage/actions/MatchReducerActions/SetNewMatchlistAction";

//SQLite
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("that.db");
import {
  insertDataIntoLocalStorage,
  selectDataFromLocalStorage,
  selectIdByGuidFromLocalStorage,
  deleteDeviceUserData
} from "../ProfileFlow/LocalStorage/localStorage.js";

class MatchingScreen extends React.Component {
  //Header

  constructor(props) {
    super(props);
    this.state = {
      isSuccess: true,
      foundaMatch: false,
      matchUserGuid: "",
      matchRoomGuid: ""
    };
    //Set up a socket that after socket send they found a match
    //then change the foundaMatch = true
  }

  handleMatchResponse = async response => {
    let matchingList;

    let interestsObject = await selectDataFromLocalStorage(
      "device_user_matchlist",
      1
    );

    let matchedUsers = null;
    //If the global matchlist is empty, use the /api/match
    if (!interestsObject.success) {
      console.log("matchlist is null");
      matchedUsers =
        response.data.matchData.matchedUsers.length > 0
          ? [...response.data.matchData.matchedUsers]
          : null;
      if (matchedUsers === null) {
        return this.props.navigation.navigate("Home");
      }

      matchingList = matchedUsers;
      //await this.props.SetNewMatchlistAction({ matchlist: matchedUsers });

      //LocalStorage
      let json_matchlist = JSON.stringify(matchedUsers);
      //Only insert or replace id = 1
      let insertSqlStatement =
        "INSERT OR REPLACE into device_user_matchlist(id, createAccount_id, matchlist, guid) " +
        "values(1, 1, ?, ?);";

      let { success } = await insertDataIntoLocalStorage(
        insertSqlStatement,
        "device_user_matchlist",
        [json_matchlist, this.props.CreateProfileDataReducer.guid],
        true
      );
    } else {
      let { guid, matchlist } = interestsObject.result.rows._array[0];
      if (guid !== this.props.CreateProfileDataReducer.guid) {
        deleteDeviceUserData();
        return this.handleMatchResponse(response);
      }
      matchingList = JSON.parse(matchlist);
      if (matchingList.length <= 0) {
        return this.props.navigation.navigate("Home");
      }
      console.log(matchingList);
    }

    this.setState({
      foundaMatch: true,
      matchUserGuid: matchingList[0].matchedUser,
      matchRoomGuid: matchingList[0].roomGuid
    });

    //Testing Use
  };

  componentDidMount() {
    this.initializeComponent();
  }

  initializeComponent = () => {
    axios
      .post(
        `${server_match}/api/match`,
        {
          _id: this.props.navigation.state.params.id
        },
        { headers: { "Content-Type": "application/json" } }
      )
      .then(response => {
        this.handleMatchResponse(response);
      })
      .catch(error => {
        console.log(error);
        return this.props.navigation.navigate("Home");
      });
  };

  didFocusSubscription = this.props.navigation.addListener(
    "didFocus",
    payload => {
      if (this.state.foundaMatch === true) {
        this.props.navigation.navigate("Home");
        this.didFocusSubscription.remove();
      }
    }
  );

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.foundaMatch !== this.state.foundaMatch) {
      if (this.state.foundaMatch) {
        //also send a private room id to match screen
        this.props.navigation.navigate("FoundaMatch", {
          matchUserGuid: this.state.matchUserGuid,
          matchRoomGuid: this.state.matchRoomGuid
        });
      }
    }
  }

  successScreen = () => {
    return (
      <View style={styles.container}>
        <View style={{ flex: 0.9 }}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator size="large" color="#fff" />
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 24, color: "#fff" }}>
                Finding a match
              </Text>
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
    flex: 1,
    backgroundColor: "#4d88ff"
  }
});

const mapStateToProps = state => {
  return { ...state };
};

const mapDispatchToProps = dispatch => {
  return {
    SetNewMatchlistAction: payload => dispatch(SetNewMatchlistAction(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MatchingScreen);
