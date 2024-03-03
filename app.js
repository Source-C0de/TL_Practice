const { json } = require('body-parser');
const express = require('express');
const con = require('./dbConnection');
const app = express();
const Port = 3000;

const createModel = require('./Controller/view');
app.use(express.json());

app.get("/", async (req,res) => {
    try {
        const user = await createModel.view();
        res.status(201).json(user);
    }catch{
        res.status(500).send('Error showing data');
    }
});

app.post("/user",(req,res) => {
    let name = req.body.name;
    let task_id = req.body.task_id;
    let cDate = req.body.created_date;
    let cBy = req.body.created_by;
    let st;
    console.log({"Hello ": task_id});
    con.query("Select status as st from task_status where task_id In (?) order by task_status_id desc limit 1",[task_id],(err,result) =>{
        if(err) throw err; 
        st = result[0].st;
        console.log({"st ":st});
        if (st==="New" || st==="Finished") {
            con.query("insert into user(name,task_id,created_date,created_by) values(?,?,?,?)",[name,task_id,cDate,cBy],(err,re) =>{
                if(err) throw err;
                res.send("Inserted");
            });
            let status = "Assigned";
            con.query("insert into task_status(task_id,status,created_date,created_by) values(?,?,?,?)",[task_id,status,cDate,cBy],(err,res) =>{
                if(err) throw err;
                console.log(result);
            });
        }else{
            let status = "Already Assigned";
            con.query("insert into task_status(task_id,status,created_date,created_by) values(?,?,?,?)",[task_id,status,cDate,cBy],(err,result) =>{
                if(err) throw err;
                console.log(result);
            });
            res.send("Not to be inserted");
        }
    });
});

app.put("/user/:user_id",(req,res) =>{
    const id = req.params.user_id;
    let task_id = req.body.task_id;
    console.log({"Id is :":id});
    con.query("Select status as st, task_id as tid from task_status where task_id in (?) order by task_status_id desc limit 1",[task_id],(err,result) =>{
        let st = result[0].st;
        let p_id = result[0].tid;
        console.log({"previous id: ": p_id});
        if(st==='Assigned'){
            res.send("Task Already Assigned");
        }else{

            con.query('Update user set task_id= ? where user_id = ?',[task_id,id],(err,result2) =>{
               if(err) throw err;
               let created_date = '2023-04-10';
                    let created_by = "rafiul";
                    let t_id = task_id;
                    console.log({"Hello : ": t_id});
                    res.send("Updated Successfully");
                    con.query('Insert into task_status(task_id,status,created_date,created_by) values(?,?,?,?),(?,?,?,?)',[p_id,"Finished",created_date,created_by,t_id,'Assigned',created_date,created_by],(err,result3) => {
                        if(err) throw err;
                        res.send("Inserted");
                    });
                
            });
        }
    });
});

app.post("/task",(req,res) => {
    let task_name = req.body.task_name;
    let cId = req.body.category_id;
    let cDate = req.body.created_date;
    let cBy = req.body.created_by;
    let udate = req.body.updated_date;
    let uBy = req.body.updated_by;
    let status = "New";
    let t_id;
    con.query("insert into task(task_name,category_id,created_date,created_by,updated_date,updated_by) values(?,?,?,?,?,?)",[task_name,cId,cDate,cBy,udate,uBy],(err,resu) =>{
            try{
                con.query("Select MAX(task_id) as maxId from task",(err,res)=>{
                    try{
                        let maxId = res[0].maxId;
                        t_id = maxId;
                        con.query("insert into task_status(task_id,status,created_date,created_by) values(?,?,?,?)",[t_id,status,cDate,cBy],(err,result1) =>{
                            if(err) throw err;
                            console.log(result1);
                        });
                    }catch{
                        throw err;
                    }
                });        
                res.send("Inserted");
            }catch{
                throw err;
            }
     });    
});

app.post("/finish",(req,res) =>{
    let t_id = req.body.task_id;
    let status = req.body.status;
    let cDate = req.body.created_date;
    let cBy = req.body.created_by;
    con.query("select status as st from task_status where task_id in (?) order by task_status_id desc limit 1",[t_id],(err,result) =>{
        let st = result[0].st;
        try{
            if(st==="Already Assigned" || st==="Assigned"){
                con.query("insert into task_status(task_id,status,created_date,created_by) values(?,?,?,?)",[t_id,status,cDate,cBy],(err,result) => {
                    res.send("Inserted");
                });
            }
            else{
                res.send("Not Assigned Yet");
            }
        }catch{
            throw err;
        }
        
    });
    
});

app.post("/category",(req,res)=>{
    let name = req.body.name;
    let cDate = req.body.created_date;
    let cBy = req.body.created_by;

    con.query("insert into category(name,created_date,created_by) values(?,?,?)",[name,cDate,cBy],(err,result) =>{
        if(err) throw err;
        res.send(result);
    });
});


// app.get("/view",(req,res) =>{
//     con.query("select * from login", function  (err, result, fields) {
//         if(err) throw err;
//         // console.log(result);
//         res.send(result);
//         // console.log(JSON.parse(JSON.stringigy(result)));
        
//     });
    
// });

// app.get("/viewbyId/:id",(req,res) => {
//     const fetchId = req.params.id;
//     con.query("select * from login where id = ?",fetchId,(err,result) =>{
//         if(err) throw err;
//         console.log(result);
//         var value = JSON.parse(JSON.stringify(result));
//         console.log(value);
//         // res.send(result);
//     });
// });

// app.post("/register",(req,res)=>{
//     const id = req.body.id;
//     const userId = req.body.userId;
//     let password = req.body.password;

//     con.query("insert into login values(?,?,?)",[id,userId,password],(err,result) =>{
//         if(err) throw err;
//         console.log("Posted");
//         res.send("Posted");
//     });

// });

// app.post('/taskInput',(req,res)=> {
//     let task = req.body.task;
//     con.query("insert into task(task) values(?)",[task],(err,result) =>{
//         if(err) throw err;
//         res.send(result);
//     });
// });

// app.put("/viewbyId/:id",(req,res) => {
//     const value = req.params.id;
//     let password = req.body.password;
//     con.query("update login set password=? where id=?",[password,value],(err,result) =>{
//         if(err) throw err;
//         res.send("Updated");
//     });
// });

// app.delete("/viewbyId/:id",(req,res) => {
//     const value = req.params.id;
//     con.query('delete from login where id=?',value ,(err,result) =>{
//         if(err) throw err;
//         res.send("deleted");
//     });


// });

// app.get("/register",(req,res) => {

//     res.send("Register Page");

// });

app.listen(Port,(req,res) =>{
    console.log(`Server is running at http://localhost:${Port}`);
});
// user.registerDate = $('#register_date').val();