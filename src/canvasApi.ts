/** Singleton object for Canvas API */
const { default: CanvasApi, minimalErrorHandler } = require("@kth/canvas-api");
import log from "skog";

const canvas = new CanvasApi(
    process.env.CANVAS_API_URL + "api/v1/",
    process.env.CANVAS_API_TOKEN
);

canvas.errorHandler = minimalErrorHandler;

async function getUser(userId:string) {
    try{
        return canvas.get(`users/sis_user_id:${userId}/profile`);
    }catch{
        // throw Not found Error and show Error page
    }
}
interface Role {
    role_id : number
}

async function getRole(): Promise<Role[] | undefined>{
    try{
        return (await canvas.get(`accounts/1/admins/self`)).body;
    }catch{
        // throw permission error
        return;
    }
}

async function createCourse(user_name: string, subAccountId: string){
    try{const courseInfo = {course :{
        name: `Sandbox ${user_name}`,
        course_code : `Sandbox ${user_name}`,
    }}
    return await canvas.request(`accounts/${subAccountId}/courses`, "POST", courseInfo);}
    catch {

    }
}

async function enrollUser(userId: string, courseId: string, type: string){
    const user = {enrollment : {
        user_id : userId,
        type : type,
        enrollment_state : "active"
    }}
    return await canvas.request(`courses/${courseId}/enrollments`, "POST", user);
}

export {
    getUser,
    getRole,
    createCourse,
    enrollUser,
}