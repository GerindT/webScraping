import request from "supertest";
import app from "./app";

describe("GET /api/data", () => {
  it("responds with json for a valid URL", async () => {
    const response = await request(app)
      .get("/api/data")
      .query({
        url: "https://www.amazon.com/BlueFinger-Keyboard-Headset-Letters-Mousepad/dp/B06XTP897M/ref=sr_1_83?_encoding=UTF8&content-id=amzn1.sym.12129333-2117-4490-9c17-6d31baf0582a&keywords=gaming+keyboard&pd_rd_r=e225bbf9-c6b6-40f2-8d47-29e8394fdab9&pd_rd_w=SiNHa&pd_rd_wg=FRXZ6&pf_rd_p=12129333-2117-4490-9c17-6d31baf0582a&pf_rd_r=WD4VA5N79V3ZJWB0VX5P&qid=1702067613&sr=8-83",
      })
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toBeDefined();
  });

  it("responds with an error for an invalid URL", async () => {
    const response = await request(app)
      .get("/api/data")
      .query({ url: "https://www.invalid-url.com" })
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body.error).toBeDefined();
  });

  it("responds with an error when the URL parameter is missing", async () => {
    const response = await request(app)
      .get("/api/data")
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body.error).toBeDefined();
  });
});
