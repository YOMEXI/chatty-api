const request = require("supertest");
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { User } from "../../entities/User";
import { DB } from "../../tests/testHandlers";
import app from "./../../app";
import { DbSetUp, theUser, token } from "../fixtures/db";

beforeEach(DbSetUp);

test("should register user", async () => {
  const response = await request(app)
    .post("/api/register")
    .send({
      email: "am@gmail.com",
      username: "zas",
      password: "3333333",
      age: 23,
    })
    .expect(200);

  const check = await response.body.message;

  expect(check).not.toBeNull();
});

test("should login existing user", async () => {
  await request(app)
    .post("/api/login")
    .send({
      email: theUser.email,

      password: theUser.password,
    })
    .expect((response) => {
      console.log(response.data);
    })
    .expect(200);
});

test("should not login wrong user", async () => {
  await request(app)
    .post("/api/login")
    .send({
      email: "sam@gmail.com",

      password: "3333333",
    })
    .expect(404);
});

test("return profile", async () => {
  await request(app)
    .get("/api/user/me")
    .send()
    .set("cookie", [`token=${token}`])
    .expect((response) => {
      console.log(response.error);
    })
    .expect(200);
});
