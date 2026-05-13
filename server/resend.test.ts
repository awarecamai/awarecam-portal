import { describe, it, expect } from "vitest";

describe("Resend API key validation", () => {
  it("should be able to reach Resend API with the configured key", async () => {
    const apiKey = process.env.RESEND_API_KEY;
    expect(apiKey, "RESEND_API_KEY must be set").toBeTruthy();

    // Hit the Resend domains endpoint to verify the key is valid
    // and has access to awarecam.com
    const res = await fetch("https://api.resend.com/domains", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    expect(res.status, "Resend API should return 200 for valid key").toBe(200);

    const data = (await res.json()) as { data?: Array<{ name: string; status: string }> };
    expect(data.data, "Response should contain domain list").toBeDefined();

    const awarecamDomain = data.data?.find((d) => d.name === "awarecam.com");
    expect(awarecamDomain, "awarecam.com should be in the verified domains list").toBeDefined();
    expect(awarecamDomain?.status, "awarecam.com domain should be verified").toBe("verified");
  });
});
