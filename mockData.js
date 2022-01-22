module.exports = async function () {
  // user wants to select where the material is sourced from from a list of options
  // options MAY have an account attached to it OR it may be a string
  async function getSources(accountId) {
    return [
      {
        source_id: 1,
        name: 'Cafe 1',
        address: '',
      },
      {
        source_id: 2,
        name: 'Cafe 3',
      },
    ];
  }
  async function testQuery() {
    return 'hello';
  }
  return {
    getSources,
    testQuery,
  };
};
