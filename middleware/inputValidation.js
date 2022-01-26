module.exports = {
  validateInput: (req, res, next) => {
    inputRequest = req.params[0];

    //turn input date into date type
    const inputDate = new Date(inputRequest.formValues.date);

    //calculate week after today to check if input is for this week or before
    const weekAfterToday = new Date();
    weekAfterToday.setDate(today.getDate() + 7);
    switch (inputDate.getDate()) {
      case inputDate.getDate() < weekAfterToday.getDate():
        res.send('The Date is way ahead');
      case inputDate.getDate() === null || inputDate.getDate() === undefined:
        res.send('No date was submitted');
    }

    //check entryWeights data
    for (item in inputRequest.entryWeights) {
      //check if item_id is a number and is not negative
      if (typeof item.item_id !== 'number' || item.item_id < 0) {
        res.send('invalid item_id detected');
      }

      //make sure weights entered are not negative
      switch (item.entry_weight) {
        case item.entry_weight < 0:
          res.send('unable to input negative weight');
      }

      return next();
    }
    // if(typeof(inputRequest.entryWeights.))//todo: loop through entry weight
  },
};
//  let mockEntry = [
//     {
//       formValues: {
//         date: '2021-01-22',
//         source_id: 1,
//       },
//       entryWeights: [
//         {
//           item_id: 1,
//           entry_weight: 10,
//         },
//         {
//           item_id: 2,
//           entry_weight: 15,
//         },
//         {
//           item_id: 3,
//           entry_weight: 30,
//         },
//       ],
//     },
//   ];
