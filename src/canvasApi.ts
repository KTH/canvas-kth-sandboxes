/** Singleton object for Canvas API */
const { default: CanvasApi, minimalErrorHandler } = require("@kth/canvas-api");
import log from "skog";

const canvas = new CanvasApi(
    process.env.CANVAS_API_URL + "api/v1/",
    process.env.CANVAS_API_TOKEN
);

interface Role {
    role_id : number
}

canvas.errorHandler = minimalErrorHandler;

async function getUser(userId:string) {
    
    return canvas.get(`users/sis_user_id:${userId}/profile`);
}

async function getRole(token:string): Promise<Role[] | undefined>{
    const canvas = new CanvasApi(
        process.env.CANVAS_API_URL + "api/v1/",
        token
    );

    return (await canvas.get(`accounts/1/admins/self`)).body;
}

async function createCourse(user_name: string, subAccountId: string){
    const courseInfo = {course :{
        name: `Sandbox ${user_name}`,
        course_code : `Sandbox ${user_name}`,
    }}
    return canvas.request(`accounts/${subAccountId}/courses`, "POST", courseInfo);
}

async function enrollUser(userId: string, courseId: string, type: string){
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

export default canvas