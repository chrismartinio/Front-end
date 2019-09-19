import React, { Component } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  ScrollView,
  TouchableOpacity
} from "react-native";

//redux
import { connect } from "react-redux";
import SetCreateAccountDataAction from "../../../../storage/actions/RegistrationActions/SetCreateAccountDataAction";
import SetGUIAction from "../../../../storage/actions/RegistrationActions/SetGUIAction";

//icons
import { Icon, Input } from "react-native-elements";
import { Chevron } from "react-native-shapes";

//Collapsible Components
import LoadingScreen from "../Components/LoadingScreen";

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
      isLoading: true
    };
    this.isContinueUserFetched = false;
  }

  getData = async () => {
    await fetch("http://74.80.250.210:5000/api/profile/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        gui: this.props.CreateProfileDataReducer.gui,
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
            isLoading: true,
            editable: false,
            passed: true
          });
        } else {
          throw new Error("internal Error");
        }
      })
      .catch(err => {
        //throw to is loading screen or ask user to click a button for refetch
        //to fetch the data
        this.setState({
          isLoading: false
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

    //not sure sometimes would take a long time for fetching without the following,
    //keep the following for in case
    //this.setState({
    //  isLoading: true
    //});
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
    //editable is set to true by default
    if (this.state.editable === false) {
      return this.props.handleToggle("createAccount", null);
    }

    //The only way of make this.state.passed to true; make the next button clickable
    //is to input all the fields,
    if (this.state.passed) {
      //When user submit email/password
      //set editable to true so the user cannot resubmit other email
      //We do not want the user to submit other one (generate a new gui) on the same registration
      //the editable will lock the input to prevent changing email or password
      this.setState({
        editable: false
      });

      //insert a profile into database
      fetch("http://74.80.250.210:5000/api/profile/insert", {
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
            this.props.SetGUIAction({
              gui: object.gui
            });
            this.setState(
              {
                internalErrorWarning: false
              },
              () => {
                //if successed to passed, it will put the check mark from CollapsibleComponent CheckMark
                this.props.handlePassed("createAccount", 1);
              }
            );
          } else if (object.success === false && object.status === 409) {
            //duplicate email
            this.setState(
              {
                emailWarning: "duplicate",
                editable: true,
                internalErrorWarning: false
              },
              //make another fetch to call deleteOne api which one delete that error gui on db
              () => {
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
              internalErrorWarning: true
            },
            () => {
              this.props.handlePassed("createAccount", 3);
            }
          );
        });
    }
  };

  successScreen = () => {
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

    let internalErrorWarning = (
      <Text style={styles.warningText}>* Internal Error. Please Try again</Text>
    );
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
            disabled={!this.state.passed}
          >
            <Text style={styles.button}>Next</Text>
          </TouchableOpacity>
        </View>

        {/*Spaces*/}
        <View style={styles.space} />
      </View>
    );
  };

  loadingScreen = () => {
    //display fetching data
    return <LoadingScreen />;
  };

  render() {
    return this.state.isLoading ? this.successScreen() : this.loadingScreen();
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
    SetGUIAction: payload => dispatch(SetGUIAction(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateAccount);
