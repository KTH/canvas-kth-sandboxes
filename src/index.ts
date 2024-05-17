
import "./config/start";
import {createCourse, enrollUser, getUser} from "./canvasApi"
import {Request, Response } from "express";
import log from "skog";
import path from "path";
import { getNameOfDeclaration } from "typescript";
import authRouter from "./auth/auth";
import router from "./server";

const testAccountIds: string[] = [
  "u19x1wr9",
  "u1s998q4",
  "u16rvqcl",
  "u19scdbu",
  "u1fdh8le",
  "u1ispahy",
];

router.use("/auth", authRouter);
router.use("/public", homepage);
router.get("/public", (req, res) => {
  res.sendFile(path.join(__dirname, '/html/index.html'));
});
router.get("/_monitor", monitor);


function homepage(req: Request, res: Response, next: Function){
 checkAuth(req, res);
 next();

}

function checkAuth(req: Request, res: Response){
  if(req.session.accessToken == undefined){
    log.error("User is not authenticated");
    res.redirect("/canvas-kth-sandboxes/auth");
  }
}


async function monitor(req: Request, res: Response) {  
  try {
    res.send("OK");
  } catch (error) {
    log.error("Error: something went wrong.");
    res.send("Application status: ERROR");
    
  }
};

router.post("/create-sandbox", start);


async function start(req: Request, res: Response): Promise<void> {
  //checkAuth(req, res);
  // recive response object with info [userId] [School]?
  // UserId generate course code
  // const userId = req.body.userId;
  const userId = "u1rt0vw0";
  // const school = req.body.school;
  const school = "ABE";
  log.info("Information supplied");
  //const userName = await getUser(userId);
  //log.info(userName);
  // // Post call to api for create course with [name],[course_code],
  // await createCourse(userName, school);
  // log.info(`Course "Sandbox ${userName}" created`);
  // // /api/v1/accounts/:account_id{school}/courses
  // // Post call to api for enroll user and teststudents
  // await enrollUser(userId, userName, "TeacherEnrollment");
  // log.info(`${userName} was enrolled as Teacher.`);

  // for (const testStudent in testAccountIds){
  //   await enrollUser(testStudent, userName, "StudentEnrollment");
  // }
  // log.info(`Test students have been enrolled.`)
  // [userId], [type], [enrollment_state],
  // url:POST|/api/v1/courses/:course_id/enrollments
}

