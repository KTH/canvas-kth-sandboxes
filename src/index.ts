
import "./config/start";
import {createCourse, enrollUser, getUser, getSchoolAccountId, getSandboxAccountId} from "./canvasApi"
import {Request, Response } from "express";
import log from "skog";
import path from "path";
import { getNameOfDeclaration } from "typescript";
import authRouter from "./auth/auth";
import router from "./server";

const testAccountIds: string[] = [
  "97021",
  "97017",
  "97016",
  "97018",
  "97020",
  "97019",
];

router.use("/auth", authRouter);
//router.use("/public", homepage);
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

  const sisUserId = "u1rt0vw0";
  const school = "ABE";

  const user = await getUser(sisUserId);
  
  const userName = user.body.login_id.split("@")[0];
  const userId = user.body.id;

  const schoolAccountId = await getSchoolAccountId(school);
  const sandboxAccountId = await getSandboxAccountId(schoolAccountId, school);
  const course = await createCourse(userName, sandboxAccountId);
  const courseId = course.body.id;

  await enrollUser(userId, courseId, "TeacherEnrollment");
  log.info(`was enrolled as Teacher.`);

  for (const testStudent of testAccountIds){
    await enrollUser(testStudent, courseId, "StudentEnrollment");
  }
  log.info(`Test students have been enrolled.`)

}

