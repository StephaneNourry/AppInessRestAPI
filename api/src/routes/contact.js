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

// -- List contacts (view)
router.get('/', (req, res) => {
    pool.query("SELECT * FROM contacts ORDER BY id", (error, result) => {
        if (error) {
            console.log("ERROR: ", error);
            res.render('jsonMessage', { json: {type: "ko", message: "error when fetching data", callback: "/"}});
        }
        console.log(result);
        res.render('contact/contactIndex', { contacts: [{
            id: 1,
            firstname: "Firstname 1",
            lastname: "Lastname 1",
            number: "0923840984",
            email: "posjdpofj",
        },
        {
            id: 2,
            firstname: "Firstname 2",
            lastname: "Lastname 2",
            number: "090982345984",
            email: "posjdpojsdfpofj",
        }]});
    })
});

// -- Create contact (view)
router.get('/create', (req, res) => {
        res.render('contact/contactCreate');
});

// -- Add new contact (db)
router.post('/', async (req, res) => {
    // store new contact in db
    var values = `(${req.body.firstname}, ${req.body.lastname}, ${req.body.number}, ${req.body.email})`
    pool.query("INSERT INTO contacts (firstname, lastname, number, email) VALUES " + values, (error, result) => {
        if (error) {
            console.log("ERROR: ", error);
            res.render('jsonMessage', { json: {type: "ko", message: "error when adding contact to database", callback: "/contact/"}});
        }
        console.log(result);
        console.log("New contact: " + req.body.firstname + " " + req.body.lastname);
        res.render('jsonMessage', { json: {type: "ok", message: "Contact added !", callback: "/contact/"}});
    });
});

// -- Contact info (view + api)
router.get('/:id', (req, res) => {
    // get contact by id in db

    // check id before

    pool.query("SELECT * FROM contacts WHERE id=" + req.params.id, (error, result) => {
        if (error) {
            console.log("ERROR: ", error);
            res.render('jsonMessage', { json: {type: "ko", message: "error when fetching data", callback: "/contact/"}});
        }
        console.log(result);
        res.render('contact/contactShow', { contact: {
            id: 1,
            firstname: "Firstname 1",
            lastname: "Lastname 1",
            number: "0923840984",
            email: "posjdpofj",
        }});
    });
});

// -- Edit contact info (view)
router.get('/:id/edit', (req, res) => {
    // get contact by id in db

    // check id before

    pool.query("SELECT * FROM contacts WHERE id=" + req.params.id, (error, result) => {
        if (error) {
            console.log("ERROR: ", error);
            res.render('jsonMessage', { json: {type: "ko", message: "error when fetching data", callback: "/contact/"}});
        }
        console.log(result);
        res.render('contact/contactEdit', {contact: {
            id: 1,
            firstname: "Firstname 1",
            lastname: "Lastname 1",
            number: "0923840984",
            email: "posjdpofj",
        }});
    });
});

// -- Update contact (db)
router.post('/:id', (req, res) => {
    //update contact by id in db

    // check id before

    var set = `firstname = ${req.body.firstname}, lastname = ${req.body.lastname}, number = ${req.body.number}, email = ${req.body.email}`

    pool.query("UPDATE contacts SET " + set + "WHERE id=" + req.params.id, (error, result) => {
        if (error) {
            console.log("ERROR: ", error);
            res.render('jsonMessage', { json: {type: "ko", message: "error when updating contact " + req.params.id, callback: "/contact/"}});
        }
        console.log(result);
        console.log("Edit contact " + req.params.id + " to : " + req.body.firstname + " " + req.body.lastname);
        res.render('jsonMessage', {json: {type: "ok", message: "contact " + req.params.id + " updated", callback: "/contact/"}});
    });
});

// -- Delete contact (db)
router.post('/:id/delete', (req, res) => {
    //delete contact by id in db

    // check id before

    pool.query("DELETE FROM contacts WHERE id=" + req.params.id, (error, result) => {
        if (error) {
            console.log("ERROR: ", error);
            res.render('jsonMessage', { json: {type: "ko", message: "error when deleting contact " + req.params.id, callback: "/contact/"}});
        }
        console.log(result);
        console.log("Delete contact " + req.params.id)
        res.render('jsonMessage', {json: {type: "ok", message: "contact " + req.params.id + " deleted", callback: "/contact/"}});
    });
});

module.exports = router;