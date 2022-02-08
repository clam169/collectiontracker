/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return Promise.all([
    // knex('account_type').del(),
    knex('account_type').insert([
      { account_type: 'cx' },
      { account_type: 'sx' },
    ]),
    // knex('account').del(),
    knex('account').insert([
      {
        first_name: 'Pink',
        last_name: 'Ranger',
        company: 'PowPow',
        email: 'pinky@powpow.com',
        account_type_id: 1,
      },
      {
        first_name: 'Black',
        last_name: 'Ranger',
        company: 'PowPow',
        email: 'blacky@powpow.com',
        account_type_id: 1,
      },
      {
        first_name: 'Red',
        last_name: 'Ranger',
        company: 'PowPow',
        email: 'reddy@powpow.com',
        account_type_id: 1,
      },
      {
        first_name: 'Source',
        last_name: 'Ranger',
        company: 'PowPow',
        email: 'source@powpow.com',
        account_type_id: 2,
      },
    ]),
    // knex('source').del(),

    knex('source').insert([
      {
        name: 'Cafe 1',
        address: '123 some street, van, bc',
        phone_number: 6045555555,
        account_id: 1,
      },
      {
        name: 'Cafe 2',
        address: '456 another street, van, bc',
        phone_number: 6040000000,
        account_id: 1,
      },
      {
        name: 'Cafe 3',
        address: '789 whatever street, van, bc',
        phone_number: null,
        account_id: 1,
      },
    ]),
    // knex('item').del(),
    knex('item').insert([
      { name: 'Paper Cups' },
      { name: 'Coffee Pods' },
      { name: 'Coffee Chaffs' },
      { name: 'Love' },
    ]),
    // knex('account_item').del(),
    knex('account_item').insert([
      { item_id: 1, account_id: 1 },
      { item_id: 2, account_id: 1 },
      { item_id: 3, account_id: 1 },
      { item_id: 1, account_id: 2 },
      { item_id: 2, account_id: 2 },
      { item_id: 4, account_id: 2 },
      { item_id: 4, account_id: 3 },
    ]),
    // knex('cx_source').del(),
    knex('cx_source').insert([
      { source_id: 1, cx_account_id: 1 },
      { source_id: 2, cx_account_id: 1 },
      { source_id: 3, cx_account_id: 2 },
      { source_id: 1, cx_account_id: 2 },
    ]),
    // knex('sx_source').del(),
    knex('sx_source').insert([{ source_id: 1, sx_account_id: 4 }]),
    // knex('entry').del(),
    knex('entry').insert([
      {
        item_id: 1,
        weight: 5.55,
        created: '2022-01-28',
        last_edit: '2022-01-29',
        source_id: 1,
        account_id: 1,
      },
      {
        item_id: 2,
        weight: 15.55,
        created: '2022-01-28',
        last_edit: '2022-01-29',
        source_id: 1,
        account_id: 1,
      },
      {
        item_id: 3,
        weight: 34.55,
        created: '2022-01-28',
        last_edit: '2022-01-29',
        source_id: 1,
        account_id: 1,
      },
      {
        item_id: 1,
        weight: 50,
        created: '2022-01-31',
        last_edit: '2022-01-31',
        source_id: 2,
        account_id: 1,
      },
      {
        item_id: 2,
        weight: 20,
        created: '2022-02-01',
        last_edit: '2022-02-01',
        source_id: 3,
        account_id: 2,
      },
      {
        item_id: 2,
        weight: 40,
        created: '2022-02-01',
        last_edit: '2022-02-01',
        source_id: 1,
        account_id: 2,
      },
      {
        item_id: 4,
        weight: 40,
        created: '2022-02-01',
        last_edit: '2022-02-01',
        source_id: 1,
        account_id: 2,
      },
    ]),
  ]);
};
