const express = require("express");
const books = require("./books.js");
// const fetch = require("node-fetch-polyfill");
const Joi = require("joi");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send(books);
});

app.get("/api/books", (req, res) => {
  res.send(books).status(200).end();
});

app.get("/api/books/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book)
    return res.status(404).send("The book with the given id was not found");
  res.send(book);
});

app.post("/api/books", (req, res) => {
  const { error } = validateBook(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const book = {
    id: books.length + 1,
    author: req.body.author,
    name: req.body.name,
    release: req.body.date,
    collection: req.body.collection,
  };
  books.push(book);
  res.send(book);
});

app.put("/api/books/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book)
    return res.status(404).send("The book with the given id was not found");

  const { error } = validateBook(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  book.author = req.body.author;
  book.name = req.body.name;
  book.release = req.body.release;
  book.collection = req.body.collection;
  res.send(book);
});

app.delete("/api/books:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book)
    return res.status(404).send("The book with the given id was not found");

  const index = books.indexOf(book);
  courses.splice(index, 1);

  res.send(book);
});

//validate the book

function validateBook(book) {
  const schema = Joi.object({
    id: Joi.number(),
    author: Joi.string().required(),
    name: Joi.string().required(),
    release: Joi.date(),
    collection: Joi.string(),
  });
  return schema.validate(book);
}

// posting a book
// async function postBook(url = "", data = {}) {
//   let post = await fetch(url, {
//     method: "POST",
//     body: JSON.stringify(data),
//     headers: { "Content-type": "application/json; charset=UTF-8" },
//   })
//     .then((post) => post.json())
//     .then((json) => console.log(json))
//     .catch((err) => console.log(err));
//   return post;
// }





const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}...`));
