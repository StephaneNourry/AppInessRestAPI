const express = require('express');
var router = express.Router();

const Pool = require('pg').Pool;
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.query("CREATE DATABASE RestAPI", (error, result) => {
    if (error)
        console.log("ERROR: ", error);
    else {
        console.log("Database created: ", result);
    }
});

pool.query("CREATE TABLE IF NOT EXISTS messages (id SERIAL, firstname text NOT NULL, lastname text NOT NULL, message text NOT NULL)", (error, result) => {
    if (error)
        console.log("ERROR: ", error);
    else {
        console.log("Table created: ", result);
    }
})

// -- List messages (db)
router.get('/', (req, res) => {
    pool.query("SELECT * FROM messages ORDER BY id", (error, result) => {
        if (error) {
            console.log("ERROR: ", error);
            return res.status(500).json({type: "ko", message: "error when fetching data", callback: "/"});
        }
        return res.status(200).json({data: result.rows});
    })
});

// -- Create message (view)
router.get('/create', (req, res) => {
    res.render('message/messageCreate');
});

// -- Add new message (db)
router.post('/', async (req, res) => {
    // store new message in db

    var values = `('${req.body.firstname}', '${req.body.lastname}', '${req.body.message}')`
    pool.query("INSERT INTO messages (firstname, lastname, message) VALUES " + values, (error, result) => {
        if (error) {
            console.log("ERROR: ", error);
            return res.status(500).json({type: "ko", message: "error when adding message to database", callback: "/message/"});
        }
        console.log(result);
        console.log("New message: " + req.body.firstname + " " + req.body.lastname);
        return res.status(200).json({type: "ok", message: "message added !", callback: "/message/"});
    });
});

// -- message info (view + api)
router.get('/:id', (req, res) => {
    // get message by id in db

    var idError = checkID(res, req.params.id);
    if (idError)
        return idError;

    pool.query("SELECT * FROM messages WHERE id=" + req.params.id, (error, result) => {
        if (error) {
            console.log("ERROR: ", error);
            return res.status(500).json({type: "ko", message: "error when fetching data", callback: "/message/"});
        }
        console.log(result);
        return res.status(200).json({data: result.rows[0]});
    });
});

// -- Edit message info (view)
router.get('/:id/edit', (req, res) => {
    // get message by id in db

    var idError = checkID(res, req.params.id);
    if (idError)
        return idError;

    pool.query("SELECT * FROM messages WHERE id=" + req.params.id, (error, result) => {
        if (error) {
            console.log("ERROR: ", error);
            res.render('jsonMessage', {json: {type: "ko", message: "error when fetching data", callback: "/message/"}});
        }
        console.log(result);
        res.render('message/messageEdit', {message: result.rows[0]});
    });
});

// -- Update message (db)
router.post('/:id', (req, res) => {
    //update message by id in db

    // check id and params before
    var idError = checkID(res, req.params.id);
    if (idError)
        return idError;

    var set = `firstname = '${req.body.firstname}', lastname = '${req.body.lastname}', message = '${req.body.message}'`

    pool.query("UPDATE messages SET " + set + "WHERE id=" + req.params.id, (error, result) => {
        if (error) {
            console.log("ERROR: ", error);
            return res.status(500).json({type: "ko", message: "error when updating message " + req.params.id, callback: "/message/"});
        }
        console.log(result);
        console.log("Edit message " + req.params.id + " to : " + req.body.firstname + " " + req.body.lastname);
        res.render('jsonMessage', {json: {type: "ok", message: "message " + req.params.id + " updated", callback: "/message/"}});
    });
});

// -- Delete message (db)
router.post('/:id/delete', (req, res) => {
    //delete message by id in db

    var idError = checkID(res, req.params.id);
    if (idError)
        return idError;

    pool.query("DELETE FROM messages WHERE id=" + req.params.id, (error, result) => {
        if (error) {
            console.log("ERROR: ", error);
            return res.status(500).json({type: "ko", message: "error when deleting message " + req.params.id, callback: "/message/"});
        }
        console.log(result);
        console.log("Delete message " + req.params.id)
        return res.status(200).json({type: "ok", message: "message " + req.params.id + " deleted", callback: "/message/"});
    });
});

// Checks if ID is a number
const checkID = (res, id) => {
    if (isNaN(id)) {
        console.log("ERROR: ", "ID should only be a number");
        return res.status(400).json({type: "ko", message: "ID should only be a number", callback: "/message/"});
    } else
        return undefined;
}

// Checks if all the parameter are normal strings
const checkParams = (params) => {

}

module.exports = router;