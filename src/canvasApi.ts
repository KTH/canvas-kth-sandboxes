/** Singleton object for Canvas API */
const { default: CanvasApi, minimalErrorHandler } = require("@kth/canvas-api");

const canvas = new CanvasApi(
    process.env.CANVAS_API_URL,
    process.env.CANVAS_API_KEY
);

canvas.errorHandler = minimalErrorHandler;

async function getUser(userId:string) {
    return await canvas.get(`users/sis_user_id:${userId}`);
}

async function createCourse(user_name: string, school: string){
    const course = {
        "course[name]" : `Sandbox ${user_name}`,
        "course[course_code]" : `Sandbox ${user_name}`,
    }
    return await canvas.request(`accounts/${school}-Sandbox/courses`, "POST", course);
}

async function enrollUser(userId: string, userName: string, type: string){
    const course_id = `Sandbox ${userName}` 
    const user = {
        "enrollment[userId]" : userId,
        "enrollment[type]" : type,
        "enrollment[enrollment_state]" : "active"
    }
    return await canvas.request(`courses/:${course_id}/enrollments`, "POST", user);
}

export {
    getUser,
    createCourse,
    enrollUser
}