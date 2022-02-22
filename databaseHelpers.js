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

const sourceValues = (sourceObject) => {
  const columnNames = Object.keys(sourceObject).join(', ');
  let values = [];
  let num = 2;
  for (let value in sourceObject) {
    values.push('$' + num);
    num++
  }
  const valuesString = values.join(', ');
  return {
    columnNames,
    valuesString
  }
};

exports.sqlValues = {sqlValues, sourceValues};
