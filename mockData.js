module.exports = async function () {
  async function testQuery() {
    return []
  }
  // user wants to select where the material is sourced from from a list of options
  // options MAY have an account attached to it OR it may be a string
  async function getSources(accountId) {
    return [
      {
        source_id: 1,
        name: 'Cafe 1',
      },
      {
        source_id: 2,
        name: 'Cafe 2',
      },
    ];
  }
  async function getItems(accountId) {
    return [
      {
        item_id: 1,
        name: 'Paper Cups',
      },
      {
        item_id: 2,
        name: 'Coffee Grinds',
      },
      {
        item_id: 3,
        name: 'Coffee Lids',
      },
      {
        item_id: 4,
        name: 'Napkins',
      },
    ];
  }
  async function getListOfEntries(accountId) {
    return [
      {
        item_name: 'Paper Cups',
        source_name: 'Cafe 1',
        entry_id: 1,
        entry_date: '2022-01-22',
        entry_weight: 10,
      },
      {
        item_name: 'Coffee Grinds',
        source_name: 'Cafe 1',
        entry_id: 2,
        entry_date: '2022-01-23',
        entry_weight: 20,
      },
      {
        item_name: 'Coffee Lids',
        source_name: 'Cafe 1',
        entry_id: 3,
        entry_date: '2022-01-24',
        entry_weight: 15,
      },
      {
        item_name: 'Napkins',
        source_name: 'Cafe 1',
        entry_id: 4,
        entry_date: '2022-01-24',
        entry_weight: 5,
      },
      {
        item_name: 'Paper Cups',
        source_name: 'Cafe 2',
        entry_id: 5,
        entry_date: '2022-01-24',
        entry_weight: 25,
      },
      {
        item_name: 'Coffee Grinds',
        source_name: 'Cafe 2',
        entry_id: 6,
        entry_date: '2022-01-24',
        entry_weight: 20,
      },
    ];
  }
  async function getEntryById(entryId) {
    return {
      item_name: 'Coffee Grinds',
      item_id: 2,
      source_name: 'Cafe 2',
      source_id: 2,
      entry_id: 6,
      entry_date: '2022-01-24',
      entry_weight: 20,
    };
  }
  async function updateEntryById(entryId, updatedEntry) {
    return { message: 'Successfully updated entry ' + entryId };
  }
  async function deleteEntry(entryId) {
    return { message: 'Successfully deleted entry ' + entryId };
  }
  let mockEntry = [
    {
      formValues: {
        date: '2021-01-22',
        source_id: 1,
      },
      entryWeights: [
        {
          item_id: 1,
          entry_weight: 10,
        },
        {
          item_id: 2,
          entry_weight: 15,
        },
        {
          item_id: 3,
          entry_weight: 30,
        },
      ],
    },
  ];
  let editEntry = {
    entry_id: 1,
    item_id: 1,
    item_name,
    source_id: 1,
    source_name,
    entry_weight: 29,
    entry_date: '2022-01-01',
  };
  return {
    getSources,
    editEntry,
    getItems,
    getListOfEntries,
    getEntryById,
    updateEntryById,
    deleteEntry,
    mockEntry,
    testQuery,
  };
};
