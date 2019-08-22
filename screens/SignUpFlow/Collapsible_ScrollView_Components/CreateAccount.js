import React, { Component } from "react";
import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground
} from "react-native";
import { LinearGradient } from "expo";
import { connect } from "react-redux";
import SetUserDataAction from "../../../storage/actions/SetUserDataAction";
import firebase from "../../../utils/mainFire";
import { Icon, Input } from "react-native-elements";
import { Chevron } from "react-native-shapes";
import axios from "axios";

//click password button to toggle password
//duplicate email from database


//this.props.CreateAuthDataReducer.data

const profileServer = "http://74.80.250.210:5000/dbRouter/";

class CreateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      confirmEmail: "",
      password: "",
      confrimPassword: "",
      emailWarning: "empty",
      confirmEmailWarning: "empty",
      passwordWarning: "empty",
      confirmPasswordWarning: "empty",
      password_UpperLowerCaseWarning: true,
      password_NumberSymbolWarning: true,
      password_LengthWarning: true,
      passed: false,
      editable: true
    };

    //TESTING USE : DELETE WHEN CONNECT TO onAuth

    //user identiflier
    //mode = undone
    //mode = done
    //this.mode = ""; // regular
    this.mode = "undone"; //regular undone, third_parties, third_parties undone
    this.gui = "5d5b2d8b1dc6d2bd12a1dc7e"; // regular undone and third_parties undone
    //this.gui = ""; //third_parties
    this.reduxEmail = "hhh@live.com"; //regular undone, third_parties, third_parties undone
    this.reduxPassword = "12345Abc"; //regular undone, third_parties, third_parties undone

    //TESTING USE : DELETE WHEN CONNECT TO onAuth
  }

  componentDidMount() {
    //For Undone User
    if (this.mode === "undone") {
      let email = this.reduxEmail;
      let password = this.reduxPassword;

      //For third parties User
      //Third Parties User has same properties as undone user
      //Except they would have to genereate a new GUI
      //The Purpose of set the mode is that to bypass the first two comparison inside the handleSubmit():
      //1. if (this.state.editable === false && this.mode === "") { This is for User second submission
      //2. } else if (this.state.editable === false && this.mode === "undone") { This is for Undone user
      //After the third parties User submit and generated a new GUI
      //its mode will change to empty (mode = "") so to satisfies the first comparsion
      if (this.gui === "") {
        this.mode = "3rd";
      }

      this.setState({
        email: email,
        confirmEmail: email,
        password: password,
        confirmPassword: password,
        emailWarning: "",
        confirmEmailWarning: "",
        passwordWarning: "",
        confirmPasswordWarning: "",
        password_UpperLowerCaseWarning: false,
        password_NumberSymbolWarning: false,
        password_LengthWarning: false,
        editable: false
      });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    //if there have any udpate to the warnings by checking this.state and prevState
    //then call the allChecker()
    //allCheck will check if there any warnings
    //If there have warnings: button show transparent (passed)
    //If there have no warnings: button show green (passed)
    if (
      this.state.emailWarning !== prevState.emailWarning ||
      this.state.confirmEmailWarning !== prevState.confirmEmailWarning ||
      this.state.passwordWarning !== prevState.passwordWarning ||
      this.state.confirmPasswordWarning !== prevState.confirmPasswordWarning
    ) {
      this.allChecker();
      //any changes will remove the check mark from CollapsibleComponent CheckMark
      this.props.handlePassed("createAccount", false);
    }
  }

  //format checkers below
  emailCheck = email => {
    // email validty check?
    const checkAT = email.indexOf("@");
    const checkCOM = email.indexOf(".com");
    if (checkAT > 0 && checkCOM > 0 && email.length > 4) {
      return true;
    }
    return false;
  };

  nullCheck = value => {
    if (value !== "") {
      return true;
    }
    return false;
  };

  passwordLength = password => {
    if (!(password.length >= 8)) {
      return false;
    }
    return true;
  };

  passworcdCase = password => {
    // use positive look ahead to see if at least one lower case letter exists
    //let regExp = /^(?=.*[a-z])/;
    // use positive look ahead to see if at least one upper case letter exists
    //regExp = /^(?=.*[A-Z])/;
    if (!(/^(?=.*[a-z])/.test(password) && /^(?=.*[A-Z])/.test(password))) {
      return false;
    }
    return true;
  };

  passwordNonLetter = password => {
    // use positive look ahead to see if at least one digit exists
    //let regExp = /^(?=.*[0-9])/;
    // use positive look ahead to see if at least one non-word character exists
    //regExp = /^(?=.*\W)/;
    if (!(/^(?=.*[0-9])/.test(password) || /^(?=.*\W)/.test(password))) {
      return false;
    }
    return true;
  };

  passwordCheck = password => {
    let pLength = this.passwordLength(password);
    let pCase = this.passworcdCase(password);
    let pNonLetter = this.passwordNonLetter(password);

    if (pLength === false) {
      return false;
    }
    if (pCase === false) {
      return false;
    }
    if (pNonLetter === false) {
      return false;
    }

    return true;
  };

  //format checkers above

  //check email
  emailChecker = () => {
    //Clear confirmEmail Input if any changes made to email input
    this.confirmEmailInput.clear();
    this.setState({
      confirmEmailWarning: "empty"
    });

    if (!this.nullCheck(this.state.email)) {
      this.setState({
        emailWarning: "empty"
      });
    } else if (!this.emailCheck(this.state.email)) {
      this.setState({
        emailWarning: "invalid"
      });
    } else {
      this.setState({
        emailWarning: ""
      });
    }
  };

  confirmEmailChecker = () => {
    if (!this.nullCheck(this.state.confirmEmail)) {
      this.setState({
        confirmEmailWarning: "empty"
      });
    } else if (this.state.email !== this.state.confirmEmail) {
      this.setState({
        confirmEmailWarning: "notmatch"
      });
    } else {
      this.setState({
        confirmEmailWarning: ""
      });
    }
  };

  passwordChecker = () => {
    //Clear password Input if any changes made to password input
    this.confirmPasswordInput.clear();
    this.setState({
      confirmPasswordWarning: "empty"
    });
    if (!this.nullCheck(this.state.password)) {
      this.setState({
        passwordWarning: "empty",
        password_UpperLowerCaseWarning: true,
        password_NumberSymbolWarning: true,
        password_LengthWarning: true
      });
    } else if (!this.passwordCheck(this.state.password)) {
      let pLength = !this.passwordLength(this.state.password);
      let pLetterCase = !this.passworcdCase(this.state.password);
      let pNonLetter = !this.passwordNonLetter(this.state.password);
      this.setState({
        passwordWarning: "invalid",
        password_UpperLowerCaseWarning: pLetterCase,
        password_NumberSymbolWarning: pNonLetter,
        password_LengthWarning: pLength
      });
    } else {
      this.setState({
        passwordWarning: "",
        password_UpperLowerCaseWarning: false,
        password_NumberSymbolWarning: false,
        password_LengthWarning: false
      });
    }
  };

  confirmPasswordChecker = () => {
    if (!this.nullCheck(this.state.confirmPassword)) {
      password = false;
      this.setState({
        confirmPasswordWarning: "empty"
      });
    } else if (this.state.password !== this.state.confirmPassword) {
      password = false;
      this.setState({
        confirmPasswordWarning: "notmatch"
      });
    } else {
      password = true;
      this.setState({
        confirmPasswordWarning: ""
      });
    }
  };

  //control next button style and next screen
  allChecker = () => {
    if (
      this.state.emailWarning === "" &&
      this.state.confirmEmailWarning === "" &&
      this.state.passwordWarning === "" &&
      this.state.confirmPasswordWarning === ""
    ) {
      this.setState({
        passed: true
      });
    } else {
      this.setState({
        passed: false
      });
    }
  };

  handleSubmit = () => {

    //First comparsion
    //Purpose: Prevent Regular user Second submission
    //Even though Regular user mode is set to empty (mode = "") by default
    //However, the editable is also set to true by default to meet the first comparison
    if (this.state.editable === false && this.mode === "") {
      this.props.handlePassed("createAccount", true);
      return;

    //Second comparision
    //Purpose: Prevent Undone User (they already have a GUI) for second submission
    //Also, onAuth will pass a gui to on-boarding, we will use that gui on other screen
    //That's why we send the gui/email/password to redux
    } else if (this.state.editable === false && this.mode === "undone") {
      //TESTING USE : DELETE WHEN CONNECT TO onAuth
      //Send data to Redux
      this.props.SetUserDataAction({
        gui: this.gui,
        email: this.state.email,
        password: this.state.password
      });
      //TESTING USE : DELETE WHEN CONNECT TO onAuth

      this.props.handlePassed("createAccount", true);
      return;
    }

    if (this.state.passed) {
      //If the createAccount screen is submit
      //We do not want the user to submit other one (generate a new gui) on the same registration
      //the editable will lock the input to prevent changing email or password
      this.setState({
        editable: false
      });

      //For third Parties User (Prevent Second submission)
      this.mode = "";

      //Send data to database
      fetch("http://74.80.250.210:5000/dbRouter/createAccountSubmit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password
        })
      })
        .then(res => res.json())
        .then(res => {
          let object = JSON.parse(JSON.stringify(res));

          if (object.success) {
            //Send data to Redux
            this.props.SetUserDataAction({
              gui: object.gui,
              email: this.state.email,
              password: this.state.password
            });
          } else {
            this.setState(
              {
                emailWarning: "duplicate",
                editable: true
              },
              () => {
                this.props.handlePassed("createAccount", "duplicate");
              }
            );
          }
        })
        .catch(function(error) {
          console.error(error.message);
          throw error;
        });

      //if successed to passed, it will put the check mark from CollapsibleComponent CheckMark
      this.props.handlePassed("createAccount", true);
    }
  };

  render() {
    let emptyEmail = (
      <Text style={styles.warningText}>* Please enter a email</Text>
    );
    let emptyPassword = (
      <Text style={styles.warningText}>* Please enter a password</Text>
    );

    let invalidEmailWarning = (
      <Text style={styles.warningText}>
        * Please enter a valid email address
      </Text>
    );

    let duplicateEmailWarning = (
      <Text style={styles.warningText}>* Email has been used.</Text>
    );

    let invalidConfirmEmailWarning = (
      <Text style={styles.warningText}>* Email address does not match</Text>
    );

    let invalidPasswordWarning = (
      <Text style={styles.warningText}>* Please enter a valid password</Text>
    );

    let invalidConfirmPasswordWarning = (
      <Text style={styles.warningText}>* Password does not match</Text>
    );

    let allEmptyWarning =
      this.state.emailWarning === "empty" ||
      this.state.confirmEmailWarning === "empty" ||
      this.state.passwordWarning === "empty" ||
      this.state.confirmPasswordWarning === "empty";

    return (
      <View style={{ flex: 1 }}>
        {/*Spaces*/}
        <View
          style={{
            padding: "3%"
            //borderRadius: 4,
            //borderWidth: 0.5,
            //borderColor: "#d6d7da"
          }}
        />

        {/**email */}
        <View style={{ width: "100%" }}>
          <Input
            placeholder="email"
            placeholderTextColor="#fff"
            containerStyle={styles.inputContainerStyle}
            inputStyle={styles.inputStyle}
            value={this.state.email}
            rightIcon={
              this.state.emailWarning === "" ? (
                <Icon type="font-awesome" name="check" color="#fff" />
              ) : (
                <Icon
                  type="font-awesome"
                  name="exclamation-circle"
                  color="#fff"
                />
              )
            }
            editable={this.state.editable}
            autoCompleteType={false}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={email =>
              this.setState({ email }, () => {
                this.emailChecker();
              })
            }
          />
          {this.state.emailWarning === "empty" && emptyEmail}
          {this.state.emailWarning === "invalid" && invalidEmailWarning}
          {this.state.emailWarning === "duplicate" && duplicateEmailWarning}
        </View>
        {/*Spaces*/}
        <View
          style={{
            padding: "3%"
            //borderRadius: 4,
            //borderWidth: 0.5,
            //borderColor: "#d6d7da"
          }}
        />

        {/**confirm email*/}
        <View>
          <Input
            placeholder="confirm email"
            placeholderTextColor="#fff"
            containerStyle={styles.inputContainerStyle}
            inputStyle={styles.inputStyle}
            value={this.state.confirmEmail}
            rightIcon={
              this.state.confirmEmailWarning === "" ? (
                <Icon type="font-awesome" name="check" color="#fff" />
              ) : (
                <Icon
                  type="font-awesome"
                  name="exclamation-circle"
                  color="#fff"
                />
              )
            }
            editable={this.state.editable}
            autoCompleteType={false}
            autoCapitalize="none"
            autoCorrect={false}
            ref={input => {
              this.confirmEmailInput = input;
            }}
            onChangeText={confirmEmail =>
              this.setState({ confirmEmail }, () => {
                this.confirmEmailChecker();
              })
            }
          />
          {this.state.confirmEmailWarning === "empty" && emptyEmail}
          {this.state.confirmEmailWarning === "notmatch" &&
            invalidConfirmEmailWarning}
        </View>
        {/*Spaces*/}
        <View
          style={{
            padding: "3%"
            //borderRadius: 4,
            //borderWidth: 0.5,
            //borderColor: "#d6d7da"
          }}
        />

        {/**password*/}
        <View>
          <Input
            placeholder="password"
            placeholderTextColor="#fff"
            containerStyle={styles.inputContainerStyle}
            inputStyle={styles.inputStyle}
            value={this.state.password}
            rightIcon={
              this.state.passwordWarning === "" ? (
                <Icon type="font-awesome" name="check" color="#fff" />
              ) : (
                <Icon
                  type="font-awesome"
                  name="exclamation-circle"
                  color="#fff"
                />
              )
            }
            editable={this.state.editable}
            autoCompleteType={false}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            onChangeText={password =>
              this.setState({ password }, () => {
                this.passwordChecker();
              })
            }
          />
          {this.state.passwordWarning === "empty" && emptyPassword}
          {this.state.passwordWarning === "invalid" && invalidPasswordWarning}
        </View>
        {/*Spaces*/}
        <View
          style={{
            padding: "3%"
            //borderRadius: 4,
            //borderWidth: 0.5,
            //borderColor: "#d6d7da"
          }}
        />

        {/**confirm password*/}
        <View>
          <Input
            placeholder="confirmPassword"
            placeholderTextColor="#fff"
            containerStyle={styles.inputContainerStyle}
            inputStyle={styles.inputStyle}
            value={this.state.confirmPassword}
            rightIcon={
              this.state.confirmPasswordWarning === "" ? (
                <Icon type="font-awesome" name="check" color="#fff" />
              ) : (
                <Icon
                  type="font-awesome"
                  name="exclamation-circle"
                  color="#fff"
                />
              )
            }
            editable={this.state.editable}
            autoCompleteType={false}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            ref={input => {
              this.confirmPasswordInput = input;
            }}
            onChangeText={confirmPassword =>
              this.setState({ confirmPassword }, () => {
                this.confirmPasswordChecker();
              })
            }
          />
          {this.state.confirmPasswordWarning === "empty" && emptyPassword}
          {this.state.confirmPasswordWarning === "notmatch" &&
            invalidConfirmPasswordWarning}
        </View>
        {/*Spaces*/}
        <View
          style={{
            padding: "3%"
            //borderRadius: 4,
            //borderWidth: 0.5,
            //borderColor: "#d6d7da"
          }}
        />

        <View
          style={{
            borderRadius: 4,
            borderWidth: 0.5,
            borderColor: "#fff",
            padding: "3%"
          }}
        >
          <View
            style={{
              flexWrap: "wrap",
              alignItems: "flex-start",
              flexDirection: "row"
            }}
          >
            {this.state.password_UpperLowerCaseWarning ? (
              <Icon name="times" type="font-awesome" color="red" />
            ) : (
              <Icon name="check" type="font-awesome" color="lightgreen" />
            )}
            <Text style={{ color: "#fff", paddingVertical: 5 }}>
              {"   "}
              include upper and lower case
            </Text>
          </View>

          <View
            style={{
              flexWrap: "wrap",
              alignItems: "flex-start",
              flexDirection: "row"
            }}
          >
            {this.state.password_NumberSymbolWarning ? (
              <Icon name="times" type="font-awesome" color="red" />
            ) : (
              <Icon name="check" type="font-awesome" color="lightgreen" />
            )}
            <Text style={{ color: "#fff", paddingVertical: 5 }}>
              {"   "}
              include at least a number or symbol
            </Text>
          </View>

          <View
            style={{
              flexWrap: "wrap",
              alignItems: "flex-start",
              flexDirection: "row"
            }}
          >
            {this.state.password_LengthWarning ? (
              <Icon name="times" type="font-awesome" color="red" />
            ) : (
              <Icon name="check" type="font-awesome" color="lightgreen" />
            )}
            <Text style={{ color: "#fff", paddingVertical: 5 }}>
              {"   "}
              be at least 8 characters long
            </Text>
          </View>
        </View>
        {/*Spaces*/}
        <View
          style={{
            padding: "3%"
            //borderRadius: 4,
            //borderWidth: 0.5,
            //borderColor: "#d6d7da"
          }}
        />

        {/*Next Button*/}

        <View
          alignItems="center"
          style={{ opacity: this.state.passed ? 1.0 : 0.5 }}
        >
          <TouchableOpacity
            style={styles.nextButton}
            onPress={this.handleSubmit}
            disabled={!this.state.passed}
          >
            <Text style={styles.button}>Next</Text>
          </TouchableOpacity>
        </View>

        {/*Spaces*/}
        <View
          style={{
            padding: "3%"
            //borderRadius: 4,
            //borderWidth: 0.5,
            //borderColor: "#d6d7da"
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    fontSize: 36,
    marginBottom: 48
  },
  input: {
    height: 40,
    borderColor: "#000000",
    borderBottomWidth: 1,
    marginBottom: 36
  },
  button: {
    color: "#fff",
    fontSize: 20
  },
  nextButton: {
    alignItems: "center",
    padding: 10,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    width: "55%"
  },
  inputContainerStyle: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderColor: "#fff"
  },
  inputStyle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "100"
  },
  warningText: {
    color: "#fff",
    fontSize: 10,
    paddingTop: "3%",
    fontWeight: "bold"
  }
});

const mapStateToProps = state => {
  return { ...state };
};

const mapDispatchToProps = dispatch => {
  return {
    SetUserDataAction: payload => dispatch(SetUserDataAction(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateAccount);
