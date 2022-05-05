const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');

router.post('/', (req, res) => {
  const userData = req.body
  User.create(userData, (error, createdUser) => {
    if (error) {
      console.error(error);
      res.status(400).json({
        error: 'an error has occurred'
      })
    } else {
      console.log('created user successfully');
      res.status(201).json({
        message: 'Created Successfully',
        user: createdUser
      })
    }
  })
})

router.delete('/:id', (req, res) => {
  Product.deleteMany({ // deletes a bunch of products
    seller: req.params.id // only deletes the products that have the seller of the one we're deleting
  }, (error, resultA) => {
    if (error) {
      console.error(error);
      res.status(404).json({ // error handling magic
        error: 'No products found!'
      })
    } else {
      console.log(`Successfully deleted ${resultA.deletedCount} products that were sold by the User.`)
      User.deleteOne({ // deletes one user
        _id: req.params.id // only the user we want to delete
      }, (error, resultB) => {
        if (error) {
          console.error(error); // error handling magic
          res.status(404).json({
            error: 'No User found!'
          })
        } else {
          console.log('Successfully deleted User');
          res.status(204).json({}); // sends back 204 when we succeed in both operations.
        }
      })
    }
  })
})

router.put('/favorite/:userId/:productId', (req, res) => {
  User.updateOne ({ // we are updating one user
    _id: req.params.userId // only the user that is adding the favorite
  }, {
    $push: {
      favorites: req.params.productId // pushing the objectId of the product they are favoriting into their favorites list
    }
  }, (error, updatedUser) => {
    if (error) {
      console.error(error);
      res.status(404).json({ // error handling magic
        error: 'User not found'
      });
    } else {
      Product.updateOne({ // updating one product
        _id: req.params.productId // only the product that is being added as a favorite
      }, {
        $push: {
          favorite_users: req.params.userId // pushing the objectId of the user that is doing the favoriting into their list of favorite users
        }
      }, (error, updatedProduct) => {
        if (error) {
          console.error(error); // more error handling magic
          res.status(404).json({
            error: 'Product not found'
          })
        } else {
          res.status(202).json({
            message: 'Successfully updated the user and product favorite lists'
          }) // sends back a 202 when both operations are complete!
        }
      })
    }
  })
})

module.exports = router;