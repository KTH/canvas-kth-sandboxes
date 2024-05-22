
import "./config/start";
import {createCourse, enrollUser, getUser, getSchoolAccountId, getSandboxAccountId, getRole} from "./canvasApi"
import {Request, Response } from "express";
import log from "skog";
import path from "path";
import { getNameOfDeclaration } from "typescript";
import authRouter from "./auth/auth";
import router from "./server";
import { SessionData } from "express-session";

const testAccountIds = [
  "97021",
  "97017",
  "97016",
  "97018",
  "97020",
  "97019",
];
const SCHOOL_IDS = new Map([["ABE","1234"],["VS","1234"]]);

router.use("/auth", authRouter);
router.use("/public", homepage);
router.get("/public", (req, res) => {
  res.sendFile(path.join(__dirname, '/html/index.html'));
});
router.get("/_monitor", monitor);


async function homepage(req: Request, res: Response, next: Function){
  if(!await checkAuth(req, res)){
    res.status(403).json({message: "Permission denied, du saknar behörighet för den här appen."});
  }else{
    next();
  }
}

async function checkAuth(req: Request, res: Response){
  if(!req.session.accessToken){
    log.error("User is not authenticated");
    res.redirect("/canvas-kth-sandboxes/auth");
  }else {
    if(!await checkAccess(req, res)){
      return false;
    }
  }
  return true;
}

async function checkAccess(req: Request, res:Response){
  const role = await getRole();
  if (!role){
    return false;
  }
  if (!role.find(r => r.role_id = 18)){
     return false;
  }
  return true;
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
  const sisUserId = req.body.userId;
  const school = req.body.school.toUpperCase();


  const schoolId = SCHOOL_IDS.get(school);
  if (!schoolId){
    res.send("School does not have a Sandbox account");
    return;
  }

  const user = await getUser(sisUserId);
  if (!user){
    res.send("SIS Id does not exist");
    return;
  }
  const userName = user.body.login_id.split("@")[0];
  const userId = user.body.id;


  // const schoolAccountId = await getSchoolAccountId(school);
  // const sandboxAccountId = await getSandboxAccountId(schoolAccountId, school);
  const course = await createCourse(userName, schoolId);
  const courseId = course.body.id;

  await enrollUser(userId, courseId, "TeacherEnrollment");

  for (const testStudent of testAccountIds){
    await enrollUser(testStudent, courseId, "StudentEnrollment");
  }

  const htmlRes= `
  <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sandbox for Canvas@kth</title>
    </head>
    <body>
        <h1 id="message">Sandbox have been created for ${userName}</h1>

    </body>
    </html>
  `

  res.send(htmlRes);

}

