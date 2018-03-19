import * as React from 'react';
import {StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle} from 'react-native';
import styles from "../styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {BaseItem} from "../react-native-multi-select";

export interface OwnProps<I extends BaseItem, U extends keyof I, D extends keyof I> {
  onRemove: (item: I) => void,
  item: I,
}

export interface ParentProps<I extends BaseItem, U extends keyof I, D extends keyof I> {
  uniqueKey: U,
  displayKey?: D,
  fontFamily?: string,
  tagRemoveIconColor?: string,
  tagBorderColor?: string,
  tagTextColor?: string,
  selectedItemStyle?: StyleProp<ViewStyle>,
  selectedItemExtStyle?: StyleProp<ViewStyle>,
  selectedItemExtTextStyle?: StyleProp<TextStyle>,
  selectedItemExtIconStyle?: StyleProp<TextStyle>,
}

export type Props<I extends BaseItem, U extends keyof I, D extends keyof I> = OwnProps<I, U, D> & ParentProps<I, U, D>;

export default class SelectedItem<I extends BaseItem, U extends keyof I, D extends keyof I> extends React.PureComponent<Props<I, U, D>> {
  render() {
    const {
      item,
      fontFamily,
      tagRemoveIconColor,
      tagBorderColor,
      uniqueKey,
      tagTextColor,
      displayKey,
      selectedItemStyle,
      selectedItemExtStyle,
      selectedItemExtTextStyle,
      selectedItemExtIconStyle,
      onRemove,
    } = this.props;

    const display: string = item[displayKey!];
    const unique: string | number = item[uniqueKey];

    return (
      <View
        style={[
          styles.selectedItem,
          styles.selectedItemExt,
          {
            width: ((display).length * 8) + 60,
            borderColor: tagBorderColor,
          },
          selectedItemStyle,
          selectedItemExtStyle
        ]}
        key={unique}
      >
        <Text
          style={[
            styles.selectedItemExtText,
            {
              color: tagTextColor,
              ...(fontFamily ? {fontFamily} : {})
            },
            selectedItemExtTextStyle
          ]}
          numberOfLines={1}
        >
          {display}
        </Text>
        <TouchableOpacity
          onPress={() => onRemove(item)}
        >
          <Icon
            name="cancel"
            style={[
              styles.selectedItemExtIcon,
              {
                color: tagRemoveIconColor,
              },
              selectedItemExtIconStyle
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  }
}