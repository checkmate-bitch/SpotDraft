const express = require("express"),
      app = express();

//ejs
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("home");
});

app.get("*", (req, res) => {
    res.send("Invalid Page Requested");
});

app.listen(3000, () => {
    console.log("Big Brother is listening");
});
