import { connectMongo } from "./_lib/mongo";

type ApiRequest = unknown;
type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

export default async function handler(_req: ApiRequest, res: ApiResponse) {
  try {
    await connectMongo();
    return res.status(200).json({ ok: true, service: "portfolio-backend" });
  } catch (error) {
    console.error("health api error:", error);
    return res.status(500).json({ ok: false });
  }
}
