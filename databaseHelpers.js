const sqlValues = (inputValues) => {
  let num = 1;
  const valuesString = inputValues
    .map((row) => {
      return row
        .map(() => {
          return `$${num++}`; // Make the $1, $2, $3 whatever
        })
        .join(', '); // Add commas between each $num
    })
    .map((a) => `(${a})`) // Add brackets around the values ($1, $2, $3),
    .join(','); // add commas between the bracket groups (), ()

  const values = inputValues.flat();
  return {
    sql: `VALUES ${valuesString}`,
    values,
  };
};

const sourceSqlValues = (sourceObject) => {
  const columnNames = Object.keys(sourceObject)
    .map((key) => camelToSnakeCase(key))
    .join(', ');
  let numArray = [];
  let values = [];
  let num = 2;
  for (let value in sourceObject) {
    numArray.push('$' + num);
    values.push(sourceObject[value]);
    num++;
  }
  const numString = numArray.join(', ');
  return {
    columnNames,
    numString,
    values,
  };
};

const camelToSnakeCase = (str) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const transformTotalWeightsData = (rows) => {
  let outputArray = [];
  for (let row of rows) {
    // iterate across rows from DB
    // destructure DB row
    let { sourceName, itemName, totalWeight } = row;
    // finds the output object in outputArray, or else finds null
    let outputObject = null;
    for (let oo of outputArray) {
      if (oo.source === sourceName) {
        outputObject = oo;
      }
    }
    // aw shitcrap, we didn't find it.  better make it.
    if (outputObject === null) {
      outputObject = { source: sourceName, totals: [] };
      // it's made.  now make sure it's healthy in its healthy home
      outputArray.push(outputObject);
    }
    // anyway, let's add the item and totalWeight into a new object in the `totals` array
    outputObject.totals.push({ item: itemName, totalWeight });
  }
  return outputArray;
};

module.exports = { sqlValues, sourceSqlValues, transformTotalWeightsData };
