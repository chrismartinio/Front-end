import React from "react";
import { View, StyleSheet } from "react-native";

import PhotoPrompt from "./PhotoPrompt.js";

const generatePrompts = props => {
  var list = [];

  for (var i = 0; i < 1; i++) {
    list.push(<PhotoPrompt key={`photoPromptId${i}`} promptKey={i} />);
  }

  return list;
};

const PromptPanel = props => <View>{generatePrompts(props)}</View>;

const styles = StyleSheet.create({
  root: {
    display: "flex"
  }
});

export default PromptPanel;
