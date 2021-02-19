const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static(__dirname + "/views")); //views is our directory
app.set("view-engine", "html"); //html is our view engine

const port = 3000;
//optional function to be called when app starts listening
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

app.get("/", (req, res) => {
  res.render("index.html", { showOpeningModal: true, pageDisplay: "projects" });
});

app.get("/projects", (req, res) => {
  res.render("index.html", {
    showOpeningModal: false,
    pageDisplay: "projects",
  });
});

app.get("/about", (req, res) => {
  res.render("about.html", { pageDisplay: "about" });
});

app.get("/loading-screen", (req, res) => {
  res.render("loading.html");
});

//=========================================>>
//=====================Funhouse============>>
app.get("/projects/robothouse-funhouse", (req, res) => {
  res.render("projects/robothouse-funhouse/funhouse-index.html");
});

//=========================================>>
//=====================WINE================>>
const path = require("path");
const { spawn } = require("child_process");
/**
 * Run python myscript, pass in `-u` to not buffer console output
 * @return {ChildProcess}
 */
function runScript(name) {
  process.env.PATH = "/usr/local/bin/:" + process.env.PATH; //spawn eonet errors meant we have to point PATH to where python 3.7 is installed

  return spawn("python3.7", [
    "-u",
    path.join(__dirname, "/views/projects/wine/python/generator.py"),
    name,
  ]);
}

const winePath = "/projects/wine";
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: "application/*+json" }));

app.get(winePath, (req, res) => {
  res.render("projects/wine/wine-index.html", { review: false, name: false });
});

app.post(winePath + "/describe", (req, res) => {
  var name = req.body.name;
  var splitStr = name.toLowerCase().split(" ");
  //capitalise wine name
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  let capitalisedName = splitStr.join(" ");
  const subprocess = runScript(capitalisedName);
  var out = false; //switch when we get our first output as we only want one
  try {
    subprocess.stdout.on("data", (results) => {
      // main process
      if (!out) {
        out = true;
        console.log(`output:${results}`);
        let reviews = results
          .toString()
          .split("\n")
          .filter((result) => result.length != 0);
        let firstReview = reviews[0];
        let restOfReviews = reviews.slice(1);
        let reviewString = restOfReviews.join();
        let maxReviewSize = 270;
        console.log("firstReview:", firstReview);
        console.log("reviewString:", reviewString);
        if (firstReview.length < 70) {
          reviewString.split(".").forEach((sentence) => {
            sentence = sentence.replace(/(^,)|(,$)/g, ""); //remove any commas at the start or end
            sentence = sentence.trim(); //remove any whitespace
            let bigger = firstReview + " " + sentence + ". ";
            if (bigger.length > maxReviewSize) {
              return;
            }
            console.log("making bigger: ", bigger);
            firstReview = bigger;
          });
        } else if (firstReview.length > maxReviewSize) {
          //loop through each sentence and find most we can get before 345 chars
          let retVal = "";
          firstReview.split(".").forEach((sentence) => {
            sentence = sentence.replace(/(^,)|(,$)/g, ""); //remove any commas at the start or end
            sentence = sentence.trim(); //remove any whitespace
            if (sentence.length > 0) {
              let smaller = retVal + sentence + ". ";
              if (smaller.length > maxReviewSize) {
                return;
              }
              console.log("making smaller, so far:  ", smaller);
              retVal = smaller;
            }
          });
          firstReview = retVal;
        }
        res.render("projects/wine/wine-index.html", {
          review: firstReview,
          name: name,
        });
      }
    });
    subprocess.stderr.on("data", (error) => {
      console.log(`error:${error}`);
    });
    subprocess.stderr.on("close", () => {
      console.log("Closed");
    });
  } catch (err) {
    console.log("error!!", err);
    res.render("projects/wine/wine-index.html", {
      review:
        "The wine carries spices of an unexpected error, with a hint of try-again-later. Drink through 2020.",
      name: "A fine error",
    });
  }
});
