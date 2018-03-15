/*!
 * react-native-multi-select
 * Copyright(c) 2017 Mustapha Babatunde Oluwaleke
 * MIT Licensed
 */
import {StyleProp, StyleSheet, TextStyle, ViewStyle} from 'react-native';

export type ColorType = 'primary'
  | 'primaryDark'
  | 'light'
  | 'textPrimary'
  | 'placeholderTextColor'
  | 'danger'
  | 'borderColor'
  | 'backgroundColor';

export type ColorPack = {
  [color in ColorType]: string
  }

export const colorPack: ColorPack = {
  primary: '#00A5FF',
  primaryDark: '#215191',
  light: '#FFF',
  textPrimary: '#525966',
  placeholderTextColor: '#A9A9A9',
  danger: '#C62828',
  borderColor: '#e9e9e9',
  backgroundColor: '#b1b1b1',
};

export type ViewStyleKey = 'footerWrapper'
  | 'footerWrapperNC'
  | 'subSection'
  | 'greyButton'
  | 'selectedItem'
  | 'button'
  | 'selectorView'
  | 'selectorViewFixedHeight'
  | 'inputGroup'
  | 'dropdownView'
  | 'selectedItemsExt'
  | 'selectedItemExt'
  | 'rowTouchableOpacity'
  | 'itemContainer'
  | 'container'
  | 'itemsWrapper'
  | 'closedInputWrapper'
  | 'selectedItems';

export type TextStyleKey = 'selectedItemExtText'
  | 'indicator'
  | 'indicatorOpen'
  | 'buttonText'
  | 'selectedItemExtIcon'
  | 'itemText'
  | 'itemCheckIcon'
  | 'noItemsText'
  | 'searchIcon'
  | 'searchInput';

type ViewStyles = {
  [viewStyleKey in ViewStyleKey]: ViewStyle;
  };

type TextStyles = {
  [textStyleKey in TextStyleKey]: TextStyle;
  };

type ViewStylesProps = {
  [viewStyleKey in ViewStyleKey]: StyleProp<ViewStyle>;
  };

type TextStylesProps = {
  [textStyleKey in TextStyleKey]: StyleProp<TextStyle>;
  };

export interface Styles extends ViewStylesProps, TextStylesProps {
}

const viewStyles: ViewStyles = {
  footerWrapper: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  footerWrapperNC: {
    width: 320,
    flexDirection: 'column',
  },
  subSection: {
    backgroundColor: colorPack.light,
    borderBottomWidth: 1,
    borderColor: colorPack.borderColor,
    paddingHorizontal: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  greyButton: {
    height: 40,
    borderRadius: 5,
    elevation: 0,
    backgroundColor: colorPack.backgroundColor,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingTop: 3,
    paddingRight: 3,
    paddingBottom: 3,
    margin: 3,
    borderRadius: 20,
    borderWidth: 2,
  },
  button: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectorView: {
    flexDirection: 'column',
    marginBottom: 10,
    elevation: 2,
  },
  selectorViewFixedHeight: {
    height: 250,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    backgroundColor: colorPack.light,
  },
  dropdownView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    marginBottom: 10,
  },
  selectedItemsExt: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedItemExt: {
    justifyContent: 'center',
    height: 40,
  },
  rowTouchableOpacity: {
    paddingHorizontal: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  itemsWrapper: {
    flexDirection: 'column',
    backgroundColor: '#fafafa',
  },
  closedInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
};

const textStyles: TextStyles = {
  selectedItemExtText: {
    flex: 1,
    fontSize: 15,
  },
  indicator: {
    fontSize: 30,
    color: colorPack.placeholderTextColor,
  },
  indicatorOpen: {
    paddingHorizontal: 15,
  },
  buttonText: {
    color: colorPack.light,
    fontSize: 14,
  },
  selectedItemExtIcon: {
    fontSize: 22,
    marginLeft: 10,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    paddingTop: 5,
    paddingBottom: 5,
  },
  itemCheckIcon: {
    fontSize: 20,
  },
  noItemsText: {
    flex: 1,
    marginTop: 20,
    textAlign: 'center',
    color: colorPack.danger,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
  },
};

const styles: Styles = StyleSheet.create({
  ...viewStyles,
  ...textStyles
});

export default styles;
