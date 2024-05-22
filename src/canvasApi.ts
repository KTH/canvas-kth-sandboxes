/** Singleton object for Canvas API */
const { default: CanvasApi, minimalErrorHandler } = require("@kth/canvas-api");
import log from "skog";

const canvas = new CanvasApi(
    process.env.CANVAS_API_URL,
    process.env.CANVAS_API_KEY
);

canvas.errorHandler = minimalErrorHandler;

type accountType = {
    name: string,
    id: string
}

async function getUser(userId:string) {
    try{
        return canvas.get(`users/sis_user_id:${userId}/profile`);
    }catch{
        // throw Not found Error and show Error page
    }
}

async function getRole(){
    try{
    return canvas.get(`accounts/1/admins/self`);
    }catch{
        // throw permission error
    }
}
// refactor to only an api call
async function getSchoolAccountId(school:string) {
    let schoolAccountId: string = "";
    const res = canvas.get("course_creation_accounts");
    const accounts: accountType[] = res.body;
    for (const account of accounts){
        if (account.name == school){
            schoolAccountId = account.id;
            break;
        }
    }

    return schoolAccountId;
}

// refactor to only an api call
async function getSandboxAccountId(schoolAccountId: string, school: string){
    const resp = canvas.get(`accounts/${schoolAccountId}/sub_accounts`);
    const sandboxAccounts: accountType[] = resp.body;
    let sandboxAccountId: string ="";
    for (const account of sandboxAccounts){
        if (account.name == `${school} - Sandboxes`){
            sandboxAccountId = account.id;
            break;
        }
    }
    
    return sandboxAccountId;
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
    getSchoolAccountId,
    getSandboxAccountId
}