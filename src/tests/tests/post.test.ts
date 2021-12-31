const request = require("supertest");
import { User } from "../../entities/User";
import { DB } from "../testHandlers";
import app from "../../app";

import { DbSetUp, theUser, token } from "../fixtures/db";

beforeEach(DbSetUp);
test("should get post", async () => {
  const response = await request(app)
    .get("/api/posts")
    // .set("cookie", [`token=${token}`])
    // .send({
    //   text: "Testing jest",
    //   title: "Top test",
    //   picUrl: "",
    // })
    .expect(200);
  console.log(token);
  expect(response).not.toBeNull();
});

test("should create post", async () => {
  const response = await request(app)
    .post("/api/posts/create")
    .type("form")
    .set("cookie", [`token=${token}`])
    .send({
      text: "Testing jest",
      title: "Top test",
      picUrl: "",
    })
    .expect(201);

  expect(response).not.toBeNull();
});
