/** Singleton object for Canvas API */
const { default: CanvasApi, minimalErrorHandler } = require("@kth/canvas-api");
import { CanvasApiError } from "@kth/canvas-api";
import log from "skog";

function getCanvasApiConnection(token: string){
    const canvas = new CanvasApi(
        process.env.CANVAS_API_URL + "api/v1/",
        token
    );
    canvas.errorHandler = minimalErrorHandler;
    return canvas;
}

interface Role {
    role_id : number
}

async function getUser(token:string, userId:string) {

    const canvas = getCanvasApiConnection(token);
    return canvas.get(`users/sis_user_id:${userId}/profile`);

}

async function getRole(token:string): Promise<Role[] | undefined>{
    const canvas = getCanvasApiConnection(token);

    return (await canvas.get(`accounts/1/admins/self`)).body;
}

async function createCourse(token:string, user_name: string, subAccountId: string){
    const canvas = getCanvasApiConnection(token);
    const courseInfo = {course :{
        name: `Sandbox ${user_name}`,
        course_code : `Sandbox ${user_name}`,
    }}
    return canvas.request(`accounts/${subAccountId}/courses`, "POST", courseInfo);
}

async function enrollUser(token:string, userId: string, courseId: string, type: string){
    const canvas = getCanvasApiConnection(token);
    const user = {enrollment : {
        user_id : userId,
        type : type,
        enrollment_state : "active"
    }}
    return canvas.request(`courses/${courseId}/enrollments`, "POST", user);
}

export {
    getUser,
    getRole,
    createCourse,
    enrollUser,
}

