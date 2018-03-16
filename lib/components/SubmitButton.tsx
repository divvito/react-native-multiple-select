import * as React from 'react';
import {StyleProp, Text, TextStyle, TouchableOpacity, ViewStyle} from 'react-native';
import styles from "../styles";

export interface OwnProps {
  onPress: () => void,
}

export interface ParentProps {
  fontFamily?: string,
  submitButtonStyle?: StyleProp<ViewStyle>,
  submitButtonTextStyle?: StyleProp<TextStyle>,
  submitButtonColor?: string,
  submitButtonText?: string,
}

export type Props = OwnProps & ParentProps;

export default class SubmitButton extends React.PureComponent<Props> {
  render() {
    const {
      fontFamily,
      submitButtonColor,
      submitButtonText,
      submitButtonStyle,
      submitButtonTextStyle,
      onPress
    } = this.props;

    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.button,
          {backgroundColor: submitButtonColor},
          submitButtonStyle
        ]}
      >
        <Text
          style={[
            styles.buttonText,
            fontFamily ? {fontFamily} : {},
            submitButtonTextStyle
          ]}
        >
          {submitButtonText}
        </Text>
      </TouchableOpacity>
    );
  }
}