import React from 'react';

import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  ImageBackground,
  TouchableHighlight,
  AppState
} from 'react-native';

import {
  FlingGestureHandler,
  Directions,
  State
} from 'react-native-gesture-handler';

import { connect } from 'react-redux';

import io from 'socket.io-client';

import LoadingScreen from '../../sharedComponents/LoadingScreen';


import { miniServer, localhost } from '../../config/ipconfig';

import Footer from '../../sharedComponents/Footer';

import CircularCarousel from './Chat_SharedComponents/CircularCarousel';

import { Chevron } from 'react-native-shapes';

//1. make an error screen for no data for profile screen and edit screen
//2. delay footer buttons
//3. fix faill storing
import { testobj } from '../../data/testObj';

class ConversationsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      matchedUsersList: [],
      isSuccess: false
    };

    //this.socket = io("http://74.80.250.210:3060");
    this.scrollY;
  }

  mergeArrayObjects = (arr1, arr2) => {
    return arr1.map((item, i) => {
      if (item.matchedUserGuid === arr2[i].matchedUserGuid) {
        //merging two objects
        return Object.assign({}, item, arr2[i]);
      }
    });
  };

  getMatchedUsersProfileFromDB = async matchedUsersList => {
    let matchedUserGuidArray = [];
    matchedUsersList.map(e => {
      matchedUserGuidArray.push(e.matchedUserGuid);
    });
    let arr1 = matchedUsersList;
    let arr2 = await fetch(`http://${localhost}:4000/api/profile/chat_query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        matchedUserGuidArray: matchedUserGuidArray
      })
    })
      .then(res => res.json())
      .then(res => res.result)
      .catch(err => {
        console.log(err);
      });

    if (arr2 === undefined) {
      return;
    }

    let arr3 = this.mergeArrayObjects(arr1, arr2);

    this.setState({
      matchedUsersList: arr3
    });
  };

  getMatchedUsersStatusFromDB = async guid => {
    return await fetch(`http://${localhost}:3060/api/chat/chatRooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userGuid: guid
      })
    })
      .then(res => res.json())
      .catch(err => {
        console.log(err);
      });
  };

  async componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    this.guid = await this.props.CreateProfileDataReducer.guid;
    this.user_firstName = await this.props.CreateProfileDataReducer.aboutYouData
      .firstName;

    //Get All matched User Status
    let matchedUsersList = await this.getMatchedUsersStatusFromDB(this.guid);
    if (matchedUsersList === undefined) {
      matchedUsersList = [];
    }

    //Inert all matched Users Profile Info
    await this.getMatchedUsersProfileFromDB(matchedUsersList);

    this.setState({
      isSuccess: true
    });
  }

  componentWillUnmount() {
    //this.socket.off();
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = async nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('User: ' + this.guid + ' has come to the foreground!');
      await fetch(`http://${miniServer}:3020/api/pushNotification/appState`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: { guid: this.guid, appState: 'foreground' }
        })
      })
        .then(() => console.log('success'))
        .catch(error => {
          console.log(error);
        });
    } else {
      console.log('User: ' + this.guid + ' has gone to the background!');
      await fetch(`http://${miniServer}:3020/api/pushNotification/appState`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: { guid: this.guid, appState: 'background' }
        })
      })
        .then(() => console.log('success'))
        .catch(error => {
          console.log(error);
        });
    }
    this.setState({ appState: nextAppState });
  };

  successScreen = () => {
    return (
      <View style={styles.container}>
        <View style={{ flex: 0.9 }}>
          {/*CircularCarousel */}
          <CircularCarousel
            navigation={this.props.navigation}
            matchedUsersList={this.state.matchedUsersList}
          />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4d88ff'
  },
  chatRoomBox: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    alignItems: 'center',
    width: 350,
    margin: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  chatRoomBoxWrap: {
    alignItems: 'center'
  },
  backgroundImage: {
    height: '100%',
    width: '100%'
  },
  titleBox: {
    padding: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    alignItems: 'center',
    backgroundColor: '#BF446E'
  },
  titleText: {
    color: '#fff'
  },
  buttonStyle: {
    borderRadius: 20,
    color: 'white',
    backgroundColor: '#18cdf6',
    width: 200,
    alignSelf: 'center',
    marginBottom: 20,
    fontStyle: 'italic'
  },
  buttonStyleOutline: {
    borderRadius: 20,
    color: '#18cdf6',
    borderWidth: 1,
    borderColor: '#18cdf6',
    width: 200,
    alignSelf: 'center',
    marginBottom: 5,
    fontStyle: 'italic'
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
)(ConversationsScreen);
