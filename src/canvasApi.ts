/** Singleton object for Canvas API */
const { default: CanvasApi, minimalErrorHandler } = require("@kth/canvas-api");

const canvas = new CanvasApi(
    process.env.CANVAS_API_URL,
    process.env.CANVAS_API_KEY
);

canvas.errorHandler = minimalErrorHandler;

async function getUser(userId:string) {

    return await canvas.get(`users/sis_user_id:${userId}/profile`);

}

async function getAccountId(school:string) {

    // get the right school account 
    const accounts = await canvas.get("course_creation_accounts");
    for (const account in accounts){
        if (account.name == school){
            SchoolAccountId = account.id;
            break;
        }
        else{
            log.error(`${school} Is not an account.`);
        }
    }
    // get the right sub-account
    
}

async function createCourse(user_name: string, school: string){
    const course = {
        name: `Sandbox ${user_name}`,
        course_code : `Sandbox ${user_name}`,
    }
    return await canvas.request(`accounts/${school}-Sandboxes/courses`, "POST", course);
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