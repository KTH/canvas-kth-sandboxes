import { describe, test } from "@jest/globals";
import { CanvasApiMock } from "./__mocks__/@kth/canvas-api";
import { createSandbox} from "../router";

CanvasApiMock.get("users/sis_user_id:1234/profile", { body: { login_id: "get_user_id@kth", id: "get_user_id" } });
CanvasApiMock.request("accounts/school_id/courses", "POST", { body: { id: "course_id" } });
for (let i = 0; i < 7; i++) {
  CanvasApiMock.request(`courses/user_id_${i}/enrollments`, "POST", { body: undefined });
}


describe("Testing logic for creating sandboxes", () => {


  test("testsuite works", () => { });


  test("CreateSandbox, input res and req output html", async () => {
    const accessToken = "access_token";
    const userId = "1234";
    const schoolId = "school_id";
    const response = await createSandbox(userId, schoolId, accessToken);
    expect(CanvasApiMock.result()).toMatchSnapshot();
    expect(response).toMatchSnapshot();


  });
});
