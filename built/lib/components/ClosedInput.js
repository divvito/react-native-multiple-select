import styles, { colorPack } from "../styles";
import * as React from 'react';
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import { Icon } from "react-native-vector-icons/Icon";
export default class ClosedInput extends React.PureComponent {
    render() {
        const { onPress, closedInputWrapperStyle, textColor, fontSize, inputFontFamily, selectLabelStyle, indicatorStyle, hideSubmitButton, labelText, subSectionStyle, dropdownViewStyle, } = this.props;
        return (React.createElement(View, { style: [styles.dropdownView, dropdownViewStyle] },
            React.createElement(View, { style: [
                    styles.subSection,
                    subSectionStyle
                ] },
                React.createElement(TouchableWithoutFeedback, { onPress: onPress },
                    React.createElement(View, { style: [styles.closedInputWrapper, closedInputWrapperStyle] },
                        React.createElement(Text, { style: [
                                styles.searchInput,
                                Object.assign({ fontSize: fontSize || 16, color: textColor || colorPack.placeholderTextColor }, (inputFontFamily ? { fontFamily: inputFontFamily } : {})),
                                selectLabelStyle
                            ], numberOfLines: 1 }, labelText),
                        React.createElement(Icon, { name: hideSubmitButton
                                ? 'menu-right'
                                : 'menu-down', style: [styles.indicator, indicatorStyle] }))))));
    }
}
