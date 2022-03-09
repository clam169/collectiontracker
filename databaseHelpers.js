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

let data = [
  {
    source: 'Cafe 1',
    totals: [
      {
        item: 'Coffee Chaffs',
        totalWeight: '59.55',
      },
    ],
  },
  {
    source: 'Cafe 1',
    totals: [
      {
        item: 'Coffee Pods',
        totalWeight: '30.55',
      },
    ],
  },
  {
    source: 'Cafe 1',
    totals: [
      {
        item: 'Love',
        totalWeight: '5.00',
      },
    ],
  },
  {
    source: 'Cafe 1',
    totals: [
      {
        item: 'Paper Cups',
        totalWeight: '30.55',
      },
      {
        item: 'Love',
        totalWeight: '5.00',
      },
    ],
  },
  {
    source: 'Cafe 2',
    totals: [
      {
        item: 'Love',
        totalWeight: '50.00',
      },
    ],
  },
];

let wanted = [
  {
    source: 'Cafe 1',
    totals: [
      {
        item: 'Love',
        totalWeight: 50.0,
      },
      {
        item: 'Hate',
        totalWeight: 500000.0,
      },
    ],
  },
];

// for every (source, item, totalWeight) {
//    find, if possible, an entry with the right source
//    (if you didn't find one, make one)
//    in that object (that you found or made)
//      get its totals array
//      and push the item/totalweight object shit onto that totals array
// }

let outputArray = [];
for (let row of rows) {
  // iterate across rows from DB

  // destructure DB row
  let { source, item, totalWeight } = row;

  // finds the output object in outputArray, or else finds null
  let outputObject = null;
  for (let oo of outputArray) {
    if (oo.source === source) {
      outputObject = oo;
    }
  }

  // aw shitcrap, we didn't find it.  better make it.
  if (outputObject === null) {
    outputObject = { source, totals: [] };
    // it's made.  now make sure it's healthy in its healthy home
    outputArray.push(outputObject);
  }

  // anyway, let's add the item and totalWeight into a new object in the `totals` array
  outputObject.totals.push({ item, totalWeight });
}

// if (x === 2) {
//   return 3;
// } else {
//   return 5;
// }

// return x === 2 ? 3 : 5;

// stuff.map(() => (
//   COMPONENT
// ))

// x = "poop";

// if ("poop") {

// }

// 2;

// "poop" || ("poop")

// arrrrrr.map(event => (<BIZWAZZER></BIZWAZZER>) )

// numbers.map(num => ({ num: num }))

// [1, 5, 7]
// [{num: 1}, {num: 5}, {num:7}]

// (2
// +2);

const camelToSnakeCase = (str) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const transformTotalWeightsData = (rows) => {
  console.log(rows);
  let nestedRepeats = rows.map((row) => {
    return {
      source: row['sourceName'],
      totals: [
        {
          item: row['itemName'],
          totalWeight: row['totalWeight'],
        },
      ],
    };
  });

  let uniqueSources = [];
  let newStructure = [];

  for (let i = 0; i < nestedRepeats.length; i++) {
    console.log('loop', i, nestedRepeats[i]);
    if (uniqueSources.includes(nestedRepeats[i].source)) {
      // newStructure = newStructure.map((row) => row.source === nestedRepeats[i].source ?
      // {...row, totals:[...nestedRepeats[i].totals]} : row);
      // newStructure[nestedRepeats[i].source] = [...nestedRepeats[i].totals];
      let origArray = newStructure.find(
        (row) => row.source === nestedRepeats[i].source
      );
      console.log('original: ', origArray);
      origArray.totals.push(nestedRepeats[i].totals);
      console.log('original plus new: ', origArray);
    } else {
      uniqueSources.push(nestedRepeats[i].source);
      newStructure.push({ ...nestedRepeats[i] });
    }
    console.log('newStructure', i, newStructure);
  }

  return newStructure;
};

module.exports = { sqlValues, sourceSqlValues, transformTotalWeightsData };
