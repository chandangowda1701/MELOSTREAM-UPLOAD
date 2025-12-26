import express from "express"
import dotenv from "dotenv"
import cors from "cors";
import { clerkMiddleware } from '@clerk/express'
import fileUpload from "express-fileupload";
import path from "path";
import { createServer } from "http";
import cron from "node-cron";
import fs from "fs";
import { initializeSocket } from "./lib/socket.js";

import { connectDB } from "./lib/db.js";


import userRoutes from "./routes/user.route.js"
import authRoutes from "./routes/auth.route.js"
import adminRoutes from "./routes/admin.route.js"
import albumRoutes from "./routes/albums.route.js"
import songRoutes from "./routes/songs.route.js"
import statRoutes from "./routes/stat.route.js"

dotenv.config()

const __dirname = path.resolve();
const app = express()
const port = process.env.PORT;

const httpServer = createServer(app);
initializeSocket(httpServer);

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);


app.use(express.json());
app.use(clerkMiddleware())

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: {
        fileSize: 10 * 1024 * 1024, //10MB
    },
    }))

// cron jobs
const tempDir = path.join(process.cwd(), "tmp");
cron.schedule("0 * * * *", () => {
	if (fs.existsSync(tempDir)) {
		fs.readdir(tempDir, (err, files) => {
			if (err) {
				console.log("error", err);
				return;
			}
			for (const file of files) {
				fs.unlink(path.join(tempDir, file), (err) => {});
			}
		});
	}
});



app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/stats", statRoutes);


if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../frontend/dist")));
	app.use((req, res, next) => {
		if (!req.path.startsWith("/api")) {
			res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
		} else {
			next();
		}
	});
}


app.use((err,req,res,next)=> {
    res.status(500).json({message: process.env.NODE_ENV === "production" ?  "Internal Server Error" : err.message});
    
    });

httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`)
    connectDB();

})
