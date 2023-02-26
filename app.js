const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set('strictQuery',false);
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {useNewUrlParser: true});


const wikiSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Articles = mongoose.model('Articles',  wikiSchema);

app.route("/articles")
.get(function(req, res){
    Articles.find({}, function(err, res){
        if (err) {
            console.log(err);
        } else {
            console.log(res);
        }
    });
})
.post(function(req, res){
    const newArticles = new Articles({
        title:req.body.title,
        content:req.body.content
    });

    newArticles.save(function(err){
        if(!err) {
            res.send("success");
        } else {
            res.send(err);
        }
    });
});

app.route("/articles/:userArticle")
.get(function(req, res){
    Articles.findOne({title:req.params.userArticle}, function(err, articles){
        if (res) {
            res.send(articles);
        } else {
            res.send("No matching articles");
        }
    });

})

.put(function(req, res){
    Articles.updateOne(
        {title: req.params.userArticle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
            if (!err){
                res.send("successfully updated");
            }
        }
    );
})

.patch(function(req, res){
    Articles.updateOne(
        {title: req.params.userArticle},
        {$set: req.body},
        function(err){
            if (!err){
                res.send("success");
            } else {
                res.send(err);
            }
        }
    );
})

.delete(function(req, res){
    Articles.deleteOne(
    {title: req.params.userArticle},
    function(err){
        if (err) {
            res.send("success");
        } else {
            res.send(err);
        }
    }
    );
});






app.listen(3000, function(){
    console.log("server running on port 3000");
});

