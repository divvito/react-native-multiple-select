import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from "../styles";
export default class ItemRowNew extends React.PureComponent {
    render() {
        const { item, onAdd, rowTouchableOpacityStyle, itemContainerStyle, itemTextStyle, itemStyle, itemLabel, } = this.props;
        return (React.createElement(TouchableOpacity, { disabled: item.disabled, onPress: onAdd, style: [styles.rowTouchableOpacity, rowTouchableOpacityStyle] },
            React.createElement(View, null,
                React.createElement(View, { style: [styles.itemContainer, itemContainerStyle] },
                    React.createElement(Text, { style: [
                            styles.itemText,
                            itemStyle,
                            itemTextStyle
                        ] }, itemLabel)))));
    }
}
