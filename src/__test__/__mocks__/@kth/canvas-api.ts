type MockRes = {
    body : any
}

const _mockValues : {
    get: Record<string, MockRes>;
    request: Record<string, MockRes>;
    _result: Record<string, any>;
} =
{
    get: {},
    request: {},
    _result: {},
};

export class CanvasApiMock{
    static get(url:string, value:MockRes){
        if(_mockValues.get[url])
            throw new Error(`Mock value already exists for ${url}`);
        _mockValues.get[url] = value;
    }

    static request(url:string, _method:string, value:MockRes){
        if(_mockValues.request[url])
            throw new Error(`Mock value already exists for ${url}`);
        _mockValues.request[url] = value;
    }

    static result(){
        return _mockValues["_result"];
    }

        
}

export default class CanvasApi{

    _baseUrl:string = "";
    _token:string = "";
    constructor(url:string, token:string){
        this._baseUrl = url;
        this._token = token;

    }

    async get(url:string) {
        return _mockValues.get[url];
    }

    async request(url:string, method:string, params:Record<string, any> ){
        if (method !== "POST"){
            throw new Error(`This mock does not support ${method}`);
        }
        _mockValues["_result"][url] = params;
        return _mockValues.request[url];
    }
}