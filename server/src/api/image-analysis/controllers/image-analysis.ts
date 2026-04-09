import { Context } from "koa";
import { analyzeImage } from "../services/gemini";

export default {
  async analyze(ctx: Context) {
    const files = ctx.request.files as any;
    const file = files?.image;

    if (!file) {
      return ctx.badRequest("No image uploaded!");
    }

    const filePath = file.filepath || file.path;

    try {
      const result = await analyzeImage(filePath);
      return ctx.send({ success: true, result });
    } catch (error: any) {
      return ctx.internalServerError("Analysis failed", {
        error: error?.message || "Unknown error",
      });
    }
  },
};

