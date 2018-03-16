import * as React from 'react';
import {StyleProp, Text, TextStyle, View, ViewStyle} from 'react-native';
import styles from "../styles";

export interface Props {
  itemContainerStyle?: StyleProp<ViewStyle>,
  noItemsTextStyle?: StyleProp<TextStyle>,
  fontFamily?: string,
  noItemsText: string
}

export default class NoItems extends React.PureComponent<Props> {
  render() {
    const {itemContainerStyle, noItemsTextStyle, noItemsText, fontFamily} = this.props;

    return (
      <View style={[styles.itemContainer, itemContainerStyle]}>
        <Text
          style={[
            styles.noItemsText,
            fontFamily ? {fontFamily} : {},
            noItemsTextStyle
          ]}
        >
          {noItemsText}
        </Text>
      </View>
    );
  }
}