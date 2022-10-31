import App from "../app";
import request from "supertest";
import {expect} from "chai";

describe("#good", async () => {
  const server = (await App).ext.server;

  it("test", async () => {
    await request(server)
      .get("/v2/goods")
      .expect(200)
      .expect(res => {
        const resp = JSON.parse(res.text);
        expect(resp.code).equal(0);
      })
  })
})