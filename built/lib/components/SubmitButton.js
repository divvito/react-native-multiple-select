import * as React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styles from "../styles";
export default class SubmitButton extends React.PureComponent {
    render() {
        const { fontFamily, submitButtonColor, submitButtonText, submitButtonStyle, submitButtonTextStyle, onPress } = this.props;
        return (React.createElement(TouchableOpacity, { onPress: onPress, style: [
                styles.button,
                { backgroundColor: submitButtonColor },
                submitButtonStyle
            ] },
            React.createElement(Text, { style: [
                    styles.buttonText,
                    fontFamily ? { fontFamily } : {},
                    submitButtonTextStyle
                ] }, submitButtonText)));
    }
}
