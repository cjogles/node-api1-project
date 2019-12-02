const express = require('express');
const db = require('./data/db');
const server = express();

server.use(express.json())

server.get('/', (req, res) => {
    res.send({api:"API up and running..."});
})
// | POST   | /api/users     | Creates a user using the information sent inside the `request body`.  
server.post('/api/users', (req, res) => {
    const userData = req.body;
    if (!userData.name || !userData.bio) {
        res
            .status(400)
            .json({errorMessage: 'Please provide name and bio for the user.' })
    } else {
        db.insert(userData)
            .then(user => {
                    res
                        .status(201)
                        .json(user);
            })
            .catch(error => {
                console.log('error creating user from information requested inside req body', error);
                res
                    .status(500)
                    .json({error: 'There was an error while saving the user to the database'})
        })
    }
})
// | GET    | /api/users     | Returns an array of all the user objects contained in the database. 
server.get('/api/users', (req, res) => {
    db.find()
        .then(users => {
            res
                .status(200)
                .json(users);
        })
        .catch(error => {
            console.log('error retrieving all users in data base', error);
            res
                .status(500)
                .json({error: 'The users information could not be retrieved.'})
        })
})
// | GET    | /api/users/:id | Returns the user object with the specified `id`.          
server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db.findById(id)
        .then(user => {
            if (user.id) {
                res
                    .status(200)
                    .json(user)
            } else {
                res
                    .status(404)
                    .json({message: 'The user with the specified ID does not exist.'})
            }
        })
        .catch(error => {
            console.log('error retrieving user by id', error);
            res
                .status(500)
                .json({error: 'The user information could not be retrieved'})
        })
})
// | DELETE | /api/users/:id | Removes the user with the specified `id` and returns the deleted user.    
server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db.remove(id)
        .then(removed => {
            if (removed) {
                res 
                    .status(200)
                    .json({message: `user ${id} has been removed successfully`})
            } else {
                res
                    .status(404)
                    .json({error: 'The user with the specified ID does not exist.'})
            }
        })
        .catch(error => {
            console.log('error deleting user by id', error);
            res
                .status(500)
                .json({errorMessage: 'Error deleting user by id'})
        })
})          
// | PUT    | /api/users/:id | Updates the user with the specified `id` using data from the `request body`. Returns the modified document, **NOT the original**. |
server.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const updates = req.body;
    db.update(id, updates)
        .then(update => {
            if (!update.id) {
                res
                    .status(404)
                    .json({error: 'The user with the specified ID does not exist.'})
            } else if (!update.name || !update.bio) {
                res
                    .status(400)
                    .json({error: 'Please provide name and bio for the user.'})
            } else {
                res
                    .status(202)
                    .json(update)
            }
        })
        .catch(error => {
            console.log('error updating user by id', error);
            res
                .status(500)
                .json({error: 'The user information could not be modified'})
        })
})
const port = 5000;
server.listen(port, () => console.log(`\n *** API running on port ${port} *** \n`))