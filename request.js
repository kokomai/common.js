/**
 * jquery + ajax + jwt 토큰 관련 함수
 * @author : coding-orca
 * All copyright reserved by https://github.com/kokomai
 */

const REQ = {
    // refresh token 가져오기(localStorage)
    getRToken : function() {
        return localStorage.getItem("rToken");
    },
    // refresh token 셋팅(localStorage)
    setRToken : function(tokn) {
        localStorage.setItem("rToken", tokn);
    },
    // refresh token 삭제(localStorage)
    delRToken : function() {
        localStorage.removeItem("rToken");
    },
    // access token 가져오기(sessionStorage)
    getAToken : function() {
        return sessionStorage.getItem("aToken");
    },
    // access token 셋팅(sessionStorage)
    setAToken : function() {
        sessionStorage.getItem("aToken", tokn);
    },
    // access token 삭제(sessionStorage)
    delAToken : function() {
        sessionStorage.removeItem("aToken");
    },
    // 최초 token 셋팅
    requestToken : function() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "/reqTokn"
                , data: ""
                , type: "POST"
                , async: false
                , dataType: "JSON"
                , success: function(res) {
                    REQ.setAToken(res.aToken);
                    REQ.setRToken(res.rToken);
                    resolve(res);
                }
                , error: function(res) {
                    reject(res);
                }
            });
        });
    },
    // access token 헤더값 설정
    aTokenHeader : function(xhr) {
        let aToken = REQ.getAToken();
        xhr.setRequestHeader("Content-type","application/json");
        xhr.setRequestHeader("Authorization","JWT " + aToken);
    },
    // access token 만료시 refresh token 헤더값 설정
    rTokenHeader : function(xhr) {
        let rToken = REQ.getRToken();
        let aToken = REQ.getAToken();
        xhr.setRequestHeader("Content-type","application/json");
        xhr.setRequestHeader("Authorization","JWT " + rToken);
        // TODO: a토큰도 추가 해야함
        xhr.setRequestHeader("Authorization","JWT " + aToken);
    },
    // 전처리(토큰값이 유효한지..)
    preFunc : function() {
        // access 토큰 먼저
        return new Promise((resolve, reject) => {
                $.ajax({
                url : "/accTokn"
                // 아래는 테스트용
                // url: "https://jsonplaceholder.typicode.com/photos"
                , data: REQ.getAToken()
                , data: {}
                , type: "GET"
                , async: false
                , dataType: "JSON"
                , beforeSend: REQ.aTokenHeader
                , success: function(res) {
                    REQ.setAToken(res.aToken);
                    resolve(res);
                }
                , error: function(res) {
                    // TODO : access 토큰 만료 code 값은 프로젝트 별로 다름
                    if(res.code === "9999") {
                        // access 토큰 만료시, refresh 토큰 요청
                        $.ajax({
                            url : "/refTokn"
                            // 아래는 테스트용
                            // url: "https://jsonplaceholder.typicode.com/photos"
                            , data: REQ.getRToken()
                            , data : {}
                            , type: "GET"
                            , async: false
                            , dataType: "JSON"
                            , beforeSend: REQ.rTokenHeader
                            , success: function(res) {
                                REQ.setAToken(res.aToken);
                                REQ.setRToken(res.rToken);
                                resolve(res);
                            }
                            , error: function(res) {
                                reject(res);
                            }
                        });
                    } else {
                        reject(res);
                    }
                }
            });
        });
    },
    // get ajax
    get : function(url, params, successF, errorF) {
        try {
            return new Promise(async (resolve, reject) => {
                let response = await REQ.preFunc();
            
                if(typeof errorF !== "function") {
                    errorF = function(e) {
                        console.log(e);
                    }
                }

                $.ajax({
                    url: url
                    , data: params
                    , type: "GET"
                    , async : false
                    , dataType: "JSON"
                    , beforeSend: REQ.aTokenHeader
                    , success: function(res) {
                        successF(res);
                        resolve(res);
                    }
                    , error : function(res) {
                        errorF(res);
                        reject(res);
                    }
                });
            });
        } catch(e) {
            console.error(e);
        }
    },
    // post ajax
    post : function(url, params, successF, errorF) {
        try {
            return new Promise(async (resolve, reject) => {
                let response = await REQ.preFunc();
            
                if(typeof errorF !== "function") {
                    errorF = function(e) {
                        console.log(e);
                    }
                }

                $.ajax({
                    url: url
                    , data: params
                    , type: "POST"
                    , async : false
                    , dataType: "JSON"
                    , beforeSend: REQ.aTokenHeader
                    , success: function(res) {
                        successF(res);
                        resolve(res);
                    }
                    , error : function(res) {
                        errorF(res);
                        reject(res);
                    }
                });
            });
        } catch(e) {
            console.error(e);
        }
    },
    // 페이지 이동
    // url: 이동할 페이지 url
    // data : 이동할 페이지로 넘길 object (반드시 object 형태로 넘겨줄 것 ex : {"data" : "데이터", "list" : ['1', '2']})
    location : async function(url, data) {
        try {
            let response = await REQ.preFunc();

            // object 형태의 데이터가 있을 시 세션스토리지에 저장.. 가져오는 것은 common.js 내의 COMM.getPageData 사용
            if(data !== undefined && data !== null && typeof data === "object") {
                sessionStorage.setItem("pageData", JSON.stringify(data));
            }

            location.href = url;
            
        } catch(e) {
            console.log(e);
        }
    }
}

// export { CONN }

/*
    test 영역
*/ 

// 동기, 비동기 호출 예시
async function asyncTest() {
    let temp = await REQ.get("https://jsonplaceholder.typicode.com/todos/1", {}, function() { console.log("req callback1") });
    console.log(temp);
    let temp2 = await REQ.get("https://jsonplaceholder.typicode.com/todos/2", temp, function() { console.log("req callback2") });
    console.log(temp2);
    REQ.get("https://jsonplaceholder.typicode.com/todos/3", temp2, function() { console.log("req callback3") });
}

asyncTest();


