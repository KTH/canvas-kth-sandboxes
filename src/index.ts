
import "./config/start";
import "./env";
import authRouter from "./auth/auth";
import {createCourse, enrollUser, getUser} from "./canvasApi"
import express from "express";
import { Router, Request, Response } from "express";
import sessionMiddleware from "express-session";
import log from "skog";
import { getNameOfDeclaration } from "typescript";


const app = express();
const port = 3000;

const testAccountIds: string[] = [
  "u19x1wr9",
  "u1s998q4",
  "u16rvqcl",
  "u19scdbu",
  "u1fdh8le",
  "u1ispahy",
];


app.listen(port, () => log.info("Sandbox app up and running"));

const authCheckMiddleware = function (req: Request, res: Response, next:Function){
  // if (req.path === "/canvas-kth-sandboxes/_monitor" && req.session === undefined){
  //   log.info("This user was not authenticated");
  //   res.redirect("/canvas-kth-sandboxes/auth");
  // }else{
  // next()
  // }
  // log.info(req.path);
  next();

}

app.use(authCheckMiddleware)
app.use(
    sessionMiddleware({
      name: "canvas-kth-sandboxes.sid",
      proxy: true,
      cookie: {
        domain: new URL(process.env.PROXY_HOST || "").hostname,
        maxAge: 14 * 24 * 3600 * 1000,
        httpOnly: true,
        secure: "auto",
        sameSite: "none",
      },
  
      // Read more: https://www.npmjs.com/package/express-session#resave
      resave: false,
  
      // Save only sessions when user is authenticated. Setting "saveUnitialized"
      // to "false" prevents creation of sessions when app is accessed via API
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || "",
    })
  );



const router = Router();
const path = require('path');

app.use("/canvas-kth-sandboxes", router);
app.use("/canvas-kth-sandboxes/auth", authRouter);
app.use("/canvas-kth-sandboxes/public", express.static(path.join(__dirname, 'html')));
router.get("/_monitor", monitor);


async function monitor(req: Request, res: Response) {  
  try {
    res.send("OK");
  } catch (error) {
    log.error("Error: something went wrong.");
    res.send("Application status: ERROR");
    
  }
};

async function start(req: Request, res: Response): Promise<void> {
  // recive response object with info [userId] [School]?
  // UserId generate course code
  const userId = req.body.userId;
  const school = req.body.school;
  
  const userName = await getUser(userId);
  // Post call to api for create course with [name],[course_code],
  await createCourse(userName, school);
  log.info(`Course "Sandbox ${userName}" created`)
  // /api/v1/accounts/:account_id{school}/courses
  // Post call to api for enroll user and teststudents
  await enrollUser(userId, userName, "TeacherEnrollment");
  log.info(`${userName} was enrolled as Teacher.`);

  for (const testStudent in testAccountIds){
    await enrollUser(testStudent, userName, "StudentEnrollment");
  }
  log.info(`Test students have been enrolled.`)
  // [userId], [type], [enrollment_state],
  // url:POST|/api/v1/courses/:course_id/enrollments
}