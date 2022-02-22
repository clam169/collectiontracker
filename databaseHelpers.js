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

module.exports = { sqlValues, sourceSqlValues };
