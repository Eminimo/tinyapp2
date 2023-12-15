const express = require("express");
const app = express();
const PORT = 8080; // Default port 8080

// Set up body parser middleware to handle form submissions
app.use(express.urlencoded({ extended: true }));

// Set the view engine to EJS for template rendering
app.set("view engine", "ejs");

// Your URL database
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Function to generate a random string for short URL
function generateRandomString() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Root route
app.get("/", (req, res) => {
  res.send("Hello!");
});

// Hello route
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// Route to return URL database in JSON format
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Route to render form for submitting new URL
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// Route to create a new short URL
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;  // Store the long URL against the generated short URL
  res.redirect(`/urls/${shortURL}`); // Redirect to the page showing the new short URL
});

// Route to list all short URLs
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// Route to show details of a single short URL
app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id]; // Retrieve the long URL from urlDatabase
  if (longURL) {
    const templateVars = { id: id, longURL: longURL };
    res.render("urls_show", templateVars);
  } else {
    res.status(404).send("Short URL does not exist.");
  }
});

// Route for redirection to long URL using short URL
app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  if (longURL) {
    res.redirect(longURL);
  } else {
    res.status(404).send("Short URL does not exist.");
  }
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Catch-all for undefined routes to handle 404 errors
app.get("*", (req, res) => {
  res.status(404).send("Page not found.");
});
