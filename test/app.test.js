// Modules
import req from "supertest";
import app from "../src/index.js";

describe("GET /", () => {
  let res;
  beforeAll(async () => {
    res = await req(app).get("/");
  });
  it("should return status code 200", () => {
    expect(res.statusCode).toEqual(200);
  });
  it('should return "ok"', () => {
    expect(res.body).toEqual({
      status: "ok",
    });
  });
});
