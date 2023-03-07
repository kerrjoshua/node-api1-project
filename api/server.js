// BUILD YOUR SERVER HERE
const express = require('express');
const server = express();
const Users = require('./users/model')

server.get('/', (req,res) => {
    res.send('Hello World!!!')
});


server.use(express.json())

// Add the code necessary in `index.js` and `api/server.js` to create a Web API and implement the following _endpoints_:

// | POST   | /api/users     | Creates a user using the information sent inside the `request body`.   
server.post('/api/users', async (req, res) => {
    try {
        const { name, bio } = req.body;
        const user = {name:name, bio:bio};
        if (!name || !bio) {
            res.status(400).json({
                message: 'Please provide name and bio for the user'
            })
            return
        }
        const createdUser = await Users.insert(user)
        res.status(201).json(createdUser)
    } catch (err) {
        res.status(500).json({ message: `There was an error while saving the user to the database`})
    }
})


// | GET    | /api/users     | Returns an array users.  

server.get('/api/users', async (req, res) => {
    try {
        const users = await Users.find();
        res.status(200).json(users)

    } catch(err) {
        res.status(500).json({ message: `Error: ${err.message}`})
    }
})

// | GET    | /api/users/:id | Returns the user object with the specified `id`.   

server.get('/api/users/:id', async (req, res) => {
    try {
        const id = req.params.id
        const foundUser = await Users.findById(id);
        if (!foundUser) {
            res.status(404).json({
                message: 'The user with the specified id does not exist'
            })
        } else {
            res.status(200).json(foundUser)
        }

    } catch(err) {
        res.status(500).json({ message: `${err.message}: The user information could not be retrieved`})
    }
})


// | DELETE | /api/users/:id | Removes the user with the specified `id` and returns the deleted user.                                 |

server.delete('/api/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const removedUser = await Users.remove(id)
        if (!removedUser) {
            res.status(404).json({ message: 'The specified user does not exist'})
            return
        } else {
            res.status(200).json(removedUser)
        }
    } catch(err) {
        res.status(500).json({ message: 'The user could not be removed'})
    }
})

// | PUT    | /api/users/:id | Updates the user with the specified `id` using data from the `request body`. Returns the modified user |

server.put('/api/users/:id', async (req, res) => {
    try {
        const id =  req.params.id;
        const { name, bio } = req.body;
        if (!name || !bio ) {
            res.status(400).json({ message: 'Please provide name and bio for the user' })
            return
        }
        const updatedUser = await Users.update(id, { name, bio });
        if (!updatedUser) {
            res.status(404).json({ message: 'The user with the specified ID does not exist' })
            return
        } else {
            res.status(200).json(updatedUser)
        }
    } catch(err) {
        res.status(500).json({ message: `${err.message}: The user information could not be modified`})
    } 
})

// #### User Schema

// Each User _resource_ should conform to the following structure (AKA schema):

// ```js
// {
//   id: "a_unique_id", // String, required
//   name: "Jane Doe",  // String, required
//   bio: "Having fun", // String, required
// }
// ```

// #### Database Access Functions

// You can find them inside `api/users/model.js`. All of these functions return Promises.

// - `find` Resolves to the list of users (or empty array).
// - `findById` Takes an `id` and resolves to the user with that id (or null if the id does not exist).
// - `insert` Takes a new user `{ name, bio }` and resolves to the the newly created user `{ id, name, bio }`.
// - `update` Takes an `id` and an existing user `{ name, bio }` and resolves the updated user `{ id, name, bio}` (or null if the id does not exist).
// - `remove` Takes an `id`  and resolves to the deleted user `{ id, name, bio }`.

// #### Endpoint Specifications

// When the client makes a `POST` request to `/api/users`:

// - If the request body is missing the `name` or `bio` property:

//   - respond with HTTP status code `400` (Bad Request).
//   - return the following JSON response: `{ message: "Please provide name and bio for the user" }`.

// - If the information about the _user_ is valid:

//   - save the new _user_ the the database.
//   - respond with HTTP status code `201` (Created).
//   - return the newly created _user document_ including its id.

// - If there's an error while saving the _user_:
//   - respond with HTTP status code `500` (Server Error).
//   - return the following JSON object: `{ message: "There was an error while saving the user to the database" }`.

// When the client makes a `GET` request to `/api/users`:

// - If there's an error in retrieving the _users_ from the database:
//   - respond with HTTP status code `500`.
//   - return the following JSON object: `{ message: "The users information could not be retrieved" }`.

// When the client makes a `GET` request to `/api/users/:id`:



// When the client makes a `DELETE` request to `/api/users/:id`:

// - If the _user_ with the specified `id` is not found:

//   - respond with HTTP status code `404` (Not Found).
//   - return the following JSON object: `{ message: "The user with the specified ID does not exist" }`.

// - If there's an error in removing the _user_ from the database:
//   - respond with HTTP status code `500`.
//   - return the following JSON object: `{ message: "The user could not be removed" }`.

// When the client makes a `PUT` request to `/api/users/:id`:

// - If the _user_ with the specified `id` is not found:

//   - respond with HTTP status code `404` (Not Found).
//   - return the following JSON object: `{ message: "The user with the specified ID does not exist" }`.

// - If the request body is missing the `name` or `bio` property:

//   - respond with HTTP status code `400` (Bad Request).
//   - return the following JSON response: `{ message: "Please provide name and bio for the user" }`.

// - If there's an error when updating the _user_:

//   - respond with HTTP status code `500`.
//   - return the following JSON object: `{ message: "The user information could not be modified" }`.

// - If the user is found and the new information is valid:

//   - update the user document in the database using the new information sent in the `request body`.
//   - respond with HTTP status code `200` (OK).
//   - return the newly updated _user document_.

module.exports = server; 
