import * as React from 'react';
import {ReactNode} from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  StyleProp,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle
} from 'react-native';
import {find, get, reject} from 'lodash';
import escapeStringRegexp from 'escape-string-regexp';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles, {colorPack} from './styles';

type BaseItem = {
  disabled?: boolean,
  [s: string]: any,
  [n: number]: any
}

type Props<I extends BaseItem, U extends keyof I, D extends keyof I> = {
  selectedItems: (I[U])[],
  uniqueKey: U,
  items: I[],
  single?: boolean,
  tagBorderColor?: string,
  tagTextColor?: string,
  fontFamily?: string,
  tagRemoveIconColor?: string,
  onSelectedItemsChange?: (selectedItems: (I[U])[]) => void,
  selectedItemFontFamily?: string,
  selectedItemTextColor?: string,
  itemFontFamily?: string,
  itemTextColor?: string,
  itemFontSize?: number,
  selectedItemIconColor?: string,
  searchInputPlaceholderText?: string,
  searchInputStyle?: StyleProp<TextStyle>,
  selectLabelStyle?: StyleProp<TextStyle>,
  closedInputWrapperStyle?: StyleProp<ViewStyle>,
  dropdownViewStyle?: StyleProp<ViewStyle>,
  selectedItemsStyle?: StyleProp<ViewStyle>,
  containerStyle?: StyleProp<ViewStyle>,
  indicatorStyle?: StyleProp<TextStyle>,
  indicatorOpenStyle?: StyleProp<TextStyle>,
  subSectionStyle?: StyleProp<ViewStyle>,
  submitButtonStyle?: StyleProp<ViewStyle>,
  submitButtonTextStyle?: StyleProp<TextStyle>,
  selectorViewStyle?: StyleProp<ViewStyle>,
  inputGroupStyle?: StyleProp<ViewStyle>,
  searchIconStyle?: StyleProp<TextStyle>,
  itemWrapperStyle?: StyleProp<ViewStyle>,
  itemContainerStyle?: StyleProp<ViewStyle>,
  noItemsTextStyle?: StyleProp<TextStyle>,
  rowTouchableOpacityStyle?: StyleProp<ViewStyle>,
  itemTextStyle?: StyleProp<TextStyle>,
  itemCheckIconStyle?: StyleProp<TextStyle>,
  selectedItemStyle?: StyleProp<ViewStyle>,
  selectedItemsExtStyle?: StyleProp<ViewStyle>,
  selectedItemExtStyle?: StyleProp<ViewStyle>,
  selectedItemExtTextStyle?: StyleProp<TextStyle>,
  selectedItemExtIconStyle?: StyleProp<TextStyle>,
  disabledItemColor?: string,
  selectText?: string,
  altFontFamily?: string,
  hideSubmitButton?: boolean,
  submitButtonColor?: string,
  submitButtonText?: string,
  textColor?: string,
  fontSize?: number,
  fixedHeight?: boolean,
  hideTags?: boolean,
  canAddItems?: boolean,
  onAddItem?: (items: I[]) => void,
  onChangeInput?: (value: string) => void,
  displayKey?: D,
  getSelectLabel?: (params: { selectText?: string, single?: boolean, selectedItems?: (I[U])[], displayKey?: D }) => string
}

type DefaultItem = {
  name: string,
  _id: string
}

type State = {
  selector: boolean,
  searchTerm: string
}

export default class MultiSelect<I extends BaseItem, U extends keyof I, D extends keyof I> extends React.PureComponent<Props<I, U, D>, State> {
  static defaultProps: Partial<Props<DefaultItem, '_id', 'name'>> = {
    single: false,
    selectedItems: [],
    items: [],
    uniqueKey: '_id',
    tagBorderColor: colorPack.primary,
    tagTextColor: colorPack.primary,
    fontFamily: '',
    tagRemoveIconColor: colorPack.danger,
    onSelectedItemsChange: () => {
    },
    selectedItemFontFamily: '',
    selectedItemTextColor: colorPack.primary,
    itemFontFamily: '',
    itemTextColor: colorPack.textPrimary,
    itemFontSize: 16,
    selectedItemIconColor: colorPack.primary,
    searchInputPlaceholderText: 'Search',
    searchInputStyle: {color: colorPack.textPrimary},
    textColor: colorPack.textPrimary,
    selectText: 'Select',
    altFontFamily: '',
    hideSubmitButton: false,
    submitButtonColor: '#CCC',
    submitButtonText: 'Submit',
    fontSize: 14,
    fixedHeight: false,
    hideTags: false,
    onChangeInput: () => {
    },
    displayKey: 'name',
    canAddItems: false,
    onAddItem: () => {
    },
    disabledItemColor: 'grey'
  };
  static SEARCH_SPLIT_REGEXP: RegExp = /[ \-:]+/;

