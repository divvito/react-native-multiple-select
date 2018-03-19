import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from "../styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
export default class SelectedItem extends React.PureComponent {
    render() {
        const { item, fontFamily, tagRemoveIconColor, tagBorderColor, uniqueKey, tagTextColor, displayKey, selectedItemStyle, selectedItemExtStyle, selectedItemExtTextStyle, selectedItemExtIconStyle, onRemove, } = this.props;
        const display = item[displayKey];
        const unique = item[uniqueKey];
        return (React.createElement(View, { style: [
                styles.selectedItem,
                styles.selectedItemExt,
                {
                    width: ((display).length * 8) + 60,
                    borderColor: tagBorderColor,
                },
                selectedItemStyle,
                selectedItemExtStyle
            ], key: unique },
            React.createElement(Text, { style: [
                    styles.selectedItemExtText,
                    Object.assign({ color: tagTextColor }, (fontFamily ? { fontFamily } : {})),
                    selectedItemExtTextStyle
                ], numberOfLines: 1 }, display),
            React.createElement(TouchableOpacity, { onPress: () => onRemove(item) },
                React.createElement(Icon, { name: "cancel", style: [
                        styles.selectedItemExtIcon,
                        {
                            color: tagRemoveIconColor,
                        },
                        selectedItemExtIconStyle
                    ] }))));
    }
}
