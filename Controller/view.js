const db = require('../dbConnection');

module.exports = {
    view : async () =>{
        const sql = 'Select * from user';
        const [user] = await db.query(sql);
        return user;
    }
};