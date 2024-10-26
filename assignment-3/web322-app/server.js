/*********************************************************************************

WEB322 – Assignment 03
I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Renan de Alencar Queiroz
Student ID: 129280236
Date: Oct 30, 2024
Replit Web App URL: https://e000a932-a81f-45bc-8f20-7db9d4c2ed7a-00-1qzx6p1k4unjw.kirk.replit.dev/
GitHub Repository URL: https://github.com/RenanAQ/Web322.git

********************************************************************************/

const express = require("express");
const path = require("path");
const app = express();
const storeService = require("./store-service"); //importing my module

const cloudinary = require("./cloudinaryConfig");
const multer = require("multer");
const streamifier = require("streamifier");
const upload = multer();

// Setting the port number to listen on
const HTTP_PORT = process.env.PORT || 8080;

//Assignmet 03:  Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

//CSS & images, JS
app.use(express.static("public"));

// / route:
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/about.html"));
});

// HOME route:
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/home.html"));
});

// ABOUT route:
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/about.html"));
});

// SHOP route: (Static HTML)
app.get("/shop", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/shop.html"));
});

// shop route:
app.get("/api/shop", (req, res) => {
  storeService
    .getPublishedItems()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

// ITEMS route: (Static HTML) - Assignment 03
app.get("/items", (req, res) => {
  const { category, minDate } = req.query;

  if (category) {
    storeService.getItemsByCategory(category)
      .then(data => res.json(data))
      .catch(err => res.json({ message: err }));
  } else if (minDate) {
    storeService.getItemsByMinDate(minDate)
      .then(data => res.json(data))
      .catch(err => res.json({ message: err }));
  } else {
    storeService.getAllItems()
      .then(data => res.json(data))
      .catch(err => res.json({ message: err }));
  }
});

// Route to get a specific item by ID - Assignment 03
app.get("/item/:id", (req, res) => {
  storeService.getItemById(req.params.id)
    .then(data => res.json(data))
    .catch(err => res.json({ message: err }));
});

// items route:
app.get("/api/items", (req, res) => {
  storeService
    .getAllItems()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

// CATEGORIES route: (Static HTML)
app.get("/categories", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/categories.html"));
});

// CATEGORIES route:
app.get("/api/categories", (req, res) => {
  storeService
    .getCategories()
    .then((data) => {
      // Send the fetched categories data to the client as JSON
      res.json(data);
    })
    .catch((err) => {
      // Return an error message in the correct format
      res.json({ message: err });
    });
});

//Assignment 03: adding the item route (Static HTML)
app.get("/items/add", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/addItem.html"));
});

//Assignment 03: adding the item route
app.post("/items/add", upload.single("featureImage"), (req, res) => {
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      let result = await streamUpload(req);
      console.log(result);
      return result;
    }

    upload(req).then((uploaded) => {
      processItem(uploaded.url);
    });
  } else {
    processItem("");
  }

  function processItem(imageUrl) {
    req.body.featureImage = imageUrl;

    // TODO: Process the req.body and add it as a new Item before redirecting to /items
    // Redirect to /items or return a response
    res.redirect("/items");
  }
});

// Handle unmatched routes with a custom 404 page
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
});

// Listen on this port to run the website locally
storeService
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Express http server listening on port: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log("Failed to initialize data: ", err);
  });