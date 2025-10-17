/** Singleton object for Canvas API */
import { CanvasApi } from "@kth/canvas-api";
import { CourseInfo, ROLES } from "./router";

function  getCanvasApiConnection(token: string) {
  const canvas_api_url = process.env.CANVAS_API_URL || "https://kth.test.instructure.com/"
  const canvas = new CanvasApi(canvas_api_url + "api/v1/", token);
  return canvas;
}

interface Role {
  role_id: number;
}

async function getUser(token: string, userId: string) {
  const canvas = getCanvasApiConnection(token);
  return canvas.get(`users/sis_login_id:${userId}/profile`);
}

async function getRole(token: string): Promise<Role[] | undefined> {
  const canvas = getCanvasApiConnection(token);
  return (await canvas.get(`accounts/1/admins/self`)).json;
}

async function getCoursesForUser(token: string, userId: string){
  const canvas = getCanvasApiConnection(token);
  return canvas.listItems(`users/${userId}/courses`);
}

async function createCourse(token: string, courseInfo: Pick<CourseInfo, "name" | "course_code">, subAccountId: string) {
  const canvas = getCanvasApiConnection(token);
  return canvas.request(`accounts/${subAccountId}/courses`, "POST", { course: courseInfo });
}

async function enrollUser(token: string, userId: string, courseId: string, role: ROLES) {
  const canvas = getCanvasApiConnection(token);
  let user = {
    enrollment: {
      user_id: userId,
      role_id: role,
      enrollment_state: "active",
    },
  };

  return canvas.request(`courses/${courseId}/enrollments`, "POST", user);
}

export { getUser, getRole, createCourse, enrollUser, getCoursesForUser };
