import * as React from 'react';
import {FlatList, Keyboard, ListRenderItemInfo, StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {find, get, reject} from 'lodash';
import escapeStringRegexp from 'escape-string-regexp';
import styles, {colorPack} from './styles';
import SelectedItems, {Props as SelectedItemsProps} from './components/SelectedItems'
import NoItems, {Props as NoItemsProps} from './components/NoItems'
import ClosedInput, {ParentProps as ClosedInputParentProps, Props as ClosedInputProps} from './components/ClosedInput';
import SubmitButton, {
  ParentProps as SubmitButtonParentProps,
  Props as SubmitButtonProps
} from './components/SubmitButton';
import IndicatorOpen, {
  ParentProps as IndicatorOpenParentProps,
  Props as IndicatorOpenProps
} from './components/IndicatorOpen';
import ItemsWrapper, {
  ParentProps as ItemsWrapperParentProps,
  Props as ItemsWrapperProps
} from './components/ItemsWrapper';
import InputGroup, {ParentProps as InputGroupParentProps, Props as InputGroupProps} from './components/InputGroup';
import ItemRow, {ParentProps as ItemRowParentProps, Props as ItemRowProps} from './components/ItemRow';
import ItemRowNew, {ParentProps as ItemRowNewParentProps, Props as ItemRowNewProps} from './components/ItemRowNew';
import SelectedItem, {
  ParentProps as SelectedItemParentProps,
  Props as SelectedItemProps
} from './components/SelectedItem';

type WithChildren<T> = T & {
  children: React.ReactNode
}

type RenderProps<I extends BaseItem, U extends keyof I, D extends keyof I> = {
  renderSelectedItems?: (props: WithChildren<SelectedItemsProps>) => React.ReactNode
  renderClosedInput?: (props: ClosedInputProps) => React.ReactNode
  renderSubmitButton?: (props: SubmitButtonProps) => React.ReactNode
  renderIndicatorOpen?: (props: IndicatorOpenProps) => React.ReactNode
  renderItemsWrapper?: (props: WithChildren<ItemsWrapperProps>) => React.ReactNode
  renderInputGroup?: (props: InputGroupProps) => React.ReactNode
  renderNoItems?: (props: NoItemsProps) => React.ReactNode
  renderItemRow?: (props: ItemRowProps<I, D>) => React.ReactElement<ItemRowProps<I, D>>
  renderItemRowNew?: (props: ItemRowNewProps<I>) => React.ReactNode
  renderSelectedItem?: (props: SelectedItemProps<I, U, D>) => React.ReactNode
}

export type BaseItem = {
  disabled?: boolean,
  [s: string]: any,
  [n: number]: any
}

type Props<I extends BaseItem, U extends keyof I, D extends keyof I> =
  SelectedItemsProps &
  ClosedInputParentProps &
  SubmitButtonParentProps &
  IndicatorOpenParentProps &
  ItemsWrapperParentProps &
  InputGroupParentProps &
  NoItemsProps &
  ItemRowParentProps<I, D> &
  ItemRowNewParentProps<I> &
  SelectedItemParentProps<I, U, D> &
  RenderProps<I, U, D> & {
  selectedItems: (I[U])[],
  items: I[],
  single?: boolean,
  onSelectedItemsChange?: (selectedItems: (I[U])[]) => void,
  selectedItemFontFamily?: string,
  selectedItemTextColor?: string,
  itemFontFamily?: string,
  itemTextColor?: string,
  itemFontSize?: number,
  containerStyle?: StyleProp<ViewStyle>,
  selectorViewStyle?: StyleProp<ViewStyle>,
  selectedItemsExtStyle?: StyleProp<ViewStyle>,
  disabledItemColor?: string,
  selectText?: string,
  altFontFamily?: string,
  fixedHeight?: boolean,
  hideTags?: boolean,
  canAddItems?: boolean,
  onAddItem?: (items: I[]) => void,
  onChangeInput?: (value: string) => void,
  getSelectLabel?: (params: { selectText?: string, single?: boolean, selectedItems?: (I[U])[], displayKey?: D }) => string
  getNewItemLabel?: (name: string) => string
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
    searchInputPlaceholderColor: colorPack.placeholderTextColor,
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
    disabledItemColor: 'grey',
    noItemsText: 'No item to display.',
    getNewItemLabel: (name: string) => `Add ${name} (tap or press return)`,
  };
  static SEARCH_SPLIT_REGEXP: RegExp = /[ \-:]+/;

  constructor(props: Props<I, U, D>) {
    super(props);
    this.state = {
      selector: false,
      searchTerm: '',
    };
  }

  getSelectedItemsExt = (optionalSelectedItems?: (I[U])[]): React.ReactNode => {
    const {selectedItemsExtStyle} = this.props;
    return (
      <View style={[styles.selectedItemsExt, selectedItemsExtStyle]}>
        {this._displaySelectedItems(optionalSelectedItems)}
      </View>
    );
  };

  _onChangeInput = (value: string): void => {
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

  _displaySelectedItems = (optionalSelectedItems?: (I[U])[]): React.ReactNode => {
    const {
      selectedItems,
      displayKey,
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

      return this._renderSelectedItem(item);
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

    Keyboard.dismiss();

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

  _filterItems = (searchTerm: string): I[] => {
    const {items, displayKey} = this.props;
    const parts: string[] = searchTerm.trim().split(MultiSelect.SEARCH_SPLIT_REGEXP).map(escapeStringRegexp);
    const regex: RegExp = new RegExp(parts.join('|'), 'i');

    return items.filter((item: I) => regex.test(get(item, displayKey!)));
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

  _renderItems = (): React.ReactNode => {
    const {
      canAddItems,
      items,
      uniqueKey,
      selectedItems,
      displayKey,
    } = this.props;
    const {searchTerm} = this.state;
    // If searchTerm matches an item in the list, we should not add a new
    // element to the list.
    let searchTermMatch: boolean = false;
    let itemList: React.ReactNode = null;
    let addItemRow: React.ReactNode = null;
    const renderItems: I[] = searchTerm ? this._filterItems(searchTerm) : items;

    if (renderItems.length) {
      itemList = (
        <FlatList
          data={renderItems}
          extraData={selectedItems}
          keyExtractor={(item: I) => item[uniqueKey!]}
          renderItem={(rowData: ListRenderItemInfo<I>) => this._renderItemRow(rowData.item)}
          keyboardShouldPersistTaps='handled'
        />
      );

      searchTermMatch = renderItems.some(item => item.name === searchTerm);
    } else if (!canAddItems) {
      itemList = this._renderNoItems();
    }

    if (canAddItems && !searchTermMatch && searchTerm.length) {
      addItemRow = this._renderRowNew({[displayKey!]: searchTerm} as any as I);
    }

    return (
      <View>
        {itemList}
        {addItemRow}
      </View>
    );
  };

  _renderRowNew = (item: I): React.ReactNode => {
    const {
      displayKey,
      rowTouchableOpacityStyle,
      itemContainerStyle,
      itemTextStyle,
      getNewItemLabel,
      renderItemRowNew,
    } = this.props;
    const props: ItemRowNewProps<I> = {
      onAdd: this._addItem,
      itemLabel: getNewItemLabel!(item[displayKey!]),
      itemStyle: this._itemStyle(item),
      item,
      itemContainerStyle,
      itemTextStyle,
      rowTouchableOpacityStyle
    };

    if (renderItemRowNew) {
      return renderItemRowNew(props);
    } else {
      return (<ItemRowNew {...props}/>);
    }
  };

  _renderItemRow = (item: I): React.ReactElement<ItemRowProps<I, D>> => {
    const {
      selectedItemIconColor,
      displayKey,
      rowTouchableOpacityStyle,
      itemContainerStyle,
      itemTextStyle,
      itemCheckIconStyle,
      renderItemRow,
    } = this.props;
    const props: ItemRowProps<I, D> = {
      onPress: this._toggleItem,
      itemStyle: this._itemStyle(item),
      selected: this._itemSelected(item),
      item,
      displayKey,
      selectedItemIconColor,
      rowTouchableOpacityStyle,
      itemContainerStyle,
      itemTextStyle,
      itemCheckIconStyle,
    };

    if (renderItemRow) {
      return renderItemRow(props);
    } else {
      return (<ItemRow {...props}/>);
    }
  };

  _renderNoItems(): React.ReactNode {
    const {
      itemContainerStyle,
      noItemsTextStyle,
      fontFamily,
      noItemsText,
      renderNoItems
    } = this.props;
    const props: NoItemsProps = {
      itemContainerStyle,
      noItemsTextStyle,
      fontFamily,
      noItemsText,
    };

    if (renderNoItems) {
      return renderNoItems(props);
    } else {
      return (<NoItems {...props}/>);
    }
  }

  _renderOpen(): React.ReactNode {
    return (
      <View style={this._selectorViewStyle()}>
        {this._renderInputGroup()}
        {this._renderItemsWrapper()}
      </View>
    );
  }

  _renderInputGroup(): React.ReactNode {
    const {
      hideSubmitButton,
      inputGroupStyle,
      searchIconStyle,
      searchInputPlaceholderText,
      searchInputStyle,
      renderInputGroup,
    } = this.props;
    const {searchTerm} = this.state;
    const props: InputGroupProps = {
      indicatorOpen: hideSubmitButton ? this._renderIndicatorOpen() : null,
      onChange: this._onChangeInput,
      onAdd: this._addItem,
      inputGroupStyle,
      searchIconStyle,
      searchInputPlaceholderText,
      searchInputStyle,
      searchTerm,
    };

    if (renderInputGroup) {
      return renderInputGroup(props);
    } else {
      return (<InputGroup {...props}/>);
    }
  }

  _renderItemsWrapper(): React.ReactNode {
    const {itemsWrapperStyle, itemsContainerStyle, single, hideSubmitButton, renderItemsWrapper} = this.props;
    const props: WithChildren<ItemsWrapperProps> = {
      submitButton: !(single || hideSubmitButton) ? this._renderSubmitButton() : null,
      children: this._renderItems(),
      itemsWrapperStyle,
      itemsContainerStyle
    };

    if (renderItemsWrapper) {
      return renderItemsWrapper(props);
    } else {
      return (<ItemsWrapper {...props}/>);
    }

  }

  _renderIndicatorOpen(): React.ReactNode {
    const {
      renderIndicatorOpen,
      indicatorStyle,
      indicatorOpenStyle
    } = this.props;
    const props: IndicatorOpenProps = {
      onPress: this._submitSelection,
      indicatorStyle,
      indicatorOpenStyle,
    };

    if (renderIndicatorOpen) {
      return renderIndicatorOpen(props);
    } else {
      return (<IndicatorOpen {...props}/>);
    }
  }

  _renderSubmitButton(): React.ReactNode {
    const {
      renderSubmitButton,
      fontFamily,
      submitButtonStyle,
      submitButtonTextStyle,
      submitButtonColor,
      submitButtonText,
    } = this.props;
    const props: SubmitButtonProps = {
      onPress: this._submitSelection,
      fontFamily,
      submitButtonStyle,
      submitButtonTextStyle,
      submitButtonColor,
      submitButtonText,
    };

    if (renderSubmitButton) {
      return renderSubmitButton(props);
    } else {
      return (<SubmitButton {...props}/>);
    }
  }

  _renderClosed(): React.ReactNode {
    const {
      selectedItems,
      single,
      hideTags,
    } = this.props;

    return (
      <View>
        {this._renderClosedInput()}
        {!(single || hideTags) && selectedItems.length ? this._renderSelectedItems() : null}
      </View>
    );
  }

  _renderClosedInput(): React.ReactNode {
    const {
      closedInputWrapperStyle,
      textColor,
      fontSize,
      altFontFamily,
      fontFamily,
      selectLabelStyle,
      indicatorStyle,
      hideSubmitButton,
      renderClosedInput,
      subSectionStyle,
      dropdownViewStyle,
    } = this.props;
    const props: ClosedInputProps = {
      onPress: this._toggleSelector,
      labelText: this._getSelectLabel(),
      inputFontFamily: altFontFamily || fontFamily,
      closedInputWrapperStyle,
      textColor,
      fontSize,
      selectLabelStyle,
      indicatorStyle,
      hideSubmitButton,
      subSectionStyle,
      dropdownViewStyle,
    };

    if (renderClosedInput) {
      return renderClosedInput(props);
    } else {
      return (<ClosedInput {...props}/>);
    }
  }

  _renderSelectedItems(): React.ReactNode {
    const {selectedItemsStyle, renderSelectedItems} = this.props;
    const props: WithChildren<SelectedItemsProps> = {
      children: this._displaySelectedItems(),
      selectedItemsStyle
    };

    if (renderSelectedItems) {
      return renderSelectedItems(props);
    } else {
      return (<SelectedItems {...props}/>);
    }
  }

  _renderSelectedItem(item: I): React.ReactNode {
    const {
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
      renderSelectedItem
    } = this.props;

    const props: SelectedItemProps<I, U, D> = {
      onRemove: this._removeItem,
      item,
      uniqueKey,
      displayKey,
      fontFamily,
      tagRemoveIconColor,
      tagBorderColor,
      tagTextColor,
      selectedItemStyle,
      selectedItemExtStyle,
      selectedItemExtTextStyle,
      selectedItemExtIconStyle,
    };

    if (renderSelectedItem) {
      return renderSelectedItem(props);
    } else {
      return (<SelectedItem {...props}/>);
    }
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
