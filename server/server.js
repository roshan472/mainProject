
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");


const Razorpay = require("razorpay");

razorpay = new Razorpay({
    key_id: "rzp_test_5x82urML6UdoaR",
    key_secret: "KlOeJ3iPQxBiPJcH7Fh5dSqX",
});

const shortid = require("shortid");



const app = express();

app.use(express.json());
app.use(cors());






const conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'auction',
    });

    

// payment 

    app.post('/razorpay', async (req,res)=>{
        
        
        const payment_capture = 1;
        const currency = "INR";
        const amount = req.body.amt;
        console.log("Amount To register:"+amount);
        const options = {
            amount: amount*100,
            currency: currency,
            receipt: shortid.generate(),
            payment_capture,
        };

        try {

            const response = await razorpay.orders.create(options);
            console.log(response);
            res.json({
                id: response.id,
                currency: res.currency,
                amount: res.amount,
            });
        } catch(error){
            console.log(error);
        }
    });

    //get status

    app.post('/getStatus',(req,res)=>{

        const id = req.body.id;
        const value = req.body.value;
        conn.query("call regStatus(?,?)",
        [id,value],
        (err,result) => {
    
                if(err){
                    conosle.log(err);
                }
    
                if(result.length > 0 ) {
                    console.log(result);
                    res.send(result);
                }else{
                    console.log("No data");
                 }
                });
            });


   // bidStatus

   app.post('/bidStatus',(req,res)=>{

    const mid = req.body.id;
    conn.query("call BidStatus(?)",
    [mid],
    (err,result) => {

            if(err){
                conosle.log(err);
            }

            if(result.length > 0 ) {
                console.log(result);
                res.send(result);
            }else{
                console.log("No data");
             }
            });
        });

   // team display
    app.post('/teamDisplay',(req,res)=>{

        const mid = req.body.matchid;
        conn.query("call TeamDisplay(?)",
        [mid],
        (err,result) => {

                if(err){
                    conosle.log(err);
                }

                if(result.length > 0 ) {
                    console.log(result);
                    res.send(result);
                }else{
                    console.log("No data");
                }
        });
    });

    // getamt

    app.post('/getamt',(req,res)=>{

        
        const mid = req.body.mid;
        const value = req.body.value;
        conn.query("call getAmt(?,?)",
        [mid,value],
        (err,result) => {

                if(err){
                    conosle.log(err);
                }

                if(result.length > 0 ) {
                    console.log(result);
                    res.send(result);
                }else{
                    console.log("No data");
                }
        });
    });

    

    app.post('/getPos',(req,res)=>{

        conn.query("select * from tbl_position",
        (err,result) => {

                if(err){
                    conosle.log(err);
                }

                if(result.length > 0 ) {
                    console.log(result);
                    res.send(result);
                }else{
                    console.log("No data");
                }
        });
    });

    app.post('/checkEmail',(req,res)=>{

        const email = req.body.email;
        conn.query("call CheckEMail(?)",
        [email],
        (err,result) => {

                if(err){
                    conosle.log(err);
                }

                if(result.length > 0 ) {
                    console.log(result);
                    res.send(result);
                }else{
                    console.log("Somethig went Wrong!");
                }
        });
    });

    // get Registration status 

    app.post('/getStatusTeam',(req,res)=>{

        const id = req.body.id;
        conn.query("select team_reg_status from tbl_match where match_id = ?",
        [id],
        (err,result) => {

                if(err){
                    conosle.log(err);
                }

                if(result.length > 0 ) {
                    console.log(result);
                    res.send(result);
                }else{
                    console.log("Somethig went Wrong!");
                }
        });
    });

    // player Registration 
    app.post('/playerreg', (req,res) => {

        const username = req.body.username;
        const password = req.body.password;
        const fname = req.body.fname;
        const lname = req.body.lname;
        const base64v = req.body.base64v;
        const position = req.body.pos;
        const Number = req.body.phoneNo;
        const matchid = req.body.match;
    
        conn.query("call playerReg(?,?,?,?,?,?,?,?)",
            [username,password,fname,lname,position,base64v,Number,matchid],
                (err,result) => {
                    //res.send(result)
                    if(err){ 
                        console.log(err);
                    }
                    if(result.length > 0){
                        console.log(result);
                        res.send(result);
                        // res.send({message:0}); 
                    }else{
                        console.log("Account Already Exist");
                        res.send({message:'Account Already Exist!'});
                    }
            });
    });

    //Team insert

    app.post('/regTeam', (req,res) => {

        const username = req.body.username;
        const password = req.body.password;
        const fname = req.body.fname;
        const lname = req.body.lname;
        const base64v = req.body.base64v;
        const Number = req.body.phoneNo;
        const matchid = req.body.match;
    
        conn.query("call Teamreg(?,?,?,?,?,?,?)",
            [username,password,fname,lname,base64v,Number,matchid],
                (err,result) => {
                    //res.send(result)
                    if(err){ 
                        console.log(err);
                    }
                    if(result.length > 0){
                        console.log(result);
                        res.send(result);
                        // res.send({message:0}); 
                    }else{
                        console.log("Account Already Exist");
                        res.send({message:'Account Already Exist!'});
                    }
            });
    });

    //update player

    app.post('/playerUpdate', (req,res) => {

        const username = req.body.username;
        const password = req.body.password;
        const fname = req.body.fname;
        const lname = req.body.lname;
        const position = req.body.pos;
        const Number = req.body.phoneNo;
        const matchid = req.body.match;
        const id = req.body.id;
    
        conn.query("call UpdatePlayer(?,?,?,?,?,?,?,?)",
            [username,password,fname,lname,position,Number,matchid,id],
                (err,result) => {
                    //res.send(result)
                    if(err){ 
                        console.log(err);
                    }
                    if(result.length > 0){
                        console.log(result);
                        res.send(result);
                        // res.send({message:0}); 
                    }else{
                        console.log("Account Already Exist");
                        res.send({message:'Account Already Exist!'});
                    }
            });
    });


    // Team update

    app.post('/TeamUpdate', (req,res) => {

        const username = req.body.username;
        const password = req.body.password;
        const fname = req.body.fname;
        const lname = req.body.lname;
        const Number = req.body.phoneNo;
        const matchid = req.body.match;
        const id = req.body.id;
    
        conn.query("call UpdateTeam(?,?,?,?,?,?,?)",
            [username,password,fname,lname,Number,matchid,id],
                (err,result) => {
                    //res.send(result)
                    if(err){ 
                        console.log(err);
                    }
                    if(result.length > 0){
                        console.log(result);
                        res.send(result);
                        // res.send({message:0}); 
                    }else{
                        console.log("Account Already Exist");
                        res.send({message:'Account Already Exist!'});
                    }
            });
    });


    // Displaying Host
    app.post('/hostdisplay',(req,res)=>{

        conn.query("select * from tbl_host",(err,result)=>{
            if(err){
                console.log(err);
            }else if(result.length > 0){
                console.log(result);
                res.send(result);
            }else{
                console.log("No data!");
            }
        });

    });

    // Display player
    app.post('/playerdisplay',(req,res)=>{
        
        const mid = req.body.m_id;
        conn.query("call playerDisplay(?)",
        [mid],
        (err,result)=>{
            if(err){
                console.log(err);
            }else if(result.length > 0){
                console.log(result);
                res.send(result);
            }else{
                console.log("No data!");
            }
        });

    });

    //match display

    app.post('/matchDetails',(req,res)=>{
        const id = req.body.id;
        conn.query("call matchdisplay(?)",
         [id],
        (err,result)=>{
            if(err){
                console.log(err);
            }else if(result.length > 0){
                console.log(result);
                res.send(result);
            }else{
                console.log("No data!");
            }
        });

    });

    // get Category

    app.post('/getCat',(req,res)=>{
        conn.query("select * from tbl_category",
        (err,result)=>{
            if(err){
                console.log(err);
            }else if(result.length > 0){
                console.log(result);
                res.send(result);
            }else{
                console.log("No data!");
            }
        });

    });

    // Host Registration

    app.post('/hostreg', (req,res)=>{
        
    const username = req.body.username;
    const password = req.body.password;
    const fname = req.body.fname;
    const lname = req.body.lname;

    conn.query("call registerHost(?,?,?,?)",
        [username,password,fname,lname],
            (err,result) => {
                //res.send(result)
                if(err){ 
                    console.log(err);
                }
                if(result.length > 0){
                    console.log(result);
                    res.send(result);
                    // res.send({message:0});
                }else{
                    console.log("Account Already Exist");
                    res.send({message:'Account Already Exist!'});
                }
        });
    });


    // team activate / Deactivate

    app.post('/TeamStatus' , (req,res) => {
        const id = req.body.id;
        const status = req.body.status;
        conn.query("call tactivate(?,?)",
        [id,status],
            (err,result) => {
                //res.send(result)
                if(err){ 
                    console.log(err);
                }
                if(result.length > 0){
                    console.log(result);
                    res.send(result);
                    // res.send({message:0});
                }else{
                    console.log("No user found!");
                    res.send({message:'User Not Found!'});
                }
        });
    });

    //activate player

    app.post('/activatePlayer' , (req,res) => {
        const id = req.body.id;
        conn.query("call pactivate(?)",
        [id],
            (err,result) => {
                //res.send(result)
                if(err){ 
                    console.log(err);
                }
                if(result.length > 0){
                    console.log(result);
                    res.send(result);
                    // res.send({message:0});
                }else{
                    console.log("No user found!");
                    res.send({message:'User Not Found!'});
                }
        });
    });

    //Deactivate player

    app.post('/DeactivatePlayer' , (req,res) => {
        const id = req.body.id;
        conn.query("call pdeactivate(?)",
        [id],
            (err,result) => {
                //res.send(result)
                if(err){ 
                    console.log(err);
                }
                if(result.length > 0){
                    console.log(result);
                    res.send(result);
                    // res.send({message:0});
                }else{
                    console.log("No user found!");
                    res.send({message:'User Not Found!'});
                }
        });
    });
    
    //insert Poition

    app.post('/InsertPos' , (req,res) => {

        
        const Posname = req.body.pos_value;
        conn.query("call insertPos(?)",
        [Posname],
            (err,result) => {
                if(err){ 
                    console.log(err);
                }
                if(result.length > 0){
                    console.log(result);
                    res.send(result);
                    // res.send({message:0});
                }else{
                    console.log("No position found!");
                    res.send({message:'position Not Found!'});
                }
        });
    });

    //update Poition

    app.post('/updatePos' , (req,res) => {

        const pos_id = req.body.pos_id;
        const Posname = req.body.pos_value;
        conn.query("call UpdatePos(?,?)",
        [pos_id,Posname],
            (err,result) => {
                if(err){ 
                    console.log(err);
                }
                if(result.length > 0){
                    console.log(result);
                    res.send(result);
                    // res.send({message:0});
                }else{
                    console.log("No position found!");
                    res.send({message:'position Not Found!'});
                }
        });
    });

    // delete position

    app.post('/delPos' , (req,res) => {

        
        const posid = req.body.pos_id;
        conn.query("call deletePos(?)",
        [posid],
            (err,result) => {
                if(err){ 
                    console.log(err);
                }
                if(result.length > 0){
                    console.log(result);
                    res.send(result);
                    // res.send({message:0});
                }else{
                    console.log("position Not Found!");
                    res.send({message:'position Not Found!'});
                }
        });
    });

    // match activity

    app.post('/Activate' , (req,res) => {
        const status = req.body.status;
        const tbl_name = req.body.tbl_name;
        const id = req.body.matchid;
        conn.query("call mactivate(?,?,?)",
        [status,tbl_name,id],
            (err,result) => {
                //res.send(result)
                if(err){ 
                    console.log(err);
                }
                if(result.length > 0){
                    console.log(result);
                    res.send(result);
                    // res.send({message:0});
                }else{
                    console.log("Something went Wrong!");
                    res.send({message:'Something went Wrong!'});
                }
        });
    });
      
    // < -------------------------------------->

    
    // add match 

    app.post('/addMatch' , (req,res) => {

        const id = req.body.id;
        const fname = req.body.fname;
        const lname = req.body.lname;
        const cat_id = req.body.cat_id;
        const treg_fee = req.body.treg_fee; 
        const preg_fee = req.body.preg_fee;
        const tbid_amt = req.body.tbid_amt;

        conn.query("call addmatch(?,?,?,?,?,?,?)",
        [fname,lname,cat_id,treg_fee,preg_fee,tbid_amt,id],
            (err,result) => {
                if(err){ 
                    console.log(err);
                }
                if(result.length > 0){
                    console.log(result);
                    res.send(result);
                    // res.send({message:0});
                }else{
                    console.log("position Not Found!");
                    res.send({message:'position Not Found!'});
                }
        });
    });

    

    //update match

    app.post('/updateMatch' , (req,res) => {

        const id = req.body.id;
        const fname = req.body.fname;
        const lname = req.body.lname;
        const cat_id = req.body.cat_id;
        const treg_fee = req.body.treg_fee; 
        const preg_fee = req.body.preg_fee;
        const tbid_amt = req.body.tbid_amt;
        const match_id = req.body.matchid;

        conn.query("call updateMatch(?,?,?,?,?,?,?,?)",
        [fname,lname,cat_id,treg_fee,preg_fee,tbid_amt,id,match_id],
            (err,result) => {
                if(err){ 
                    console.log(err);
                }
                if(result.length > 0){
                    console.log(result);
                    res.send(result);
                    // res.send({message:0});
                }else{
                    console.log("position Not Found!");
                    res.send({message:'position Not Found!'});
                }
        });
    });


    // get match Details

    app.post('/getMatch' , (req,res) => {
        const id = req.body.id;
        conn.query("call getMatchDetails(?)",
        [id],
            (err,result) => {
                if(err){ 
                    console.log(err);
                }
                if(result.length > 0){
                    console.log(result);
                    res.send(result);
                    // res.send({message:0});
                }else{
                    console.log("No match Found!");
                    res.send({message:'No match Found!'});
                }
        });
    });


    // login player

    app.post('/login' , (req,res) => {

        const username = req.body.username;
        const password = req.body.password;
        conn.query("call login(?,?)",
        [username,password],
            (err,result) => {
                //res.send(result)
                if(err){ 
                    console.log(err);
                }
                if(result.length > 0){
                    console.log(result);
                    res.send(result);
                    // res.send({message:0});
                }else{
                    console.log("No user found!");
                    res.send({message:'User Not Found!'});
                }
        });
    });

    app.listen(3001,() => {
        console.log("Listening on port 3001");
    });
