import React from 'react';
import PropTypes from 'prop-types';

export const ListItem = ({ item, listItemEl, handleListClick }) => {
  return (
    <li
      role="button"
      ref={listItemEl}
      tabIndex="0"
      className="text-gray-900 cursor-pointer relative py-2 pl-3 pr-9 hover:text-white hover:bg-indigo-600 focus:text-white focus:bg-indigo-600"
      onClick={(e) => handleListClick(item, e)}
    >
      <span className="block">
        {item.firstName} {item.lastName}
      </span>
      <span className="block text-xs">{item.email}</span>
    </li>
  );
};

ListItem.propTypes = {
  item: PropTypes.object,
  listItemEl: PropTypes.object,
  handleListClick: PropTypes.func,
};

export default ListItem;
