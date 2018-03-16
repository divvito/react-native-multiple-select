import styles, {colorPack} from "../styles";
import * as React from 'react';
import {StyleProp, Text, TextStyle, TouchableWithoutFeedback, View, ViewStyle} from 'react-native';
import {Icon} from "react-native-vector-icons/Icon";

export interface OwnProps {
  inputFontFamily?: string,
  onPress: () => void,
  labelText: string
}

export interface ParentProps {
  textColor?: string,
  fontSize?: number,
  hideSubmitButton?: boolean,
  closedInputWrapperStyle?: StyleProp<ViewStyle>,
  selectLabelStyle?: StyleProp<TextStyle>,
  indicatorStyle?: StyleProp<TextStyle>,
  subSectionStyle?: StyleProp<ViewStyle>,
  dropdownViewStyle?: StyleProp<ViewStyle>,
}

export type Props = OwnProps & ParentProps;

export default class ClosedInput extends React.PureComponent<Props> {
  render() {
    const {
      onPress,
      closedInputWrapperStyle,
      textColor,
      fontSize,
      inputFontFamily,
      selectLabelStyle,
      indicatorStyle,
      hideSubmitButton,
      labelText,
      subSectionStyle,
      dropdownViewStyle,
    } = this.props;

    return (
      <View style={[styles.dropdownView, dropdownViewStyle]}>
        <View
          style={[
            styles.subSection,
            subSectionStyle
          ]}
        >
          <TouchableWithoutFeedback onPress={onPress}>
            <View style={[styles.closedInputWrapper, closedInputWrapperStyle]}>
              <Text
                style={[
                  styles.searchInput,
                  {
                    fontSize: fontSize || 16,
                    color: textColor || colorPack.placeholderTextColor,
                    ...(inputFontFamily ? {fontFamily: inputFontFamily} : {})
                  },
                  selectLabelStyle
                ]}
                numberOfLines={1}
              >
                {labelText}
              </Text>
              <Icon
                name={
                  hideSubmitButton
                    ? 'menu-right'
                    : 'menu-down'
                }
                style={[styles.indicator, indicatorStyle]}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}
