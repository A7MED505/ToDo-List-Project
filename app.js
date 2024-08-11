const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose');
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
var moment = require('moment');
var methodOverride = require('method-override')
app.use(methodOverride('_method'))


//Automatic refrech
const path = require("path");
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));


const connectLivereload = require("connect-livereload");
app.use(connectLivereload());

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});




//connect 
mongoose.connect("mongodb+srv://A7MED:Ahmed2001@cluster0.evpty.mongodb.net/all-data?retryWrites=true&w=majority&appName=Cluster0").then(() => {
  app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });
})
  .catch((err) => {
    console.log(err);
  });




const Customer = require("./modules/customerSchema")
// Get Request
app.get("/", (req, res) => {
  Customer.find()
    .then((result) => {


      res.render("index", { arr: result, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    })

});




app.get("/user/add.html", (req, res) => {
  res.render("user/add")
});


app.get("/edit/:id", (req, res) => {


  Customer.findById(req.params.id).then((result) => {
    res.render("user/edit", { obj: result })
  }).catch((err) => {
    console.log(err)
  })
});





// Get Request For view
app.get("/user/:id", (req, res) => {
  Customer.findById(req.params.id)
    .then((result) => {
      console.log("=================================")
      console.log(result)
      res.render("user/view", { obj: result, moment: moment })
    })
    .catch((err) => {
      Console.log(err)
    })
});




// post Request
app.post("/user/add.html", (req, res) => {
  //res.render("index")
  
  console.log(req.body)

  Customer.create(req.body)
    .then(() => {
      res.redirect("/")
    })
    .catch((err) => {
      console.log(err);
    });
});


app.post("/search", (req, res) => {
  //res.render("index")
  console.log(req.body.searchText);

  Customer.find({ $or: [{fristName: req.body.searchText},{lastName: req.body.searchText}] })
  .then((result) => {
    console.log(result)
    res.render("user/search", {arr: result})
    
  }).catch((err) => {
    console.log(err)
  })
});




// put Request
app.put("/edit/:id", (req, res) => {
  console.log(req.body)
  Customer.updateOne({ _id: req.params.id }, req.body).then((params) => {
    res.redirect("/")

  }).catch((err) => {
    console.log(err)
  })
});







// delete Request
app.delete("/delete/:id", (req, res) => {
  console.log("**********************")
  Customer.deleteOne({ _id: req.params.id }).then((params) => {
    res.redirect("/")
  }).catch((err) => {
    console.log(err)
  })
});