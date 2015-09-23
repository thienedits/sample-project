var router = require('express').Router();
var four0four = require('./utils/404')();
var data = require('./data');
var matches = require('./matches');

router.get('/people', getPeople);
router.get('/person/:id', getPerson);
router.get('/*', four0four.notFoundMiddleware);

router.post('/importMatches', importMatches);
router.post('/updateCurrentYear', updateCurrentYear);

module.exports = router;

//////////////

function getPeople(req, res, next) {
    res.status(200).send(data.people);
}

function getPerson(req, res, next) {
    var id = +req.params.id;
    var person = data.people.filter(function(p) {
        return p.id === id;
    })[0];

    if (person) {
        res.status(200).send(person);
    } else {
        four0four.send404(req, res, 'person ' + id + ' not found');
    }
}

function importMatches(req, res, next) {
    matches.importMatches(req.body);

    res.status(201).send('matches posted');
    next();
}

function copyUserMatches(req, res, next) {
    matches.copyUserMatches(req.body);

    //res.status(201).send('matches copied');
}

function updateCurrentYear(req, res, next) {
    matches.updateCurrentYear(req.body);

    res.status(201).send('current year matches updated');
    next();
}