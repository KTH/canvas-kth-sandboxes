import {createSandbox, checkAuth} from "../router";
import mockCanvasApi from "../canvasApi";
import { getMockReq, getMockRes } from "@jest-mock/express";

jest.mock('./canvasApi');
const mockValue = {body : {
    id:"1234",
    login_id: "id@kth.se"
}}
mockCanvasApi.get.mockImplementation(() => Promise.resolve(mockValue));

describe("Testing Router", () => {

    const {res} = getMockRes();



test("testsuite works", () => {});

// test("test check auth", () => {

//     const req = {session : {accessToken : ""}} as Request;
//     expect(checkAuth(req, res))
// })

test("input res and req output html", () => {
    expect(createSandbox(getMockReq({path: "https:///public", method: "get"}), res)).toBe(String)
})
});