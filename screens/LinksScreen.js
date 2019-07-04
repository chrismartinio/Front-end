import React from "react";
import { ScrollView, StyleSheet, Text, View, Button } from "react-native";
import { ExpoLinksView } from "@expo/samples";
import ProfilePage from "./SignUpFlow/ProfilePage";
import MatchesPage from "./SignUpFlow/Matches";
import RegistrationPage from "./SignUpFlow/RegistrationPage";
import SelfiePage from "./SignUpFlow/SelfiePage";
import SignupPage from "./SignUpFlow/SignupPage";
import ImInterestedIn from "../screens/SignUpFlow/ImInterestedIn";
import PhotoReview from "./SignUpFlow/PhotoReview";
import MatchBackground from "../components/ChatFlow/MatchBackground";
import InitialMatchChoice from "./ChatFlow/InitialMatchChoice";
import Selection from "./ChatFlow/Selection";
import GhostingOthers from "./ChatFlow/GhostingOthers";
import GotGhosted from "./ChatFlow/GotGhosted";
import GotLucky from "./ChatFlow/GotLuckyGoToChat";
import ChatPage from "./ChatFlow/chatMain";
import firebase from "../utils/mainFire";

import t from "tcomb-form-native";
const Form = t.form.Form;

var Component = t.enums(
  {
    sCurrTest: "Current Test Screen",
    sImInterestedIn: "SignupFlow/ImInterestedIn",
    sSpendWeekend: "SignupFlow/SpendWeekend",
    sPROFILE: "SignupFlow/ProfilePage",
    sMATCHES: "SignupFlow/Matches",
    sChatPage: "ChatFlow/chatMain",
    sSELFIE: "SignupFlow/SelfiePage",
    sREGISTRATION: "SignupFlow/RegistrationPage",
    sSIGNUP: "SignupFlow/SignupPage",
    sPHOTOREVIEW: "SignupFlow/PhotoReview",
    sSelection: "ChatFlow/Selection",
    sGhostingOthers: "ChatFlow/GhostOthers",
    sGotGhosted: "ChatFlow/GotGhosted",
    sGotLucky: "ChatFlowGotLucky",
    sCreateQuestionaire: "MatchFlow/CreateQuestionaire",
    sCreateReply: "MatchFlow/ReplyQuestionaire",
    sViewReply: "MatchFlow/ViewQuestionnaire"
  },
  "Component"
);

var details = t.struct({
  Component: Component
});

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: "Testing Screen"
  };
  constructor(props) {
    super(props);
    this.state = {
      CurrentScreen: ProfilePage
    };
    this.buttonAry = [
      "TestProfile",
      "TestMatches",
      "TestRegistration",
      "TestSelfie",
      "TestSignUp",
      "TestPhotoReview",
      "TestScreen",
      "Selection",
      "GhostingOthers",
      "GotGhosted",
      "GotLucky",
      "CreateQuestionaire",
      "ReplyQuestionaire",
      "ViewQuestionaire",
      "TestAboutUs",
      "TestTellUsMore",
      "TestImInterestedIn",
      "TestSpendWeekend",
      "TestWouldRather"
    ];
  }

  handleChange = () => {
    if(this._form.getValue().Component === 'sPROFILE'){
      this.props.navigation.navigate('TestProfile');
    } else if(this._form.getValue().Component === 'sMATCHES'){
      this.props.navigation.navigate('TestMatches');
    }else if(this._form.getValue().Component === 'sChatPage'){
      this.props.navigation.navigate('TestChatPage');
    }else if(this._form.getValue().Component === 'sREGISTRATION'){
      this.props.navigation.navigate('TestRegistration');
    }  else if(this._form.getValue().Component === 'sSELFIE'){
      this.props.navigation.navigate('TestSelfie');
    } else if(this._form.getValue().Component === 'sSIGNUP'){
      this.props.navigation.navigate('TestSignUp');
    } else if(this._form.getValue().Component === 'sPHOTOREVIEW'){
      this.props.navigation.navigate('TestPhotoReview');
    }  else if(this._form.getValue().Component === 'sCurrTest'){
      this.props.navigation.navigate('TestScreen');
    } else if(this._form.getValue().Component === 'sSelection'){
      this.props.navigation.navigate('Selection');
    } else if(this._form.getValue().Component === 'sGhostingOthers'){
      this.props.navigation.navigate('GhostingOthers');
    } else if(this._form.getValue().Component === 'sGotGhosted'){
      this.props.navigation.navigate('GotGhosted');
    } else if(this._form.getValue().Component === 'sGotLucky'){
      this.props.navigation.navigate('GotLucky');
    } else if(this._form.getValue().Component === 'sCreateQuestionaire'){
      this.props.navigation.navigate('CreateQuestionaire');
    } else if(this._form.getValue().Component === 'sCreateReply'){
      this.props.navigation.navigate('ReplyQuestionaire');
    } else if(this._form.getValue().Component === 'sViewReply'){
      this.props.navigation.navigate('ViewQuestionaire');
    }else if(this._form.getValue().Component === 'sImInterestedIn'){
      this.props.navigation.navigate('TestImInterestedIn');
    }else if(this._form.getValue().Component === 'sSpendWeekend'){
      this.props.navigation.navigate('TestSpendWeekend');
    }
  };

  /*
  handleClick = (page) => {
    this.props.navigation.navigate(page)
  }
  */

  storeHighScore = (userId, score) => {
    firebase
      .database()
      .ref("messages/" + userId)
      .set({
        highscore: score
      });
  };

  getData = userId => {
    firebase
      .database()
      .ref("users/" + "fun@mailcom")
      .on("value", snapshot => {
        const highscore = snapshot.val().highscore;
        console.log("New high score: " + highscore);
      });
  };

  render() {
    this.storeHighScore("fun@mailcom", 200);
    let CurrentScreen = this.state.CurrentScreen;
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
