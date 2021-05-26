const express = require('express');
const axios = require('axios');
const configs = require('../public/config');

var router = express.Router();

const requestHeaders = {
    headers: {
        'authorization': "Basic " +  configs.mailchimpConfig.api_key,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
}

const baseURL = `https://${configs.mailchimpConfig.api_server}.api.mailchimp.com/3.0/lists/${configs.mailchimpConfig.audience_id}/members/`;

// -- List subscribers (view)
router.get('/', function (req, res) {
    // fetch all subscribers in mailing list
    console.log(configs.mailchimpConfig);
    axios.get(baseURL, requestHeaders)
    .then(data => {
        console.log("data: ", data.data.members)
        // res.render('subscriber/subscriberIndex', { 
        //     subscribers: data.data.members,
        // });
        let info = data.data.members.map(({id, email_address}) => new Object({id: id, email_address: email_address}));
        res.status(200).json({data: info});
    })
    .catch(error => {
        console.log("ERROR: ", error);
        // res.render('jsonMessage', { json: {type: "ko", message: "error when fetching data", callback: "/subscriber/"}});
        res.status(500).json({type: "ko", message: "error when fetching data", callback: "/subscriber/"});
    });
});

// -- Create subscriber (view)
router.get('/create', (req, res) => {
    res.render('subscriber/subscriberCreate');
});

// -- Add new subscriber (db)
router.post('/', async (req, res) => {
    // store new subscriber in mailing list

    var dataToStore = {
        email_address: req.body.email,
        status: 'subscribed',
        language: 'fr',
    }

    axios.post(baseURL, dataToStore, requestHeaders)
    .then(() => {
        // res.render('jsonMessage', { json: {type: "ok", message: "subscriber added !", callback: "/subscriber/"}});
        res.status(200).json({type: "ok", message: "subscriber added successfully !"});
    })
    .catch(error => {
        console.log("ERROR: ", error);
        // res.render('jsonMessage', { json: {type: "ko", message: error.response.data.detail || "error when adding subscriber", callback: "/subscriber/"}});
        res.status(500).json({type: "ko", message: error.response.data.detail || "error when adding subscriber"});
    });
});

// -- subscriber info (view + api)
router.get('/:id', (req, res) => {
    // get subscriber by id in mailing list
    axios.get(baseURL + req.params.id, requestHeaders)
    .then(data => {
        console.log("data: ", data.data)
        // res.render('subscriber/subscriberShow', { 
        //     subscriber: data.data,
        // });
        res.status(200).json({data: {
            id: data.data.id,
            email_address: data.data.email_address,
        }});
    })
    .catch(error => {
        console.log("ERROR: ", error);
        // res.render('jsonMessage', { json: {type: "ko", message: "error when fetching data", callback: "/subscriber/"}});
        res.status(500).json({type: "ko", message: "error when fetching data"});
    });
});

// -- Edit subscriber info (view)
router.get('/:id/edit', (req, res) => {
    // get subscriber by id in mailing list
    
    axios.get(baseURL + req.params.id, requestHeaders)
    .then(data => {
        console.log("edit id data: ", data.data)
        res.render('subscriber/subscriberEdit', { 
            subscriber: data.data,
        });
    })
    .catch(error => {
        console.log("ERROR: ", error);
        res.render('jsonMessage', { json: {type: "ko", message: "error when fetching data", callback: "/subscriber/"}});
    });
});

// -- Update subscriber (db)
router.post('/:id', (req, res) => {
    //update subscriber by id in mailing list
    
    var dataToStore = {
        email_address: req.body.email,
        status: req.body.status == "on" ? 'subscribed' : 'unsubscribed',
    }

    console.log("DATA TO STORE: ", dataToStore);

    axios.patch(baseURL + req.params.id, dataToStore, requestHeaders)
    .then(() => {
        // res.render('jsonMessage', { json: {type: "ok", message: "subscriber edited successfully !", callback: "/subscriber/"}});
        res.status(200).json({type: "ok", message: "subscriber edited successfully !"});
    })
    .catch(error => {
        console.log("ERROR: ", error, error.response.data.errors);
        // res.render('jsonMessage', { json: {type: "ko", message: error.response.data.detail || "error when editing subscriber", callback: "/subscriber/"}});
        res.status(500).json({type: "ko", message: error.response.data.detail || "error when editing subscriber"});
    });
});

// -- Unsubscriber (db)
router.post('/:id/unsubscribe', (req, res) => {
    //delete subscriber by id in mailing list
    console.log("Unsubscriber " + req.params.id)
    res.render('jsonMessage', {json: {type: "ok", message: "subscriber " + req.params.id + " deleted", callback: "/subscriber/"}});
});

module.exports = router;