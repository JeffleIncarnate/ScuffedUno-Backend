interface Return {
  succeeded: boolean;
  itemsMissing: string[];
}

/**
 * This is a function to loop over items, and return the ones that are null.
 * @param items
 * @returns
 */
function verifyArray(items: { [key: string]: string | undefined }): Return {
  const itemsMissing = [];
  let succeeded = true;

  for (const [key, value] of Object.entries(items)) {
    if (value === undefined || value === "") {
      succeeded = false;
      itemsMissing.push(key);
    }
  }

  return {
    succeeded: succeeded,
    itemsMissing,
  };
}

export { verifyArray };
