import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const db = new Database("portfolio.db");

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS works (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    videoUrl TEXT NOT NULL,
    thumbnail TEXT NOT NULL,
    tags TEXT NOT NULL
  )
`);

// Seed initial data if empty
const count = db.prepare("SELECT COUNT(*) as count FROM works").get() as { count: number };
if (count.count === 0) {
  const seedWorks = [
    {
      type: 'website',
      title: 'Luxe Dining Experience',
      description: 'High-performance digital menu and reservation system with real-time analytics.',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-restaurant-chef-preparing-a-dish-1861-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop',
      tags: JSON.stringify(['React', 'Node.js', 'QR Integration'])
    },
    {
      type: 'ad',
      title: 'Summer Collection Launch',
      description: 'Viral short-form ad campaign that generated 500k+ local impressions in 14 days.',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-walking-in-a-studio-34444-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop',
      tags: JSON.stringify(['Motion Graphics', 'Meta Ads', 'Viral Strategy'])
    }
  ];
  const insert = db.prepare(`
    INSERT INTO works (type, title, description, videoUrl, thumbnail, tags)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  seedWorks.forEach(w => insert.run(w.type, w.title, w.description, w.videoUrl, w.thumbnail, w.tags));
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ 
  storage,
  limits: { fileSize: 300 * 1024 * 1024 } // 300MB limit
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '300mb' }));
  app.use(express.urlencoded({ limit: '300mb', extended: true }));
  app.use("/uploads", express.static(uploadDir));

  // API Routes
  app.get("/api/works", (req, res) => {
    console.log('GET /api/works requested');
    try {
      const works = db.prepare("SELECT * FROM works ORDER BY id DESC").all();
      console.log(`Found ${works.length} works in DB`);
      const parsedWorks = works.map((w: any) => {
        let tags = [];
        try {
          tags = JSON.parse(w.tags);
        } catch (e) {
          // Fallback for old data that might be comma-separated strings
          tags = typeof w.tags === 'string' ? w.tags.split(',').map((t: string) => t.trim()) : [];
        }
        return { ...w, tags };
      });
      res.json(parsedWorks);
    } catch (error) {
      console.error('Error fetching works:', error);
      res.status(500).json({ error: "Failed to fetch works" });
    }
  });

  app.post("/api/works", upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), (req, res) => {
    console.log('POST /api/works received');
    const { type, title, description, tags } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    console.log('Body:', { type, title, description, tags });
    console.log('Files received:', Object.keys(files || {}));

    const videoUrl = files['video'] ? `/uploads/${files['video'][0].filename}` : req.body.videoUrl;
    const thumbnail = files['thumbnail'] ? `/uploads/${files['thumbnail'][0].filename}` : req.body.thumbnail;

    const tagsArray = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags;

    if (!type || !title || !description || !videoUrl || !thumbnail || !tagsArray) {
      console.error('Missing fields:', { type, title, description, videoUrl, thumbnail, tagsArray });
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const stmt = db.prepare(`
        INSERT INTO works (type, title, description, videoUrl, thumbnail, tags)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run(type, title, description, videoUrl, thumbnail, JSON.stringify(tagsArray));
      console.log('Successfully inserted work with ID:', result.lastInsertRowid);
      res.json({ id: result.lastInsertRowid, videoUrl, thumbnail });
    } catch (error) {
      console.error('Error inserting work:', error);
      res.status(500).json({ error: "Failed to add work" });
    }
  });

  app.delete("/api/works/:id", (req, res) => {
    const { id } = req.params;
    try {
      db.prepare("DELETE FROM works WHERE id = ?").run(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete work" });
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
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
