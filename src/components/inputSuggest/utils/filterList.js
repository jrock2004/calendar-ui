/**
 * Loops thorough the array of objects to look to see which one matches
 * @param {array} suggestions
 * @param {string} searchValue
 *
 * @returns {array}
 */
export const filterList = (suggestions, searchValue) => {
  const tokens = searchValue.toLowerCase().split(' ');

  return Object.values(suggestions).filter((entry) => {
    return Object.values(entry).some((entryValue) => {
      // If value is not a string, we skip
      if (typeof entryValue !== 'string') return false;

      entryValue = entryValue.toLowerCase();

      return tokens.every((token) => entryValue.includes(token));
    });
  });
};
