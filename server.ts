import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  // API endpoint: Get default Facebook config status
  app.get("/api/facebook/config", (req, res) => {
    const hasDefaultEnv = !!(process.env.FACEBOOK_PAGE_ID && process.env.FACEBOOK_PAGE_ACCESS_TOKEN);
    res.json({
      configured: hasDefaultEnv,
      defaultPageId: process.env.FACEBOOK_PAGE_ID ? `${process.env.FACEBOOK_PAGE_ID.substring(0, 4)}...` : null,
    });
  });

  // API endpoint: Verify Facebook Page Credentials
  app.get("/api/facebook/verify-page", async (req, res) => {
    try {
      const pageId = (req.query.pageId as string) || process.env.FACEBOOK_PAGE_ID;
      const pageAccessToken = (req.query.pageAccessToken as string) || process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

      if (!pageId || !pageAccessToken) {
        return res.status(400).json({
          success: false,
          error: "Facebook Page ID and Page Access Token are required.",
        });
      }

      const fbUrl = `https://graph.facebook.com/v19.0/${pageId}?fields=id,name,picture{url},category,followers_count,link&access_token=${encodeURIComponent(pageAccessToken)}`;
      const fbRes = await fetch(fbUrl);
      const data = await fbRes.json();

      if (data.error) {
        return res.status(400).json({
          success: false,
          error: data.error.message || "Failed to verify Facebook Page credentials.",
          fbError: data.error,
        });
      }

      return res.json({
        success: true,
        page: {
          id: data.id,
          name: data.name,
          category: data.category || "Facebook Page",
          followersCount: data.followers_count || 0,
          pictureUrl: data.picture?.data?.url || "",
          link: data.link || `https://facebook.com/${data.id}`,
        },
      });
    } catch (err: any) {
      console.error("Facebook Verify Error:", err);
      return res.status(500).json({
        success: false,
        error: err.message || "Internal server error while connecting to Facebook Graph API.",
      });
    }
  });

  // API endpoint: Publish Image Post to Facebook Page
  app.post("/api/facebook/publish", async (req, res) => {
    try {
      const { pageId: reqPageId, pageAccessToken: reqToken, imageBase64, caption, published = true, scheduledPublishTime } = req.body;

      const pageId = reqPageId || process.env.FACEBOOK_PAGE_ID;
      const pageAccessToken = reqToken || process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

      if (!pageId || !pageAccessToken) {
        return res.status(400).json({
          success: false,
          error: "Facebook Page ID and Access Token are required. Please configure your Page in settings.",
        });
      }

      if (!imageBase64) {
        return res.status(400).json({
          success: false,
          error: "No image provided for publishing.",
        });
      }

      // Convert base64 string into binary Buffer & Blob
      const base64Clean = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Clean, "base64");
      const blob = new Blob([buffer], { type: "image/png" });

      const formData = new FormData();
      formData.append("source", blob, "mcq_image.png");
      formData.append("caption", caption || "");
      formData.append("access_token", pageAccessToken);

      if (!published && scheduledPublishTime) {
        formData.append("published", "false");
        formData.append("scheduled_publish_time", String(scheduledPublishTime));
      }

      const fbPublishUrl = `https://graph.facebook.com/v19.0/${pageId}/photos`;
      const fbRes = await fetch(fbPublishUrl, {
        method: "POST",
        body: formData,
      });

      const fbData = await fbRes.json();

      if (fbData.error) {
        return res.status(400).json({
          success: false,
          error: fbData.error.message || "Facebook Graph API rejected the post.",
          fbError: fbData.error,
        });
      }

      const postId = fbData.post_id || fbData.id;
      const postUrl = `https://facebook.com/${postId}`;

      return res.json({
        success: true,
        postId,
        postUrl,
        message: published ? "Successfully posted image to Facebook Page!" : "Successfully scheduled post on Facebook Page!",
      });
    } catch (err: any) {
      console.error("Facebook Publish Error:", err);
      return res.status(500).json({
        success: false,
        error: err.message || "Failed to publish photo to Facebook Page.",
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:3000`);
  });
}

startServer();
