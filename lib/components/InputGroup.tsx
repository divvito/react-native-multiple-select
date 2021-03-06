import * as React from 'react';
import {ReactNode} from 'react';
import {StyleProp, TextInput, TextStyle, View, ViewStyle} from 'react-native';
import styles, {colorPack} from "../styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export interface OwnProps {
  indicatorOpen: ReactNode,
  searchTerm: string,
  onChange: (value: string) => void,
  onAdd: () => void,
}

export interface ParentProps {
  searchInputPlaceholderColor?: string,
  searchInputPlaceholderText?: string,
  searchInputStyle?: StyleProp<TextStyle>,
  inputGroupStyle?: StyleProp<ViewStyle>,
  searchIconStyle?: StyleProp<TextStyle>,
}

export type Props = OwnProps & ParentProps;

export default class InputGroup extends React.PureComponent<Props> {
  render() {
    const {
      searchInputPlaceholderColor,
      indicatorOpen,
      inputGroupStyle,
      searchIconStyle,
      searchInputPlaceholderText,
      searchTerm,
      searchInputStyle,
      onChange,
      onAdd,
    } = this.props;

    return (
      <View style={[styles.inputGroup, inputGroupStyle]}>
        <Icon
          name="magnify"
          size={20}
          color={colorPack.placeholderTextColor}
          style={[styles.searchIcon, searchIconStyle]}
        />
        <TextInput
          autoFocus
          onChangeText={onChange}
          blurOnSubmit={true}
          onSubmitEditing={onAdd}
          placeholder={searchInputPlaceholderText}
          placeholderTextColor={searchInputPlaceholderColor}
          underlineColorAndroid="transparent"
          style={[styles.searchInput, searchInputStyle]}
          value={searchTerm}
          disableFullscreenUI
        />
        {indicatorOpen}
      </View>
    );
  }
}