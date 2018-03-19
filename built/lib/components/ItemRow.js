import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from "../styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
export default class ItemRow extends React.PureComponent {
    render() {
        const { item, onPress, selectedItemIconColor, displayKey, rowTouchableOpacityStyle, itemContainerStyle, itemTextStyle, itemStyle, itemCheckIconStyle, selected, } = this.props;
        return (React.createElement(TouchableOpacity, { disabled: item.disabled, onPress: () => onPress(item), style: [styles.rowTouchableOpacity, rowTouchableOpacityStyle] },
            React.createElement(View, null,
                React.createElement(View, { style: [styles.itemContainer, itemContainerStyle] },
                    React.createElement(Text, { style: [
                            styles.itemText,
                            itemStyle,
                            itemTextStyle
                        ] }, item[displayKey]),
                    selected ? (React.createElement(Icon, { name: "check", style: [
                            styles.itemCheckIcon,
                            { color: selectedItemIconColor },
                            itemCheckIconStyle
                        ] })) : null))));
    }
}
