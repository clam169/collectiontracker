/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = function (knex) {
  return knex('account_type')
    .insert([{ account_type: 'cx' }, { account_type: 'sx' }])
    .then(() => {
      return knex('item').insert([
        { name: 'Paper Cups' },
        { name: 'Coffee Pods' },
        { name: 'Coffee Chaffs' },
        { name: 'Love' },
      ]);
    })
    .then(() => {
      return knex('account').insert([
        {
          given_name: 'Pink',
          family_name: 'Ranger',
          company: 'PowPow',
          nickname: 'pinky',
          email: 'pinky@powpow.com',
          account_type_id: 1,
          auth0_id: 'auth0|62070daf94fb2700687ca3b3',
        },
        {
          given_name: 'Black',
          family_name: 'Ranger',
          company: 'PowPow',
          nickname: 'blacky',
          email: 'blacky@powpow.com',
          account_type_id: 1,
          auth0_id: 'auth0|620c57885e503e006996bdd3',
        },
        {
          given_name: 'Red',
          family_name: 'Ranger',
          company: 'PowPow',
          nickname: 'reddy',
          email: 'reddy@powpow.com',
          account_type_id: 1,
          auth0_id: 'auth0|620c57c35e503e006996bde4',
        },
        {
          given_name: 'Source',
          family_name: 'Ranger',
          company: 'PowPow',
          nickname: 'source',
          email: 'source@powpow.com',
          account_type_id: 2,
          auth0_id: 'auth0|620c57e8cef4230069744708',
        },
      ]);
    })
    .then(() => {
      return knex('account_item').insert([
        { item_id: 1, account_id: 1 },
        { item_id: 2, account_id: 1 },
        { item_id: 3, account_id: 1 },
        { item_id: 1, account_id: 2 },
        { item_id: 2, account_id: 2 },
        { item_id: 4, account_id: 2 },
        { item_id: 4, account_id: 3 },
      ]);
    })
    .then(() => {
      return knex('source').insert([
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
      ]);
    })
    .then(() => {
      return knex('cx_source').insert([
        { source_id: 1, cx_account_id: 1 },
        { source_id: 2, cx_account_id: 1 },
        { source_id: 3, cx_account_id: 2 },
        { source_id: 1, cx_account_id: 2 },
      ]);
    })
    .then(() => {
      return knex('sx_source').insert([{ source_id: 1, sx_account_id: 4 }]);
    })
    .then(() => {
      return knex('entry').insert([
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
      ]);
    });
};
