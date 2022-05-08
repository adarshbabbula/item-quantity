const express = require("express");
const router = express.Router();

const Item = require("../models/item");
const DatesQuantity = require("../models/datesQuantity");
const datesQuantity = require("../models/datesQuantity");

router.get('/',(req, res, next) => {
  Item.find().then(items=> {
    res.status(200).json({
      message: 'Items fetched sucessfully',
      items: items
    });
  });
});

router.get("/:itemId", (req, res, next) => {
  Item.findById(req.params.itemId).then((item) => {
    res.status(200).json({
      message: "Item fetched sucessfully",
      item: item,
    });
  });
});

router.post('/',(req, res, next)=> {
  const item = new Item({name: req.body.name, quantity:0 });
  item.save().then(result => {
    res.json({
      message: "Item Added Sucessfully",
      itemId: result._id
    });
 });
});

router.delete('/:itemId',(req, res, next) => {
  itemId = req.params.itemId;
  Item.findById(itemId).then(item => {
    const datesQuantity = item.datesQuantity;
    datesQuantity.forEach(datesQuantity => {
      DatesQuantity.findByIdAndDelete(datesQuantity._id).then(()=>{});
    });
    Item.findByIdAndRemove(itemId).then(()=>{
      res.status(201).json({
        message: "Item deleted sucessfully"
      })
    });
  });

});

router.put('/:itemId', (req, res, next) => {
  itemId = req.params.itemId;
  Item.findById(itemId).then((item)=> {
    item.name = req.body.name;
    item.save().then((result)=> {
       res.json({
         message: "Item with id "+ itemId + " is sucessfully updated"
       });
    })
  })
});

module.exports = router;
