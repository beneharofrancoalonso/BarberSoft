import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../src/app.js";

describe("API base", () => {
  it("responde health check", async () => {
    const res = await request(app).get("/api/v1/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("valida payload de login", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "correo-sin-formato",
      password: "123",
    });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe("VALIDATION_ERROR");
  });

  it("valida payload de registro", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      nombre: "A",
      email: "correo-invalido",
      password: "123",
    });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe("VALIDATION_ERROR");
  });
});
