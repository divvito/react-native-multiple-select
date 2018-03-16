import * as React from 'react';
import {StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle} from 'react-native';
import styles from "../styles";
import {BaseItem} from "../react-native-multi-select";

export interface OwnProps<I extends BaseItem> {
  item: I,
  onAdd: () => void,
  itemStyle: StyleProp<TextStyle>,
  itemLabel: string,
}

export interface ParentProps<I extends BaseItem> {
  rowTouchableOpacityStyle?: StyleProp<ViewStyle>,
  itemContainerStyle?: StyleProp<ViewStyle>,
  itemTextStyle?: StyleProp<TextStyle>,
}

export type Props<I extends BaseItem> = OwnProps<I> & ParentProps<I>;

export default class ItemRowNew<I extends BaseItem> extends React.PureComponent<Props<I>> {
  render() {
    const {
      item,
      onAdd,
      rowTouchableOpacityStyle,
      itemContainerStyle,
      itemTextStyle,
      itemStyle,
      itemLabel,
    } = this.props;

    return (
      <TouchableOpacity
        disabled={item.disabled}
        onPress={onAdd}
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
              {itemLabel}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}