const express = require("express");
const users = require("./MOCK_DATA (1).json")
const app = express();
const fs = require("fs")
const port = 8000
//plugin or middleware
app.use(express.urlencoded({extended : false}));
//routes
//to get html data on /users (for demo purpose)
app.get("/users" , (req, res) => {
    /*
    <ul>
        <li> Piyush garg </li>
    */
    const html = `
    <ul>
        ${users.map(user => `<li>${user.first_name} </li>`).join("")}
    </ul>
    `;
    res.send(html)
})
//to get json data, we'll use path /api
app.get('/api/users' , (req, res) => {
    return res.json(users);
})
app.post("/api/users" , (req , res) => {
    //todo - create new users.
    const body = req.body;
    //inserting the data into the users json file.
    users.push({...body , id: users.length + 1});
    fs.writeFile("./MOCK_DATA (1).json" , JSON.stringify(users) , (err) => {
        if(err){
            console.log("error");
            return res.json({status : "error"});
        }
        return res.json({status : "success", id : users.length});
    });
});
app.patch("/api/users/:id" , (req, res) => {
    //todo - edit the user with id
    // first_name
    // last_name
    // email
    // gender
    // job_title
    // how to extract these?? body
    const body = req.body;
    const userid = parseInt(req.params.id);
    //find the id in the users.
    const index = users.findIndex(u => u.id === userid);
    if(index === -1){
        return res.status(404).json({status: "error"});
    }
    //makes changes in the index id given.
    users[index] = {...users[index] , ...body};
    fs.writeFile("./MOCK_DATA (1).json" , JSON.stringify(users) , (err) => {
        if(err){
            console.log("error");
            return res.json({status : "error"});
        }
        return res.json({status : "success" , id : userid});
    })
});
app.delete("/api/users/:id" , (req, res) => {
    const body = req.body;
    const userid = parseInt(req.params.id);
    //find the id in the users.
    const index = users.findIndex(u => u.id === userid);
    if(index === -1){
        return res.status(404).json({status: "error"});
    }
    //delete the user with given index
    users.splice(index , 1);
    fs.writeFile("./MOCK_DATA (1).json" , JSON.stringify(users) , (err) => {
        if(err){
            console.log("error");
            return res.json({status : "error"});
        }
        return res.json({status : "success" , id : userid});
    })
});
//to dynamically get users, we use : colon.
// app.get("/api/users/:id" , (req, res) => {
//     const id = Number(req.params.id); //used to read the id requested.
//     const user = users.find((user) => user.id === id); //we are fetching the required id in json file.
//     return res.json(user);
// })
// app.patch("/api/users/:id" , (req, res) => {
//     //todo - edit the user with id
//     return res.json({status : "pending"});
// })
// app.delete("/api/users/:id" , (req, res) => {
//     //todo - delete the user with id
//     return res.json({status : "pending"});
// })
//we can notice patch, delete and get have same paths
//we can use the route function
// app.route("/api/users/:id")
//     .get((req, res) => {
//     const id = Number(req.params.id); //used to read the id requested.
//     const user = users.find((user) => user.id === id); //we are fetching the required id in json file. 
//     return res.json(user);
//     })
//     .patch((req, res) => {
//     //edit the user with id
//     res.json({status : "pending"});
//     })
//     .delete((req, res) => {
//     res.json({status : "pending"});
//     })
app.listen(port, () => {
    console.log("Server started at port : " + port);
})