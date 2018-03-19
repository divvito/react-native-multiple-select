import * as React from 'react';
import { TextInput, View } from 'react-native';
import styles, { colorPack } from "../styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
export default class InputGroup extends React.PureComponent {
    render() {
        const { searchInputPlaceholderColor, indicatorOpen, inputGroupStyle, searchIconStyle, searchInputPlaceholderText, searchTerm, searchInputStyle, onChange, onAdd, } = this.props;
        return (React.createElement(View, { style: [styles.inputGroup, inputGroupStyle] },
            React.createElement(Icon, { name: "magnify", size: 20, color: colorPack.placeholderTextColor, style: [styles.searchIcon, searchIconStyle] }),
            React.createElement(TextInput, { autoFocus: true, onChangeText: onChange, blurOnSubmit: false, onSubmitEditing: onAdd, placeholder: searchInputPlaceholderText, placeholderTextColor: searchInputPlaceholderColor, underlineColorAndroid: "transparent", style: [styles.searchInput, searchInputStyle], value: searchTerm }),
            indicatorOpen));
    }
}
