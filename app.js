const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const _=require("lodash");

const app=express();
const port=3000;
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');
// mongoose.connect("mongodb://127.0.0.1:27017/todo-list");this is to connect in locally
mongoose.connect("mongodb+srv://Nemmy:Abhishek%2301@cluster0.3bzv5pu.mongodb.net/todo-list");

const itemSchema={
name:String
}
const Item=mongoose.model("Item",itemSchema);

const item1=new Item({
name:"Buy Food"
});

const item2=new Item({
  name:"Cook Food"
  });

const item3=new Item({
    name:"Eat Food"
    });

const defaultItems=[item1,item2,item3];

const listSchema={
  name:String,
  items:[itemSchema]
}
const List=mongoose.model("List",listSchema);

app.get("/",function(req,res){
  Item.find({}).then(function(items){ 
    if(items.length === 0){
      Item.insertMany(defaultItems).then(()=>{
        console.log("inserted successfully");
      }).catch((err)=>{
        console.log(err);
      })
      res.redirect("/");
    }else{
    res.render('list',{ListTitle:"Today",newListItem:items});}
  }).catch(function(err){
    console.log(err);
  })
})

app.get("/:customListName",(req,res)=>{
  const customListName= _.capitalize(req.params.customListName);
  List.findOne({name:customListName}).then(function(foundList){
    if(!foundList){
      const list=new List({
        name:customListName,
        items:defaultItems
      });
      list.save();
      res.redirect("/"+customListName)
    }else{
      res.render('list',{ListTitle:foundList.name,newListItem:foundList.items});
    }
  }).catch(function(err){
    console.log(err);
  })

})

app.post("/",(req,res)=>{
let item=new Item({name:req.body.newItem});
let listitem=req.body.list;
  if(listitem==="Today"){
    item.save();
    res.redirect("/");
  }else{
    List.findOne({name:listitem}).then(function(foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+listitem);
    })
  }

});
app.get("/about",(req,res)=>{
res.render("about");
});
app.post("/delete",function(req,res){
  const checkedItem_Id=req.body.checkbox;
  const listName=req.body.listName;
  
  if(listName==="Today"){
    Item.findByIdAndRemove(checkedItem_Id).catch((err)=>{
      console.log(err);
    })
    res.redirect("/");
  }else{
    
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItem_Id}}},{new:true}).then(function(){
        res.redirect("/" +listName);
    }).catch((err)=>{
      console.log(err);
    })
           
    }
    
  }
);
app.listen(port,()=>{
console.log(`server is running on port ${port}`);
})

// you can have custom list
// example: localhost:3000/"name of list"
// and there is about page as well