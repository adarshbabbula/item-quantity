const express = require("express");
const router = express.Router();

const DateQuantites = require("../models/datesQuantity");
const Item = require("../models/item");

router.get('/:itemId',(req, res, next) => {
  DateQuantites.find({itemId: req.params.itemId}).then(dateQuantities=> {
    res.status(200).json({
      message: 'DateQuantites fetched sucessfully',
      dateQuantities: dateQuantities
    });
  });
});

// router.get("/:dateQuantitiesId", (req, res, next) => {
//   DateQuantites.findById(req.params.dateQuantitiesId).then((dateQuantities) => {
//     res.status(200).json({
//       message: "DateQuantites fetched sucessfully",
//       dateQuantities: dateQuantities,
//     });
//   });
// });

router.post('/',(req, res, next)=> {
  const dateQuantities = new DateQuantites({date: req.body.date, quantity: req.body.quantity, itemId: req.body.itemId, rate: req.body.rate, amount: req.body.amount });
  dateQuantities.save().then(result => {
    Item.findById(dateQuantities.itemId).then(item => {
      item.datesQuantity.push(dateQuantities);
      item.totalRate += result.rate
      item.avgRate = parseInt(item.totalRate/item.datesQuantity.length)
      item.quantity += result.quantity
      item.totalAmount += result.amount
      item.save().then(itemResult => {
        res.json({
          message: "DateQuantites Added Sucessfully",
          dateQuantityId: result._id
        });
      });
    })
 });
});

router.delete('/:dateQuantitiesId',(req, res, next) => {
  dateQuantitiesId = req.params.dateQuantitiesId;
  DateQuantites.findById(dateQuantitiesId).then((dateQuantities)=> {
    Item.findById(dateQuantities.itemId).then(item => {
      item.datesQuantity.pull(dateQuantities._id)
      item.totalAmount = item.totalAmount  - (dateQuantities.quantity*dateQuantities.rate);
      item.totalRate -=   dateQuantities.rate;
      if(item.totalRate!=0)
        item.avgRate = (item.totalRate/item.datesQuantity.length)
      else
        item.avgRate = 0;
      item.quantity -=  dateQuantities.quantity
      item.save().then((itemResult) => {
          DateQuantites.findByIdAndRemove(dateQuantitiesId).then(()=>{
           res.json({
             message: "DateQuantites with id "+ dateQuantitiesId + " is sucessfully deleted"
           });
        })
      });
    });
  })
});
router.put('/:dateQuantitiesId', (req, res, next) => {
  dateQuantitiesId = req.params.dateQuantitiesId;
  DateQuantites.findById(dateQuantitiesId).then((dateQuantities)=> {
    Item.findById(dateQuantities.itemId).then(item => {
      updatedQuantity = parseInt(req.body.quantity)
      updatedRate = parseInt(req.body.rate)
      item.totalAmount = item.totalAmount + (updatedQuantity*updatedRate) - (dateQuantities.quantity*dateQuantities.rate);
      item.totalRate += updatedRate - dateQuantities.rate;
      item.avgRate = (item.totalRate/item.datesQuantity.length)
      item.quantity += updatedQuantity - dateQuantities.quantity
      item.save().then((itemResult) => {
        dateQuantities.date = req.body.date;
        dateQuantities.rate = req.body.rate;
        dateQuantities.quantity = req.body.quantity;
        dateQuantities.amount = dateQuantities.quantity * dateQuantities.rate;
        dateQuantities.save().then((result)=> {
           res.json({
             message: "DateQuantites with id "+ dateQuantitiesId + " is sucessfully updated"
           });
        })
      });
    });
  })
});

module.exports = router;
