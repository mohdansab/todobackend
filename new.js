const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors =require('cors');


const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const dbURI = "mongodb://127.0.0.1:27017/crud";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password:{
    type:String,
    required:true,
  },
   email:{
    type:String,
    required:true,
   },
  
});

const Item = mongoose.model('Item', itemSchema);

// Define API routes

app.delete('/items/:id',async (req,res)=>{
    try{
    const deleteItem=await Item.findByIdAndRemove(req.params.id);
    if(!deleteItem) {
        return res.status(404).json({message:'item not found'});
    }
    res.json({message:'item deleted'})
}catch (err){
    console.error(err);
    res.status(500).json({message:'server error'})
}
}
);

app.put('/items/:id',async (req,res)=> {
    try{
        const updateItem=await Item.findByIdAndUpdate(req.params.id,
          { name:req.body.name,
            password:req.body.password,
            email:req.body.email
          },{new:true});
        if (!updateItem){
            return res.status(404).json({message:'item not fount'});
        }
        res.json(updateItem);
    }catch(err){
        console.error(err);
        res.status(500).json({message:'server error'});
    }
}
);


app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post('/items', async (req, res) => {
  const newItem = new Item({
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
  });

  try {
    const item = await newItem.save();
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
