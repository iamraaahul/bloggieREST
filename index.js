const express          = require('express'),
      bodyParser       = require('body-parser'),
      mongoose         = require('mongoose'),
      methodOverride   = require('method-override'),
      expressSanitizer = require('express-sanitizer');
 

//Setting Up Exprss
const app = express();


//Setting Up Mongo
mongoose.connect('mongodb://localhost/restful_blog_app');
mongoose.Promise = global.Promise;

//view engine
app.set('view engine', 'ejs');

//for static file
app.use(express.static('public'));


//for gettin the form data
app.use(bodyParser.urlencoded({extended: true}));

//Using Method Overriding
app.use(methodOverride("_method"));

//Using sanitizer use after body parser
app.use(expressSanitizer());


//Blog S chema
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body:  String,
    created: {
        type: Date,
        default: Date.now
    }
});


//Blog model
const Blog = mongoose.model('Blog', blogSchema);




//Routes
app.get("/", (req, res) => {
    res.redirect("/blogs");
})


app.get("/blogs", (req, res) => {

    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log("err");
        } else {
            res.render('index', {
                blogs: blogs
            });
        }
    });

});




app.get("/blogs/new", (req, res) => {

    res.render("new");
});




app.post("/blogs", (req, res) => {

    req.body.blog.body = req.sanitize(req.body.blog.body);
    
    Blog.create(req.body.blog, (err, newBlog) => {
        if (err) {
            res.render('new');
        } else {
            res.redirect('/blogs');
        }
    });
});



app.get("/blogs/:id", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err) {
            res.redirect('/blogs');
        }
        else {
            res.render("show", {blog : foundBlog});
        }
    });
});


//EDIT ROUTE
app.get("/blogs/:id/edit", (req, res) => {
    
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err) {
            res.redirect("/blogs");
        }
        else {
            res.render("edit", {blog : foundBlog});
        }
    });
});


//UPDTE
app.put("/blogs/:id", (req, res) => {
    
    req.body.blog.body = req.sanitize(req.body.blog.body);
    
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if(err) {
            res.redirect("/blogs");
        }
        else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});


//DESTROY
app.delete("/blogs/:id", (req, res) => {
    Blog.findByIdAndRemove(req.params.id, (err) => {
        if(err) {
            res.redirect("/blogs");
        }
        else {
            res.redirect("/blogs");
        }
    });

});

 



//srver listennig
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is Up and Running.");
});