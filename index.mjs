import express, { response } from 'express';

import { query, validationResult, body, matchedData  } from "express-validator"

const app = express();

app.use(express.json())

const loggingMiddleware = (request, response, next) => {
    console.log('${request.method} - ${request.url}');
    next();

};



const PORT = process.env.PORT || 3000;

const mockUsers = [
{ id: 1, username: "anson", displayName: "Anson" },
{ id: 2, username: "jack", displayName: "Jack" },
{ id: 3, username: "adam", displayName: "Adam" },
{ id: 4, username: "jagadeesh", displayName: "Jagadeesh" },
{ id: 5, username: "pranay", displayName: "Pranay" },
{ id: 6, username: "avinash", displayName: "Avinash" },
{ id: 7, username: "dinesh", displayName: "Dinesh" },
{ id: 8, username: "sai shiva", displayName: "Sai Shiva" },
]; 
app.get("/", (request, response) => {
    response.status(201).send({ msg: "Hello" });
});

app.get("/api/users", 
    query("filter")
    .isString()
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({ min:3, max:10 })
    .withMessage("Must be at least 3-10 characters"), 
    (request, response) => {
        const result = validationResult(request);
        console.log(result); 
        const { query: { filter, value },
 } = request;
    if (!filter && !value) return response.send(mockUsers);

    if (filter && value) return response.send(
        mockUsers.filter((user) => user[filter].includes(value)) 
    );

    return response.send(mockUsers);
});

app.post('/api/users', 
    [body('username')
    .notEmpty()
    .withMessage("Username cannot be empty")
    .isLength( { min:5, max: 32 })
    .withMessage("Username must be at least 5 characters with a max of 32 characters")
    .isString()
    .withMessage("Username must be a string"),
    body("displayName").notEmpty(),
],
    (request, response) => {
    const result = validationResult(request);
    console.log(result);
    
    if(!result.isEmpty())
    return response.status(400).send({ errors: result.array() });
    const data = matchedData(request);
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
    mockUsers.push(newUser);
    return response.status(201).send(newUser);
});

app.get('/api/users/:id', (request, response) => {
    console.log(request.params);
    const parsedId = parseInt(request.params.id);
    console.log(parsedId);
    if(isNaN(parsedId)) return response.status(400).send({msg: "Bad Request. Invalid ID."});
    
    const findUser = mockUsers.find((user) => user.id === parsedId);
    if (!findUser) return response.sendStatus(404);
    return response.send(findUser);
});

app.get('/api/products', (request, response) => {
    response.send([{ id: 123, name: 'chicekn breast', price: 12.99}])
});

app.put('/api/users/:id', (request, response) => {
    const {
        body,
        params: { id },
    } = request;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return response.sendStatus(400);
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
    if (findUserIndex === -1) return response.sendStatus(404);
    mockUsers[findUserIndex] = { id: parsedId, ...body  };
    return response.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Runing on Port ${PORT}`);
});


app.patch('/api/users/:id', (request, response) => {
    const {
        body,
        params: { id },
    } = request;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return response.sendStatus(400);
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
    if (findUserIndex === -1) return response.sendStatus(404);
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
    return response.sendStatus(200);

});

app.delete('/api/users/:id', (request, response) => {
    const {
        body,
        params: { id },
    } = request;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return response.sendStatus(400);
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
    if (findUserIndex === -1) return response.sendStatus(404);
    mockUsers.splice(findUserIndex);
    return response.sendStatus(200);
    
});