const mongoose=require('mongoose');
const mongoURl="mongodb+srv://pradeep22320105:Pradeep%401234@cluster0.xo3ijqv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});
const db=mongoose.connection;
db.on("connected",()=>{
    console.log("Successfully DB Connected");
});
db.on("disconnected",()=>{
    console.log(" Disconnected DB");
});
db.on("error",(err)=>{
    console.log(err);
});
module.exports={
    db
};