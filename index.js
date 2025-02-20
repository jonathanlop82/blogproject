import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const siteTitle = "Blog Home";

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", async (req, res) => {
    
    const page = 1;
    const response = await fetch('http://localhost:8000/posts');
    const posts = await response.json();

    const countPosts = posts.length;

    // console.log(countPosts);

    res.render("index.ejs", { siteTitle: siteTitle, posts: posts, countPosts: countPosts, page: page });
  });

app.get("/page:id", async (req, res) => {

    const page = req.params.id;
    const response = await fetch('http://localhost:8000/posts');
    const posts = await response.json();

    const countPosts = posts.length;

    // console.log(page);

    res.render("index.ejs", { siteTitle: siteTitle, posts: posts, countPosts: countPosts, page: page });
});

app.get("/posts", async (req, res) => {
   
    const response = await fetch('http://localhost:8000/posts');
    const posts = await response.json();

    res.render("posts.ejs", { siteTitle: siteTitle, posts: posts });
  });

app.get("/post:id", async (req, res) => {
    const id = req.params.id;
    const response = await fetch(`http://localhost:8000/posts`);
    const posts = await response.json();
    res.render("post.ejs", { siteTitle: siteTitle, title: posts[id].title, content: posts[id].content, date: posts[id].created_at });
});


app.get("/about", (req, res) => {
    res.render("about.ejs", { siteTitle: siteTitle });
});

app.get("/create", (req, res) => {
    res.render("create.ejs", { siteTitle: siteTitle });
});


app.post("/submit", (req, res) => {
    
    const data = {
        title : req.body.title,
        content : req.body.content,
        user_id : 1,
        state : "public"
    };
    
    fetch('http://localhost:8000/posts/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // Convertir objeto a JSON
    })
    .then(response => response.json()) // Convertir la respuesta a JSON
    .then(result => console.log('Success:', result))
    .catch(error => console.error('Error:', error));


    res.render("create.ejs", { siteTitle: siteTitle });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
