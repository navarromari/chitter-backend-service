import Peep from "../src/models/peep.model.js";
import User from "../src/models/user.model.js";

import chai from "chai";
import { expect } from "chai";
import chaiHttp from "chai-http";

import server from "../server.js";
import testData from "./mockPeeps.js";
const testDataArray = testData.peeps;

chai.use(chaiHttp);

describe(`Testing peeps collection requests`, () => {
  const testServer = chai.request(server).keepOpen();

  describe(`Testing database requests`, () => {
    beforeEach(async () => {
      try {
        await Peep.insertMany(testDataArray);
        console.log(`Database populated with test Peeps`);
      } catch (error) {
        console.log(`Error inserting`);
        // Terminate the test
        throw new Error();
      }
    });

    afterEach(async () => {
      try {
        await Peep.deleteMany();
        console.log(`Database cleared`);
      } catch (error) {
        console.log(`Error clearing`);
        throw new Error();
      }
    });

    describe(`/GET peeps`, () => {
      it("should return all of the peeps as an array", async () => {
        const res = await testServer.get(`/`).send();

        expect(res).to.have.status(200);
        expect(res.body).to.be.an(`array`);
        expect(res.body.length).to.equal(testDataArray.length);
      });
    });

    describe(`/POST peep`, () => {
      it(`should create a new peep`, async () => {
        let peep = {
          peepAuthor: "Mariana",
          peepDateCreated: `2019-05-27T00:00:00.000Z`,
          peepMessage: `New peep sample`,
        };

        const res = await testServer.post(`/add`).send(peep);

        expect(res).to.have.status(201);
        expect(res.body).to.be.an(`object`);
        expect(res.body.peep).to.have.property(`peepMessage`, peep.peepMessage);
      });
    });
  });

  describe(`Testing user collection requests`, () => {
    beforeEach(async () => {
      try {
        await User.deleteMany({});
        await User.create({
          email: "existing@example.com",
          username: "existinguser",
          password: "password",
        });
      } catch (error) {
        console.log(`Error inserting`);
        // Terminate the test
        throw new Error();
      }
    });

    describe("POST /signup", () => {
      it("should register a new user when a unique email and username are provided", async () => {
        const user = {
          email: "test@example.com",
          username: "testuser",
          password: "password",
        };
        const res = await chai.request(server).post("/signup").send(user);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message", "Registration successful");
      });

      it("should return an error message when an email is already being used", async () => {
        const user = {
          email: "existing@example.com",
          username: "testuser",
          password: "password",
        };
        const res = await chai.request(server).post("/signup").send(user);

        expect(res).to.have.status(409);
        expect(res.body).to.have.property("message", "Email already exists");
      });

      it("should return an error message when a username is already being used", async () => {
        const user = {
          email: "test@example.com",
          username: "existinguser",
          password: "password",
        };
        const res = await chai.request(server).post("/signup").send(user);

        expect(res).to.have.status(409);
        expect(res.body).to.have.property("message", "Username already exists");
      });
    });

    describe("POST /login", () => {
      it("should login the user when a valid username/password combination are provided", async () => {
        const res = await chai
          .request(server)
          .post("/login")
          .send({ username: "existinguser", password: "password" });

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message", "Login successful");
      });

      it("should return an error message when incorrect password is provided", async () => {
        const res = await chai
          .request(server)
          .post("/login")
          .send({ username: "existinguser", password: "wrongpassword" });

        expect(res).to.have.status(401);
        expect(res.body).to.have.property("message", "Invalid credentials");
      });

      it("should return an error message when incorrect username is provided", async () => {
        const res = await chai
          .request(server)
          .post("/login")
          .send({ username: "wronguser", password: "password" });

        expect(res).to.have.status(401);
        expect(res.body).to.have.property("message", "Invalid credentials");
      });
    });
  });
});
