const express = require("express"),
      request = require("request")
      app = express();

let URL = "http://api.nytimes.com/svc/books/v3/lists";
const key = "f3f3b41cc93a40b8a7869ddbdd0b6bb5";

// set ejs
app.set("view engine", "ejs");

// set stylesheets and other static assets from public
app.use(express.static(__dirname + "/public"));

// sort in descending order
function compare(a,b) {
  if (a.rank < b.rank)
    return 1;
  if (a.rank > b.rank)
    return -1;
  return 0;
}

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
                    let topSellerURL = "";
                    let results = [];
                    for(let result of parsedBody.results) {
                        let tempObj = {};
                        tempObj.rank = parseInt(result.rank);
                        tempObj.published_date = result.published_date;
                        tempObj.title = result.book_details[0].title;
                        tempObj.author = result.book_details[0].author;
                        tempObj.publisher = result.book_details[0].publisher;
                        tempObj.isbn10 = result.book_details[0].primary_isbn10;
                        results.push(tempObj);
                    }
                    request(`https://www.googleapis.com/books/v1/volumes?q=isbn:${results[0].isbn10}`, (err, response, body) => {
                        if(err) {
                            console.error(err);
                        } else {
                            if(response.statusCode == 200) {
                                const parsedBody = JSON.parse(body);
                                topSellerURL = parsedBody.items[0].volumeInfo.imageLinks.thumbnail;
                            }
                        }
                        results.sort(compare);
                        // console.log({topSellerURL});
                        res.render("home", { noOfResults, results, selectVal: list, topSellerURL });
                    });
                }
            }
        });
    }
    else res.render("home", { noOfResults: "0", selectVal: "sports", topSellerURL: "" });
});

app.get("*", (req, res) => {
    res.send("Invalid Page Requested");
});

// app.listen(3000, () => {
//     console.log("Big Brother is listening");
// });

app.listen(process.env.PORT, process.env.IP, function () {
    console.log("Big Brother is Listening!");
});
