const { sqlValues } = require('./databaseHelpers.js');

const normalize = (string) => string.replace(/\s/g, '').toLowerCase();

describe('sqlValues', () => {
  test('given single row', () => {
    // insert into whatever (col1, col2, col3) values (1, 2, 3)
    let rowValues = [1, 2, 3];
    const expected = 'VALUES ($1, $2, $3)';

    let result = sqlValues([rowValues]);
    expect(normalize(result.sql)).toBe(normalize(expected));
    expect(result.values).toEqual(rowValues);

    rowValues = ['a', 'b', 'c'];
    result = sqlValues([rowValues]);
    expect(normalize(result.sql)).toBe(normalize(expected));
    expect(result.values).toEqual(rowValues);
  });

  test('given multiple row', () => {
    // insert into whatever (col1, col2, col3)
    // values(1, 2, 3),
    // ("a", "b", "c")
    let row1 = [1, 2, 3];
    let row2 = ['a', 'b', 'c'];
    const expectedValues = [...row1, ...row2];
    const expectedSql = 'VALUES ($1, $2, $3), ($4, $5, $6)';

    let result = sqlValues([row1, row2]);
    expect(normalize(result.sql)).toBe(normalize(expectedSql));
    expect(result.values).toEqual(expectedValues);
  });
});
