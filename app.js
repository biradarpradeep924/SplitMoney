const express=require('express')
const nodemon=require('nodemon')
const dotenv=require('dotenv').config();
const app=express()
const db=require('./db')
const login=require('./models/login.js')
const jwt=require('./token.js');
const Expense=require('./models/Expense.js');
const getUserBalanceSheetByName=require('./balancesheet');
app.use(express.json());

app.get('/balance/:name', async (req, res) => {
    try {
      const name = req.params.name;
      const balance = await getUserBalanceSheetByName(name);
      res.json(balance);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  });
  
app.post('/expenses', async (req, res) => {
    try {
      const { amount, paidBy, description, peopleInvolved, splitDetails } = req.body;
  
      // Validation
      if (!amount || !paidBy || !peopleInvolved || peopleInvolved.length === 0) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      // Auto-generate equal split if splitDetails is not provided
      let generatedSplit = splitDetails;
      if (!splitDetails || splitDetails.length === 0) {
        const share = parseFloat((amount / peopleInvolved.length).toFixed(2));
        generatedSplit = peopleInvolved.map(person => ({
          name: person,
          amount: share
        }));
      }
  
      const expense = new Expense({
        amount,
        paidBy,
        description,
        peopleInvolved,
        splitDetails: generatedSplit
      });
  
      const saved = await expense.save();
      res.status(201).json(saved);
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
app.get('/signup',(req ,res)=>{
   res.send("Welcom to Split");
});

app.post('/pay',async(req,res)=>{
    try{
   const data=req.body;
   const newPerson=new paid(data);
   const response=await newPerson.save();
   console.log("data Saved");
    res.status(200).json({response});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json(err,'Internal server error');
    }
})
app.post('/signup',async(req,res)=>{
    try{
   const data=req.body;
   const newPerson=new login(data);
   const response=await newPerson.save();
   console.log("data Saved");
   const payload={
    id:response.id,
    name:response.name
   }
   console.log(JSON.stringify(payload));
   const token=jwt.generateToken(payload);
  
   console.log("token is",token);
      res.status(200).json({response:response,token:token});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json(err,'Internal server error');
    }
})
//login routes
app.post('/login', async (req, res) => {
    try {
        const { name, password } = req.body;
        const user = await login.findOne({ name });

        if (!user ) {
            //|| !(await user.comparePassword(password))
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const payload = {
            id: user._id,
            name: user.name
        };

        const token = jwt.generateToken(payload);
        res.status(200).json({ token, user: payload });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(5005,()=>{
    console.log("listening on port 5005");
})

