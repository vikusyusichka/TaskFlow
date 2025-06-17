// client/src/components/SortDropdown.js

import React from 'react';
import PropTypes from 'prop-types';

import {
  memoize,
  sortByNameAsc,
  sortByNameDesc,
  sortByDateAsc,
  sortByDateDesc,
  sortByColor
} from '../utils/memoizeAndSort';

const SortDropdown = ({ tasks, onSorted }) => {
  // Memoized versions of each sorting function
  const memoSortByNameAsc = React.useMemo(
    () => memoize(sortByNameAsc, { maxSize: 5, policy: 'LRU' }),
    []
  );
  const memoSortByNameDesc = React.useMemo(
    () => memoize(sortByNameDesc, { maxSize: 5, policy: 'LRU' }),
    []
  );
  const memoSortByDateAsc = React.useMemo(
    () => memoize(sortByDateAsc, { maxSize: 5, policy: 'LRU' }),
    []
  );
  const memoSortByDateDesc = React.useMemo(
    () => memoize(sortByDateDesc, { maxSize: 5, policy: 'LRU' }),
    []
  );
  const memoSortByColor = React.useMemo(
    () => memoize(sortByColor, { maxSize: 5, policy: 'LRU' }),
    []
  );

  // Обробник вибору сортування
  const handleChange = (e) => {
    const mode = e.target.value;
    let sortedTasks = tasks;

    switch (mode) {
      case 'A_Z':
        sortedTasks = memoSortByNameAsc(tasks);
        break;
      case 'Z_A':
        sortedTasks = memoSortByNameDesc(tasks);
        break;
      case 'OLD_NEW':
        sortedTasks = memoSortByDateAsc(tasks);
        break;
      case 'NEW_OLD':
        sortedTasks = memoSortByDateDesc(tasks);
        break;
      case 'COLOR':
        sortedTasks = memoSortByColor(tasks);
        break;
      default:
        // Без сортування
        break;
    }

    onSorted(sortedTasks);
  };

  return (
    <div className="sort-dropdown">
      <label htmlFor="sort-select">Sort by:</label>
      <select id="sort-select" onChange={handleChange} defaultValue="">
        <option value="">-- None --</option>
        <option value="A_Z">A → Z</option>
        <option value="Z_A">Z → A</option>
        <option value="OLD_NEW">Old → New</option>
        <option value="NEW_OLD">New → Old</option>
        <option value="COLOR">By Color</option>
      </select>
    </div>
  );
};

SortDropdown.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    color: PropTypes.string
  })).isRequired,
  onSorted: PropTypes.func.isRequired
};

export default SortDropdown;
