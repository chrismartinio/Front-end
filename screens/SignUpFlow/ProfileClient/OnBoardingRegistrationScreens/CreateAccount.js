import React, { Component } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";

//redux
import { connect } from "react-redux";
import SetCreateAccountDataAction from "../../../../storage/actions/RegistrationActions/SetCreateAccountDataAction";
import SetGUIDAction from "../../../../storage/actions/RegistrationActions/SetGUIDAction";

//icons
import { Icon, Input } from "react-native-elements";
import { Chevron } from "react-native-shapes";

//Collapsible Components
import FailScreen from "../Components/FailScreen";

//checker functions
import {
  emailCheck,
  nullCheck,
  passwordLength,
  passwordCase,
  passwordNonLetter,
  passwordCheck
} from "../Util/OnBoardingRegistrationScreenCheckers.js";

//warnings
import {
  emptyEmailWarning,
  emptyPasswordWarning,
  invalidEmailWarning,
  invalidConfirmEmailWarning,
  invalidPasswordWarning,
  invalidConfirmPasswordWarning,
  duplicateEmailWarning,
  internalErrorWarning
} from "../Util/OnBoardingRegistrationScreenWarnings.js";

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
      editable: true,
      internalErrorWarning: false,
      isSuccess: true,
      isDelaying: false
    };
    this.isContinueUserFetched = false;
  }

  getData = async () => {
    await fetch("http://74.80.250.210:4000/api/profile/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        guid: this.props.CreateProfileDataReducer.guid,
        collection: "createAccount"
      })
    })
      .then(res => res.json())
      .then(res => {
        let object = JSON.parse(JSON.stringify(res));
        if (object.success) {
          this.setState({
            email: object.result.email,
            confirmEmail: object.result.email,
            password: "Password",
            confirmPassword: "Password",
            emailWarning: "",
            confirmEmailWarning: "",
            passwordWarning: "",
            confirmPasswordWarning: "",
            password_UpperLowerCaseWarning: false,
            password_NumberSymbolWarning: false,
            password_LengthWarning: false,
            isSuccess: true,
            editable: false,
            passed: true
          });

          //send to redux
          this.props.SetCreateAccountDataAction({
            email: object.result.email,
            password: "Password"
          });
        } else {
          throw new Error("internal Error");
        }
      })
      .catch(err => {
        //If error while fetching, direct user to failScreen
        this.setState({
          isSuccess: false
        });
      });
  };

  async componentDidMount() {
    //For createAccount only, not allow continue user to edit the createAccount
    if (this.props.CreateProfileDataReducer.isContinueUser) {
      this.setState({
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
      //For new user only, if something is modified, remove the check icon
      if (!this.props.CreateProfileDataReducer.isContinueUser) {
        this.props.handlePassed("createAccount", 2);
      }
      //reset internalErrorWarning
    }
    if (
      this.props.createAccountToggle &&
      this.props.CreateProfileDataReducer.isContinueUser
    ) {
      if (!this.isContinueUserFetched) {
        this.getData();
        this.isContinueUserFetched = true;
      }
    }
  }

  //check email
  emailChecker = () => {
    //Clear confirmEmail Input if any changes made to email input
    this.confirmEmailInput.clear();
    this.setState({
      confirmEmailWarning: "empty"
    });

    if (!nullCheck(this.state.email)) {
      this.setState({
        emailWarning: "empty"
      });
    } else if (!emailCheck(this.state.email)) {
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
    if (!nullCheck(this.state.confirmEmail)) {
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
    if (!nullCheck(this.state.password)) {
      this.setState({
        passwordWarning: "empty",
        password_UpperLowerCaseWarning: true,
        password_NumberSymbolWarning: true,
        password_LengthWarning: true
      });
    } else if (!passwordCheck(this.state.password)) {
      let pLength = !passwordLength(this.state.password);
      let pLetterCase = !passwordCase(this.state.password);
      let pNonLetter = !passwordNonLetter(this.state.password);
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
    if (!nullCheck(this.state.confirmPassword)) {
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
    //editable is set to true by default
    if (this.state.editable === false) {
      return this.props.handleToggle("createAccount", null);
    }

    //The only way of make this.state.passed to true; make the next button clickable
    //is to input all the fields,
    if (this.state.passed) {
      //When user submit email/password
      //set editable to true so the user cannot resubmit other email
      //We do not want the user to submit other one (generate a new guid) on the same registration
      //the editable will lock the input to prevent changing email or password
      this.setState(
        {
          editable: false,
          isDelaying: true
        },
        () => {
          //insert a profile into database
          fetch("http://74.80.250.210:4000/api/profile/insert", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              collection: "createAccount",
              data: { email: this.state.email, password: this.state.password }
            })
          })
            .then(res => res.json())
            .then(res => {
              let object = JSON.parse(JSON.stringify(res));
              //console.log(object);
              if (object.success) {
                //pass data into Redux
                this.props.SetCreateAccountDataAction({
                  email: this.state.email,
                  password: this.state.password
                });
                this.props.SetGUIDAction({
                  guid: object.guid
                });
                //if successed to passed,
                this.setState(
                  {
                    internalErrorWarning: false,
                    isDelaying: false
                  },
                  () => {
                    //it will put a check mark for createAccount screen
                    this.props.handlePassed("createAccount", 1);
                  }
                );
              } else if (object.success === false && object.status === 409) {
                //duplicate email,
                this.setState(
                  {
                    emailWarning: "duplicate",
                    editable: true,
                    internalErrorWarning: false,
                    isDelaying: false
                  },
                  () => {
                    //put a error marker for createAccount
                    this.props.handlePassed("createAccount", 3);
                  }
                );
              } else {
                //internal error
                throw new Error("Internal Error ");
              }
            })
            .catch(error => {
              //handle error
              this.setState(
                {
                  editable: true,
                  internalErrorWarning: true,
                  isDelaying: false
                },
                () => {
                  //put a error marker for createAccount
                  this.props.handlePassed("createAccount", 3);
                }
              );
            });
        }
      );
    }
  };

  successScreen = () => {
    return (
      <View style={{ flex: 1 }}>
        {this.state.internalErrorWarning && internalErrorWarning}
        {/*Spaces*/}
        <View style={styles.space} />

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
            autoCompleteType={"off"}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={email =>
              this.setState({ email }, () => {
                this.emailChecker();
              })
            }
          />
          {this.state.emailWarning === "empty" && emptyEmailWarning}
          {this.state.emailWarning === "invalid" && invalidEmailWarning}
          {this.state.emailWarning === "duplicate" && duplicateEmailWarning}
        </View>
        {/*Spaces*/}
        <View style={styles.space} />

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
            autoCompleteType={"off"}
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
          {this.state.confirmEmailWarning === "empty" && emptyEmailWarning}
          {this.state.confirmEmailWarning === "notmatch" &&
            invalidConfirmEmailWarning}
        </View>
        {/*Spaces*/}
        <View style={styles.space} />

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
            autoCompleteType={"off"}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            onChangeText={password =>
              this.setState({ password }, () => {
                this.passwordChecker();
              })
            }
          />
          {this.state.passwordWarning === "empty" && emptyPasswordWarning}
          {this.state.passwordWarning === "invalid" && invalidPasswordWarning}
        </View>
        {/*Spaces*/}
        <View style={styles.space} />

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
            autoCompleteType={"off"}
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
          {this.state.confirmPasswordWarning === "empty" &&
            emptyPasswordWarning}
          {this.state.confirmPasswordWarning === "notmatch" &&
            invalidConfirmPasswordWarning}
        </View>
        {/*Spaces*/}
        <View style={styles.space} />

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
        <View style={styles.space} />

        {/*Next Button*/}
        <View
          alignItems="center"
          style={{ opacity: this.state.passed ? 1.0 : 0.5 }}
        >
          {/*  createAccount will check if all data filled correctly
            if not filled corectly, passed = false, and !passed = true, that mean disable={true}
            if filled correctly , passed = true, and !passed = false, that mean disable={false} */}
          <TouchableOpacity
            style={styles.nextButton}
            onPress={this.handleSubmit}
            disabled={
              (this.state.passed && this.state.isDelaying) || !this.state.passed
            }
          >
            {this.state.passed && this.state.isDelaying ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.button}>Next</Text>
            )}
          </TouchableOpacity>
        </View>

        {/*Spaces*/}
        <View style={styles.space} />
      </View>
    );
  };

  failScreen = () => {
    //For isContinueUser Only
    //If fail on fetching, then display a screen to tell them try again
    return <FailScreen getDataFunction={this.getData} />;
  };

  render() {
    return this.state.isSuccess ? this.successScreen() : this.failScreen();
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
    fontSize: 15
  },
  space: {
    padding: "3%"
  }
});

const mapStateToProps = state => {
  return { ...state };
};

const mapDispatchToProps = dispatch => {
  return {
    SetCreateAccountDataAction: payload =>
      dispatch(SetCreateAccountDataAction(payload)),
    SetGUIDAction: payload => dispatch(SetGUIDAction(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateAccount);