  constructor(props: Props<I, U, D>) {
    super(props);
    this.state = {
      selector: false,
      searchTerm: '',
    };
  }

  getSelectedItemsExt = (optionalSelectedItems?: (I[U])[]): ReactNode => {
    const {selectedItemsExtStyle} = this.props;
    return (
      <View style={[styles.selectedItemsExt, selectedItemsExtStyle]}>
        {this._displaySelectedItems(optionalSelectedItems)}
      </View>
    );
  };

  _onChangeInput = (value: string) => {
    const {onChangeInput} = this.props;

    if (onChangeInput) {
      onChangeInput(value);
    }

    this.setState({searchTerm: value});
  };

  _getSelectLabel = (): string => {
    const {
      selectText,
      single,
      selectedItems,
      displayKey,
      getSelectLabel
    } = this.props;

    if (getSelectLabel) {
      return getSelectLabel({selectText, single, selectedItems, displayKey});
    } else if (!selectedItems || selectedItems.length === 0) {
      return selectText!;
    } else if (single) {
      const item: I[U] = selectedItems[0];
      const foundItem: I | undefined = this._findItem(item);
      return get(foundItem, displayKey!) || selectText;
    }

    return `${selectText} (${selectedItems.length} selected)`;
  };

  _findItem = (itemKey: I[U]): I | undefined => {
    const {items, uniqueKey} = this.props;

    return find(items, (singleItem: I) => singleItem[uniqueKey] === itemKey);
  };

  _displaySelectedItems = (optionalSelectedItems?: (I[U])[]): ReactNode => {
    const {
      fontFamily,
      tagRemoveIconColor,
      tagBorderColor,
      uniqueKey,
      tagTextColor,
      selectedItems,
      displayKey,
      selectedItemStyle,
      selectedItemExtStyle,
      selectedItemExtTextStyle,
      selectedItemExtIconStyle,
    } = this.props;

    const actualSelectedItems: (I[U])[] = optionalSelectedItems || selectedItems;

    return actualSelectedItems.map((singleSelectedItem: I[U]) => {
      const item: I | undefined = this._findItem(singleSelectedItem);
      if (!item) {
        return null;
      }
      if (!item[displayKey!]) {
        return null;
      }

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
            onPress={() => {
              this._removeItem(item);
            }}
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
    });
  };

  _removeItem = (item: I): void => {
    const {uniqueKey, selectedItems, onSelectedItemsChange} = this.props;

    if (onSelectedItemsChange) {
      const newItems: (I[U])[] = reject(
        selectedItems,
        (singleItem: I[U]) => item[uniqueKey] === singleItem,
      );
      // broadcast new selected items state to parent component
      onSelectedItemsChange(newItems);
    }
  };

  _removeAllItems = (): void => {
    const {onSelectedItemsChange} = this.props;

    if (onSelectedItemsChange) {
      // broadcast new selected items state to parent component
      onSelectedItemsChange([]);
    }
  };

  _toggleSelector = (): void => {
    this.setState({
      selector: !this.state.selector,
    });
  };

  _clearSearchTerm = (): void => {
    this.setState({
      searchTerm: '',
    });
  };

  _submitSelection = (): void => {
    this._toggleSelector();
    // reset searchTerm
    this._clearSearchTerm();
  };

  _itemSelected = (item: I): boolean => {
    const {uniqueKey, selectedItems} = this.props;

    return selectedItems.indexOf(item[uniqueKey]) !== -1;
  };

  _addItem = (): void => {
    const {
      uniqueKey,
      displayKey,
      items,
      selectedItems,
      onSelectedItemsChange,
      onAddItem,
    } = this.props;
    const {searchTerm} = this.state;

    if (searchTerm) {
      const newItemId: string = searchTerm
        .split(' ')
        .filter(word => word.length)
        .join('-');
      const newItem: I = {
        [uniqueKey]: newItemId,
        [displayKey!]: searchTerm
      } as any as I;

      if (onAddItem) {
        onAddItem([...items, newItem]);
      }
      if (onSelectedItemsChange) {
        onSelectedItemsChange([...selectedItems, newItem[uniqueKey]]);
      }

      this._clearSearchTerm();
    }
  };

