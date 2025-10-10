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

const SANDBOX_IDS = ["16", "65", "61", "43", "44", "69"];
const TEST_ACCOUNT_IDS = ["97021", "97017", "97016", "97018", "97020", "97019"];
const KTH_DEV_ID = 18;
const COURSE_CORDINATOR = "9";
const TEACHER = "4";
const STUDENT = "3";
export enum ROLES {
  STUDENT = 3,
  COURSE_CORDINATOR = 9,
  TEACHER = 4
}

const ACCOUNTS = {
  "ABE - Manually created course rounds": "15",
  "ABE - Sandboxes": "16",
  "ABE - Studios and courses": "48",
  "KTH Internal Training Courses": "218",
  "CBH - Manually created course rounds": "64",
  "CBH - Sandboxes": "65",
  "EECS - Manually created course rounds": "60",
  "EECS - Sandboxes": "61",
  "ITM - Manually created course rounds": "35",
  "ITM - Sandboxes": "43",
  "SCI - Manually created course rounds": "36",
  "SCI - Sandboxes": "44",
  "VS - Manually created course rounds": "68",
  "VS - Sandboxes": "69",
}

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
  } else if (req.session.expiresAt) {
    const nowInSeconds = Math.floor(Date.now() / 1000);
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
  if (!role.find((r) => (r.role_id === KTH_DEV_ID))) {
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
  const courseInfo = {
    courseName: req.body.courseName,
    courseCode: req.body.courseCode,
    userName: req.body.userId,
    accountId: req.body.canvasAccount,
    // testStudents: req.body.testStudents,
  }
  const accessToken = req.session.accessToken;

  if (!accessToken) {
    return;
  }
  const response = await createSandbox(courseInfo, accessToken).catch(
    next,
  );
  // errorHandler returns undefined when error occurs.
  if (response) {
    res.send(response);
  }
});

async function createSandbox(courseInfo: any, accessToken: string): Promise<any> {
  if (!courseInfo.userName.includes("@")) courseInfo.userName = courseInfo.userName + "@kth.se";

  const user = await getUser(accessToken, courseInfo.userName);
  const userId = user.json.id;
  courseInfo.userName = courseInfo.userName.split("@")[0];

  type courseInfo = {
    name: string;
    account_id: string;
  };

  let course;

  if (SANDBOX_IDS.includes(courseInfo.accountId)) {
    // For sandboxes
    // Check if user already have a Sandbox under the same subaccount
    const userCoursesList = await getCoursesForUser(accessToken, userId);
    const userCourses = await userCoursesList.toArray();
    if (
      userCourses.find(
        (course: courseInfo) =>
          course.name === `Sandbox ${courseInfo.userName}` && course.account_id == courseInfo.accountId,
      )
    ) {
      return `There is already a Sandbox for ${courseInfo.userName}`;
    }

    const data = {
      course: {
        name: `Sandbox ${courseInfo.userName}`,
        course_code: `Sandbox ${courseInfo.userName}`,
      },
    };

    course = await createCourse(accessToken, data, courseInfo.accountId);

  } else {
    // is not a Sandbox
    const data = {
      course: {
        name: `${courseInfo.courseName}`,
        course_code: `${courseInfo.courseCode}`,
      },
    };

    course = await createCourse(accessToken, data, courseInfo.accountId);

  }

  log.info(`Course created for ${courseInfo.userName}.`);

  // Lägg till användaren som både lärare och kursansvarig
  const courseId = course.json.id;
  await enrollUser(accessToken, userId, courseId, COURSE_CORDINATOR);
  await enrollUser(accessToken, userId, courseId, TEACHER);

  if (SANDBOX_IDS.includes(courseInfo.accountId)) {
    for (const testStudent of TEST_ACCOUNT_IDS) {
      await enrollUser(accessToken, testStudent, courseId, STUDENT);
    }

    log.info(`${courseInfo.userName} and teststudents have been enrolled.`);
  }

  // return html code to add variable in the message, use a framework to make prettier.
  const htmlRes = `
  <!DOCTYPE html>  
  <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Canvas course room</title>
    </head>
    <body>
        <h1 id="message">Course room have been created for ${courseInfo.userName}</h1>
        <p><a target="_blank" href="${process.env.CANVAS_API_URL}courses/${courseId}">URL to course room (opens in new tab) </a></p>
        <p><a href="${process.env.PROXY_HOST}/canvas-kth-sandboxes/public"> Create another course room in Canvas? click here </a></p>
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
