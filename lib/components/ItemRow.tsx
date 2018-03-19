import * as React from 'react';
import {StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle} from 'react-native';
import styles from "../styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {BaseItem} from "../react-native-multi-select";

export interface OwnProps<I extends BaseItem, D extends keyof I> {
  item: I,
  onPress: (item: I) => void,
  itemStyle: StyleProp<TextStyle>,
  selected: boolean,
}

export interface ParentProps<I extends BaseItem, D extends keyof I> {
  displayKey?: D,
  selectedItemIconColor?: string,
  rowTouchableOpacityStyle?: StyleProp<ViewStyle>,
  itemContainerStyle?: StyleProp<ViewStyle>,
  itemTextStyle?: StyleProp<TextStyle>,
  itemCheckIconStyle?: StyleProp<TextStyle>,
}

export type Props<I extends BaseItem, D extends keyof I> = OwnProps<I, D> & ParentProps<I, D>;

export default class ItemRow<I extends BaseItem, D extends keyof I> extends React.PureComponent<Props<I, D>> {
  render() {
    const {
      item,
      onPress,
      selectedItemIconColor,
      displayKey,
      rowTouchableOpacityStyle,
      itemContainerStyle,
      itemTextStyle,
      itemStyle,
      itemCheckIconStyle,
      selected,
    } = this.props;

    return (
      <TouchableOpacity
        disabled={item.disabled}
        onPress={() => onPress(item)}
        style={[styles.rowTouchableOpacity, rowTouchableOpacityStyle]}
      >
        <View>
          <View style={[styles.itemContainer, itemContainerStyle]}>
            <Text
              style={[
                styles.itemText,
                itemStyle,
                itemTextStyle
              ]}
            >
              {item[displayKey!]}
            </Text>
            {selected ? (
              <Icon
                name="check"
                style={[
                  styles.itemCheckIcon,
                  {color: selectedItemIconColor},
                  itemCheckIconStyle
                ]}
              />
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}