const express = require("express"),
      request = require("request")
      app = express();

let URL = "http://api.nytimes.com/svc/books/v3/lists";
const key = "f3f3b41cc93a40b8a7869ddbdd0b6bb5";

//ejs
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    const list = req.query.list;
    // console.log({ list });
    if(list) {
        request.get({
            url: URL,
            qs: {
                'api-key': "f3f3b41cc93a40b8a7869ddbdd0b6bb5",
                'list': list
            },
        }, (err, response, body) => {
            if(err) {
                console.error(err);
            } else {
                if(response.statusCode == 200) {
                    const parsedBody = JSON.parse(body);
                    const noOfResults = parsedBody.num_results;
                    let results = [];
                    for(let result of parsedBody.results) {
                        let tempObj = {};
                        tempObj.rank = result.rank;
                        tempObj.published_date = result.published_date;
                        tempObj.title = result.book_details[0].title;
                        tempObj.author = result.book_details[0].author;
                        tempObj.publisher = result.book_details[0].publisher;
                        results.push(tempObj);
                    }
                    res.render("home", { noOfResults, results, selectVal: list });
                }
            }
        });
    }
    else res.render("home", { noOfResults: "0", selectVal: "sports" });
});

app.get("*", (req, res) => {
    res.send("Invalid Page Requested");
});

app.listen(3000, () => {
    console.log("Big Brother is listening");
});
