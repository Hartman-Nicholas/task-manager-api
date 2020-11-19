const request = require('supertest')
const app = require("../src/app")
const Task = require('../src/models/task')
const {
    userOneId,
    userOne,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase,
    userTwo
} = require("./fixtures/db")

beforeEach(setupDatabase)


test("Should create task for user", async () => {
    const response = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: "Doing test work"
        })
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
})

test("Should fetch all tasks for one user", async () => {
    const response = await request(app)
        .get("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toEqual(2)

    // const task = await Task.find({
    //     owner: response.body[0].owner
    //     expect(task.length).toEqual(2)
    // })
})

test("Second user should not be able to delete first tasks", async () => {
    await request(app)
        .delete(`/task/${taskOne._id}`)
        .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})