  _toggleItem = (item: I): void => {
    const {
      single,
      uniqueKey,
      selectedItems,
      onSelectedItemsChange,
    } = this.props;

    if (single) {
      this._submitSelection();
      if (onSelectedItemsChange) {
        onSelectedItemsChange([item[uniqueKey]]);
      }
    } else {
      const status: boolean = this._itemSelected(item);
      let newItems: (I[U])[] = [];
      if (status) {
        newItems = reject(
          selectedItems,
          (singleItem: I[U]) => item[uniqueKey] === singleItem,
        );
      } else {
        newItems = [...selectedItems, item[uniqueKey]];
      }

      // broadcast new selected items state to parent component
      if (onSelectedItemsChange) {
        onSelectedItemsChange(newItems);
      }
    }
  };

  _itemStyle = (item: I): StyleProp<TextStyle> => {
    const {
      selectedItemFontFamily,
      selectedItemTextColor,
      itemFontFamily,
      itemTextColor,
      itemFontSize,
      disabledItemColor
    } = this.props;
    const isSelected: boolean = this._itemSelected(item);
    const style: StyleProp<TextStyle> = {fontSize: itemFontSize};

    if (isSelected && selectedItemFontFamily) {
      style.fontFamily = selectedItemFontFamily;
    } else if (!isSelected && itemFontFamily) {
      style.fontFamily = itemFontFamily;
    }

    if (isSelected) {
      style.color = selectedItemTextColor;
    } else if (item.disabled) {
      style.color = disabledItemColor!;
    } else {
      style.color = itemTextColor;
    }

    return style;
  };

