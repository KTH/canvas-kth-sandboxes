import {
  createCourse,
  enrollUser,
  getUser,
  getRole,
  getCoursesForUser,
} from "./canvasApi";
import {
  NextFunction,
  Request,
  Response,
  Router,
  static as staticMiddleWare,
} from "express";
import log from "skog";
import path from "path";

const TEST_ACCOUNT_IDS = ["97021", "97017", "97016", "97018", "97020", "97019"];
const KTH_DEV_ID = 18;
const COURSE_CORDINATOR = "9";
const TEACHER = "4";
const STUDENT = "3";

const router = Router();
router.get("/", (req: Request, res: Response) => {
  res.redirect("/canvas-kth-sandboxes/public");
});
router.use("/public", checkUserMiddleware);
router.use("/public", staticMiddleWare(path.join(__dirname, "html")));
router.get("/_monitor", monitor);

async function checkUserMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    if (!(await checkAuth(req, res))) {
      res.redirect("/canvas-kth-sandboxes/auth");
    } else if (!(await checkPermission(req, res))) {
      res
        .status(403)
        .send("Användaren har inte behörighet att utföra åtgärden");
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}

async function checkAuth(req: Request, res: Response): Promise<boolean> {
  if (!req.session.accessToken) {
    return false;
  }else if(req.session.expiresAt){
    const nowInSeconds = Math.floor(Date.now()/1000);
    if (req.session.expiresAt < nowInSeconds)
      return false;
  }
  return true;
}

async function checkPermission(req: Request, res: Response) {
  if (!req.session.accessToken) {
    return false;
  }

  const role = await getRole(req.session.accessToken);

  if (!role) {
    return false;
  }
  if (!role.find((r) => (r.role_id = KTH_DEV_ID))) {
    return false;
  }
  return true;
}

async function monitor(req: Request, res: Response) {
  try {
    res.send("APPLICATION_STATUS: OK");
  } catch (error) {
    log.error("Error: something went wrong.");
    res.send("Application status: ERROR");
  }
}

router.post("/create-sandbox", async (req, res, next) => {
  const userName = req.body.userId;
  const schoolId = req.body.school;
  const accessToken = req.session.accessToken;
  if (!accessToken) {
    return;
  }
  const response = await createSandbox(userName, schoolId, accessToken).catch(
    next,
  );
  // errorHandler returns undefined when error occurs.
  if (response) {
    res.send(response);
  }
});

async function createSandbox(userName: string, schoolId: string, accessToken: string): Promise<any> {
  if (!userName.includes("@")) userName = userName + "@kth.se";

  const user = await getUser(accessToken, userName);
  const userId = user.json.id;
  userName = userName.split("@")[0];

  type courseInfo = {
    name: string;
    account_id: string;
  };

  // Kolla om det finns en sandbox för andvändaren och under samma konto
  const userCoursesList = await getCoursesForUser(accessToken, userId);
  const userCourses = await userCoursesList.toArray();
  if (
    userCourses.find(
      (course: courseInfo) =>
        course.name === `Sandbox ${userName}` && course.account_id == schoolId,
    )
  ) {
    return `There is already a course for ${userName}`;
  }

  const course = await createCourse(accessToken, userName, schoolId);
  log.info(`Course created for ${userName}.`);

  // Lägg till användaren som både lärare och kursansvarig
  const courseId = course.json.id;
  await enrollUser(accessToken, userId, courseId, COURSE_CORDINATOR);
  await enrollUser(accessToken, userId, courseId, TEACHER);

  for (const testStudent of TEST_ACCOUNT_IDS) {
    await enrollUser(accessToken, testStudent, courseId, STUDENT);
  }
  log.info(`${userName} and teststudents have been enrolled.`);

  // return html code to add variable in the message, use a framework to make prettier.
  const htmlRes = `
  <!DOCTYPE html>  
  <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sandbox for Canvas@kth</title>
    </head>
    <body>
        <h1 id="message">Sandbox have been created for ${userName}</h1>
        <p><a target="_blank" href="${process.env.CANVAS_API_URL}courses/${courseId}">URL to Sandbox (opens in new tab) </a></p>
        <p><a href="${process.env.PROXY_HOST}/canvas-kth-sandboxes/public"> Create another sandbox? click here </a></p>
    </body>
  </html>
  <style>
  body{
    font-family: Arial, Helvetica, sans-serif;
    padding: 25px;
    font-color: black;
  }
  </style>
`;

  return htmlRes;
}

export default router;

export { checkAuth, createSandbox };
