import mongoose from "mongoose";
import { expect, it, describe, afterEach } from "vitest";
import request from "supertest";
import app from "../../app";

describe("Testing Auth Routes", () => {
  //   const agent = request.agent(app);
  beforeEach(async () => {
    // await mongoose
    //   .connect("mongodb://localhost:27017/filestorage")
    //   .then(() => console.log("Connected to Test Database"))
    //   .catch((err) => console.log(`Error: ${err}`));
  });

  afterEach(async () => {
    // await mongoose.connection.dropDatabase();
    app.close();
  });

  it("Should return true", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send({ email: "Jeet@gmail.com", password: "testPassword" })
      .expect(200);
    expect(response.statusCode).toBe(200);
  });
});
