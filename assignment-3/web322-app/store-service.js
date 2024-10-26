/*********************************************************************************

WEB322 – Assignment 03
I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Renan de Alencar Queiroz
Student ID: 129280236
Date: Oct 30, 2024
Replit Web App URL: https://e000a932-a81f-45bc-8f20-7db9d4c2ed7a-00-1qzx6p1k4unjw.kirk.replit.dev/
GitHub Repository URL: https://github.com/RenanAQ/Web322.git

********************************************************************************/

const fs = require("fs");

var itemsArray = [];
var categoriesArray = [];

var pathToItems = "./data/items.json";
var pathToCat = "./data/categories.json";

function initialize() {
  return new Promise((resolve, reject) => {
    fs.readFile(pathToItems, "utf8", (err, jsonString) => {
      if (err) {
        return reject("Unable to read ITEMS file");
      }

      try {
        //parse the items file
        itemsArray = JSON.parse(jsonString);

        fs.readFile(pathToCat, "utf-8", (err, jsonString) => {
          if (err) {
            return reject("Unable to read CATEGORIES file");
          }
          try {
            //parse the items file
            categoriesArray = JSON.parse(jsonString);
            resolve("Initialization successfull!");
          } catch (error) {
            reject("Unable to parse CATEGORIES file");
          }
        });
      } catch (error) {
        reject("Unable to parse ITEMS file");
      }
    });
  });
}

function getAllItems() {
  return new Promise((resolve, reject) => {
    itemsArray.length === 0
      ? reject("no results returned!")
      : resolve(itemsArray);
  });
}

function getPublishedItems() {
  return new Promise((resolve, reject) => {
    const publishedItems = itemsArray.filter((item) => item.published);
    publishedItems.length === 0
      ? reject("no results returned")
      : resolve(publishedItems);
  });
}

function getCategories() {
  return new Promise((resolve, reject) => {
    categoriesArray.length == 0
      ? reject("no results returned")
      : resolve(categoriesArray);
  });
}

//Assignment 03
function addItem(itemData) {
  return new Promise((resolve, reject) => {
    if (itemData.published === undefined) {
      itemData.published = false;
    } else {
      itemData.published = true;
    }
    itemData.id = itemsArray.length + 1;
    itemsArray.push(itemData);
    resolve(itemData);
  });
}
//Assignment 03
function getItemsByCategory(category) {
  return new Promise((resolve, reject) => {
    const filteredItems = itemsArray.filter(
      (item) => item.category == category
    );
    filteredItems.length === 0
      ? reject("no results returned")
      : resolve(filteredItems);
  });
}
//Assignment 03
function getItemsByMinDate(minDateStr) {
  return new Promise((resolve, reject) => {
    const minDate = new Date(minDateStr);
    const filteredItems = itemsArray.filter(
      (item) => new Date(item.postDate) >= minDate
    );
    filteredItems.length === 0
      ? reject("no results returned")
      : resolve(filteredItems);
  });
}
//Assignment 03
function getItemById(id) {
  return new Promise((resolve, reject) => {
    const item = itemsArray.find((item) => item.id == id);
    item ? resolve(item) : reject("item not found");
  });
}

initialize()
  .then((message) => {
    console.log(message); // Initialize success
    return getAllItems();
  })
  .then((items) => {
    console.log("All items: ", items);
    return getPublishedItems();
  })
  .then((publishedItems) => {
    console.log("Published items: ", publishedItems);
    return getCategories();
  })
  .then((categories) => {
    console.log("Categories: ", categories);
  })
  .catch((err) => {
    console.error(err);
  });

// Exporting the functions so that they can be used in other files
module.exports = {
  initialize,
  getAllItems,
  getPublishedItems,
  getCategories,
  addItem,
  getItemsByCategory,
  getItemsByMinDate,
  getItemById,
};