  _getRow = (item: I): React.ReactElement<TouchableOpacity> => {
    const {
      selectedItemIconColor,
      displayKey,
      rowTouchableOpacityStyle,
      itemContainerStyle,
      itemTextStyle,
      itemCheckIconStyle
    } = this.props;

    return (
      <TouchableOpacity
        disabled={item.disabled}
        onPress={() => this._toggleItem(item)}
        style={[styles.rowTouchableOpacity, rowTouchableOpacityStyle]}
      >
        <View>
          <View style={[styles.itemContainer, itemContainerStyle]}>
            <Text
              style={[
                styles.itemText,
                this._itemStyle(item),
                itemTextStyle
              ]}
            >
              {item[displayKey!]}
            </Text>
            {this._itemSelected(item) ? (
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
  };

  _getRowNew = (item: I) => {
    const {displayKey, rowTouchableOpacityStyle, itemContainerStyle, itemTextStyle} = this.props;

    return (
      <TouchableOpacity
        disabled={item.disabled}
        onPress={this._addItem}
        style={[styles.rowTouchableOpacity, rowTouchableOpacityStyle]}
      >
        <View>
          <View style={[styles.itemContainer, itemContainerStyle]}>
            <Text
              style={[
                styles.itemText,
                this._itemStyle(item),
                itemTextStyle
              ]}
            >
              Add {item[displayKey!]} (tap or press return)
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  };

  _filterItems = (searchTerm: string): I[] => {
    const {items, displayKey} = this.props;
    const parts: string[] = searchTerm.trim().split(MultiSelect.SEARCH_SPLIT_REGEXP).map(escapeStringRegexp);
    const regex: RegExp = new RegExp(parts.join('|'), 'i');

    return items.filter((item: I) => regex.test(get(item, displayKey!)));
  };

  _renderItems = (): ReactNode => {
    const {
      canAddItems,
      items,
      fontFamily,
      uniqueKey,
      selectedItems,
      displayKey,
      itemContainerStyle,
      noItemsTextStyle
    } = this.props;
    const {searchTerm} = this.state;
    // If searchTerm matches an item in the list, we should not add a new
    // element to the list.
    let searchTermMatch: boolean = false;
    let itemList: ReactNode = null;
    let addItemRow: ReactNode = null;
    const renderItems: I[] = searchTerm ? this._filterItems(searchTerm) : items;

    if (renderItems.length) {
      itemList = (
        <FlatList
          data={renderItems}
          extraData={selectedItems}
          keyExtractor={(item: I) => item[uniqueKey!]}
          renderItem={(rowData: ListRenderItemInfo<I>) => this._getRow(rowData.item)}
        />
      );

      searchTermMatch = renderItems.some(item => item.name === searchTerm);
    } else if (!canAddItems) {
      itemList = (
        <View style={[styles.itemContainer, itemContainerStyle]}>
          <Text
            style={[
              styles.noItemsText,
              fontFamily ? {fontFamily} : {},
              noItemsTextStyle
            ]}
          >
            No item to display.
          </Text>
        </View>
      );
    }

    if (canAddItems && !searchTermMatch && searchTerm.length) {
      addItemRow = this._getRowNew({[displayKey!]: searchTerm} as any as I);
    }

    return (
      <View>
        {itemList}
        {addItemRow}
      </View>
    );
  };

  _selectorViewStyle(): StyleProp<ViewStyle> {
    const {fixedHeight, selectorViewStyle} = this.props;
    const style: StyleProp<ViewStyle> = [styles.selectorView];

    if (fixedHeight) {
      style.push(styles.selectorViewFixedHeight);
    }

    if (selectorViewStyle) {
      style.push(selectorViewStyle);
    }

    return style;
  }

  _renderOpen(): ReactNode {
    const {
      single,
      searchInputPlaceholderText,
      searchInputStyle,
      hideSubmitButton,
      inputGroupStyle,
      searchIconStyle,
      itemWrapperStyle
    } = this.props;
    const {searchTerm} = this.state;

    return (
      <View style={this._selectorViewStyle()}>
        <View style={[styles.inputGroup, inputGroupStyle]}>
          <Icon
            name="magnify"
            size={20}
            color={colorPack.placeholderTextColor}
            style={[styles.searchIcon, searchIconStyle]}
          />
          <TextInput
            autoFocus
            onChangeText={this._onChangeInput}
            blurOnSubmit={false}
            onSubmitEditing={this._addItem}
            placeholder={searchInputPlaceholderText}
            placeholderTextColor={colorPack.placeholderTextColor}
            underlineColorAndroid="transparent"
            style={[styles.searchInput, searchInputStyle]}
            value={searchTerm}
          />
          {hideSubmitButton && this._renderIndicatorOpen()}
        </View>
        <View style={[styles.itemsWrapper, itemWrapperStyle]}>
          <View>{this._renderItems()}</View>
          {!(single || hideSubmitButton) && this._renderSubmitButton()}
        </View>
      </View>
    );
  }

  _renderIndicatorOpen(): ReactNode {
    const {indicatorStyle, indicatorOpenStyle} = this.props;
    return (
      <TouchableOpacity onPress={this._submitSelection}>
        <Icon
          name="menu-down"
          style={[
            styles.indicator,
            styles.indicatorOpen,
            indicatorStyle,
            indicatorOpenStyle,
          ]}
        />
      </TouchableOpacity>
    );
  }

  _renderSubmitButton(): ReactNode {
    const {
      fontFamily,
      submitButtonColor,
      submitButtonText,
      submitButtonStyle,
      submitButtonTextStyle
    } = this.props;

    return (
      <TouchableOpacity
        onPress={() => this._submitSelection()}
        style={[
          styles.button,
          {backgroundColor: submitButtonColor},
          submitButtonStyle
        ]}
      >
        <Text
          style={[
            styles.buttonText,
            fontFamily ? {fontFamily} : {},
            submitButtonTextStyle
          ]}
        >
          {submitButtonText}
        </Text>
      </TouchableOpacity>
    );
  }

  _renderClosed(): ReactNode {
    const {
      selectedItems,
      single,
      fontFamily,
      altFontFamily,
      hideSubmitButton,
      fontSize,
      textColor,
      hideTags,
      selectLabelStyle,
      closedInputWrapperStyle,
      dropdownViewStyle,
      indicatorStyle,
      subSectionStyle
    } = this.props;

    const inputFontFamily: string | undefined = altFontFamily || fontFamily;

    return (
      <View>
        <View style={[styles.dropdownView, dropdownViewStyle]}>
          <View
            style={[
              styles.subSection,
              subSectionStyle
            ]}
          >
            <TouchableWithoutFeedback onPress={this._toggleSelector}>
              <View style={[styles.closedInputWrapper, closedInputWrapperStyle]}>
                <Text
                  style={[
                    styles.searchInput,
                    {
                      fontSize: fontSize || 16,
                      color: textColor || colorPack.placeholderTextColor,
                      ...(inputFontFamily ? {fontFamily: inputFontFamily} : {})
                    },
                    selectLabelStyle
                  ]}
                  numberOfLines={1}
                >
                  {this._getSelectLabel()}
                </Text>
                <Icon
                  name={
                    hideSubmitButton
                      ? 'menu-right'
                      : 'menu-down'
                  }
                  style={[styles.indicator, indicatorStyle]}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
        {!(single || hideTags) && selectedItems.length ? this._renderSelectedItems() : null}
      </View>
    );
  }

  _renderSelectedItems(): ReactNode {
    const {selectedItemsStyle} = this.props;
    return (
      <View
        style={[styles.selectedItems, selectedItemsStyle]}
      >
        {this._displaySelectedItems()}
      </View>
    );
  }

  render() {
    const {containerStyle} = this.props;
    const {selector} = this.state;

    return (
      <View style={[styles.container, containerStyle]}>
        {selector ? this._renderOpen() : this._renderClosed()}
      </View>
    );
  }
}
