const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const mongoose = require('mongoose');
const date = require(__dirname + "/date.js");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

// const newTodos = [];
// const impTodos = [];



 
main().catch(err => console.log(err));
 
async function main() {
    mongoose.set('strictQuery', true);
    await mongoose.connect('mongodb+srv://neeraj-todoList:test123@cluster0.uuekrwy.mongodb.net/todolistDB');
    console.log("Connected");
    const day = date.getDate();
    
  // What this will do is to create the database 'fruitsDB'
  // ALL THE CODE SHOULD BE WITHIN THE MAIN FUNCTION
  // Read the Mongoose Documentation
    const itemSchema = new mongoose.Schema({
        name: String
    });

    const Item = mongoose.model('Item', itemSchema);

    const item1 = new Item({
        name: "Welcome to  MyTodoList."
    });

    const listSchema = new mongoose.Schema({
        name: String,
        items: [itemSchema]
       });

    const List = mongoose.model('List', listSchema);
    
    app.get('/', function (req, res) {

        Item.find({}, function(err, foundItems){
            if(foundItems.length === 0 ) {
                 Item.insertMany(item1, function(err){
                    if(err) {
                        console.log(err);
                    } else {
                        
                        console.log("Items added");
                    }
                });
                
            } 
                
                res.render("list", { todoTitle: day, newListItems: foundItems });
            
        });
    
        
    });

    app.get("/:customList", function(req, res){
       const customListName = req.params.customList;


       List.findOne({name: customListName}, function(err, foundList){
        if(!err){
            if(!foundList){
                const list = new List({
                    name: customListName,
                    item: [item1]
                    
                   });
                   list.save();
                   res.redirect("/" + customListName);
            } else {
                res.render("list", { todoTitle: foundList.name, newListItems: foundList.items } )
            }
        }
       });

       

       

       

    
    } );
    
    
    
    app.post("/", function (req, res) {
        const newTodo = req.body.newItem;
        const todoName = req.body.todoName;

        const item = new Item({
            name : newTodo
        });

         if(todoName === day){
            item.save();

            res.redirect("/");
        } else {
            List.findOne({name: todoName}, function(err, result){
                result.items.push(item);
                result.save();
                res.redirect("/" + todoName);
            })
        }

        
    
    });

    app.post("/delete", function(req, res) {
        const deleteItem = req.body.deleteButton;
        const listName = req.body.listName;

        if(listName===day){
            Item.findByIdAndRemove(deleteItem, function(err){
                if(err) {
                    console.log(err);
                } else {
                    console.log("deleted")
                    res.redirect("/");
                }
                });
        } else {
            List.findOne({name: listName}, function(err, result){
                result.items.pull(deleteItem);
                result.save();
                res.redirect("/" + listName);

        });

        List.findOneAndUpdate({name: listName},{$pull: {items: {_id: deleteItem}}},{function(err, result){
            if(!err){
                result.save();
                res.redirect("/" + listName);
                
            }
        }})
    }

        

       

    });
    
    
    
    app.get("/about", function (req, res) {
        res.render("about");
    });
    
    





    app.listen(process.env.PORT || 3000, () => {
        console.log('Listening on port 3000');
    });






}




