import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from '@mbkit/input';
import { Label } from '@mbkit/label';

import ListItem from './ListItem';
import Results from './Results';
import { filterList } from './utils/filterList';

export const InputSuggest = ({ label, suggestions, handleClick, initialValue }) => {
  const inputEl = useRef(null);
  const listItemEl = useRef(null);
  const resultsEl = useRef(null);

  const [state, setState] = useState({
    value: initialValue ? initialValue : '',
    suggestions: suggestions,
    filteredList: [],
  });

  const handleUserKeyPress = useCallback(
    (event) => {
      const { keyCode } = event;
      const currentElement = document.activeElement;
      const elementType = currentElement.tagName;

      switch (keyCode) {
        case 40: // Down
          if (elementType === 'INPUT') {
            let resultList = resultsEl.current.getElementsByTagName('li');

            resultList[0].focus();
          } else {
            let next = currentElement.nextSibling;

            if (next) {
              next.focus();
            }
          }

          break;
        case 38: // Up
          if (elementType !== 'INPUT') {
            let next = currentElement.previousSibling;

            if (next) {
              next.focus();
            } else {
              //TODO: Need to figure how to set cursor to the end
              inputEl.current.focus();
            }
          }

          break;
        case 27: // Escape
          setState({
            ...state,
            filteredList: [],
          });

          break;
        default:
          break;
      }
    },
    [state]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleUserKeyPress);

    return () => {
      window.removeEventListener('keydown', handleUserKeyPress);
    };
  }, [handleUserKeyPress]);

  const ResultsList = () => {
    if (state.filteredList.length > 0) {
      const listItems = state.filteredList.map((item) => (
        <ListItem
          key={item.id}
          item={item}
          listItemEl={listItemEl}
          handleListClick={handleListClick}
        />
      ));

      return <Results listItems={listItems} resultsEl={resultsEl} />;
    } else {
      return null;
    }
  };

  const handleChange = (event) => {
    const value = event.target.value,
      searchValue = value ? value.toLowerCase() : '';

    let filteredList = [];

    if (searchValue !== '') {
      filteredList = filterList(state.suggestions, searchValue);
    }

    setState({
      ...state,
      value: value,
      filteredList: filteredList,
    });
  };

  const handleListClick = (item) => {
    const fullName = `${item.firstName} ${item.lastName}`;

    setState({
      ...state,
      value: fullName,
      filteredList: [],
    });

    handleClick(item);
  };

  const handleFocus = () => {
    if (state.value === '') {
      setState({
        ...state,
        filteredList: suggestions,
      });
    }
  };

  return (
    <div className="flex flex-col mb-4">
      <Label id="suggest-label">{label}</Label>
      <Input ref={inputEl} value={state.value} onChange={handleChange} onFocus={handleFocus} />

      <ResultsList />
    </div>
  );
};

InputSuggest.propTypes = {
  initialValue: PropTypes.string,
  label: PropTypes.string,
  suggestions: PropTypes.array,
  handleClick: PropTypes.func,
};
