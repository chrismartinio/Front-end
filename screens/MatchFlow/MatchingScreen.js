import * as React from 'react';
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
} from 'react-native';
import { connect } from 'react-redux';
import { miniServer } from '../../config/ipconfig';
import LoadingScreen from '../../sharedComponents/LoadingScreen';
import Footer from '../../sharedComponents/Footer';
import axios from 'axios';

class MatchingScreen extends React.Component {
  //Header

  constructor(props) {
    super(props);
    this.state = {
      isSuccess: true,
      foundaMatch: false,
      match: '',
      user: ''
    };
    //Set up a socket that after socket send they found a match
    //then change the foundaMatch = true
  }

  handleMatchResponse = response => {
    const matchedUsers =
      response.data.matchData.matchedUsers.length > 0
        ? [...response.data.matchData.matchedUsers]
        : null;
    if (matchedUsers === null) {
      return this.props.navigation.navigate('Home');
    }
    this.setState({
      foundaMatch: true,
      match: matchedUsers[0],
      user: response.data.userGuid
    });
  };

  componentDidMount() {
    this.props.navigation.setParams({ backFromMatch: this.backFromMatch });
    axios
      .post(
        `http://${miniServer}:5000/api/match`,
        {
          _id: '5df0426e1c9d44000040a446'
        },
        { headers: { 'Content-Type': 'application/json' } }
      )
      .then(response => {
        this.handleMatchResponse(response);
      })
      .catch(error => {
        return this.props.navigation.navigate('Home');
      });
  }

  backFromMatch = () => {
    this.setState({
      foundaMatch: false
    });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.foundaMatch !== this.state.foundaMatch) {
      if (this.state.foundaMatch) {
        //also send a private room id to match screen
        this.props.navigation.navigate('FoundaMatch', {
          backFromMatch: () => {
            this.props.navigation.state.params.backFromMatch();
          },
          match: this.state.match,
          userGuid: this.state.userGuid
        });
      }
    }
  }

  successScreen = () => {
    return (
      <View style={styles.container}>
        <View style={{ flex: 0.9 }}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#fff" />
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, color: '#fff' }}>
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

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4d88ff'
  }
});

const mapStateToProps = state => {
  return { ...state };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(MatchingScreen);
