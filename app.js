//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const app = express();
const multer = require('multer');
const upload = multer({dest: 'uploads/'});


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



mongoose.connect("mongodb://localhost:27017/cartDB", {useNewUrlParser: true});

const productSchema = {
  password: String,
  name: String,
  description: String,
  quantity: Number,
  unitPrice: Number
};
const Product = mongoose.model("Product", productSchema);
/////////////////////////////request targeting products///////////////////////////
app.route("/products")
.get(function(req, res){
  Product.find(function(err, foundProducts){
    if(!err){
      console.log(foundProducts);
      res.send(foundProducts);
    }else{
      res.send(err);
    }
  });
})
.post(upload.single('image'),function(req,res){
  console.log(req.file);
  if(req.body.password===""+process.env.PASS+""){
    const newProduct = new Product({
       password: req.body.password,
       name: req.body.name,
       description: req.body.description,
       quantity: req.body.quantity,
       unitPrice: req.body.unitPrice
    });
    newProduct.save(function(err){
     if(!err){
       res.send("Successfully added a new product");
     }else{
       res.send(err);
     }
    });
  }else{
    res.send("Password not match");
  }
})
.delete(function(req,res){
  if(req.body.password===""+process.env.PASS+""){
  Product.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted all the elements");
    }else{
      res.send(err);
    }
  });
}else{
  res.send("password incorrect");
}
});
///////////////////////requests targetting a specific article////////////////////////
app.route("/products/:productName")
.get(function(req, res){
  Product.findOne({name: req.params.productName}, function(err, foundProduct){
    if(foundProduct){
      res.send(foundProduct);
    }else{
      res.send(err);
    }
  });
})
.put(function(req, res){
  if(req.body.password===""+process.env.PASS+""){
  Product.update(
    {name: req.params.productName},
    {name: req.body.name,image: req.body.image},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated using put");
      }else{
        res.send(err);
      }
    }
  );
}else{
  res.send("Password incorrect");
}
})
.patch(function(req,res){
  if(req.body.password===""+process.env.PASS+""){
  Product.update(
    {name: req.params.productName},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated using path");
      }else{
        res.send(err);
      }
    }
  );
}else{
  res.send("password incorrect");
}
})
.delete(function(req, res){
  if(req.body.password===""+process.env.PASS+""){
  Product.deleteOne(
    {name: req.params.productName},
    function(err){
      if(!err){
        res.send("Successfully deleted one product");
      }else{
        res.send(err);
      }
    }
  );
}else{
  res.send("password incorrect");
}
});
////////////////////////////////////request targeting cart////////////////////////////////////////
const cartSchema = {
  name: String,
  quantity: Number,
};
const Item = mongoose.model("Item", cartSchema);

app.route("/items")
.get(function(req, res){
  Item.find(function(err, foundItems){
    if(!err){
      console.log(foundItems);
      res.send(foundItems);
    }else{
      res.send(err);
    }
  });
})
.post(function(req,res){
  const newItem = new Item({
     name: req.body.name,
     quantity: req.body.quantity
  });
  newItem.save(function(err){
   if(!err){
     res.send("Successfully added a new item in cart database");
   }else{
     res.send(err);
   }
  });
})
.delete(function(req,res){
  Item.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted all the elements");
    }else{
      res.send(err);
    }
  });
});
///////////////////////requests targetting a specific items////////////////////////
app.route("/items/:itemName")
.get(function(req, res){
  Product.findOne({name: req.params.itemName}, function(err, foundItem){
    if(foundItem){
      res.send(foundItem);
    }else{
      res.send(err);
    }
  });
})
.delete(function(req, res){
  Item.deleteOne(
    {name: req.params.itemName},
    function(err){
      if(!err){
        res.send("Successfully deleted one item from cart");
      }else{
        res.send(err);
      }
    }
  );
});

app.listen(3000, function(){
  console.log("Server started on port 3000");
});
