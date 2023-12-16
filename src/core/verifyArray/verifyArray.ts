interface Return {
  succeded: boolean;
  itemsMissing: string[];
}

/**
 * This is a function to loop over items, and return the ones that are null.
 * @param items
 * @returns
 */
function verifyArray(items: { [key: string]: string | undefined }): Return {
  const itemsMissing = [];
  let succeded = true;

  for (const [key, value] of Object.entries(items)) {
    if (value === undefined || value === "") {
      succeded = false;
      itemsMissing.push(key);
    }
  }

  return {
    succeded,
    itemsMissing,
  };
}

export { verifyArray };
