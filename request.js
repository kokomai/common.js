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
    setAToken : function(tokn) {
        sessionStorage.setItem("aToken", tokn);
    },
    // access token 삭제(sessionStorage)
    delAToken : function() {
        sessionStorage.removeItem("aToken");
    },
    // 최초 token 셋팅
    requestToken : function(params) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "/loginCheck.do"
                , data: params
                , type: "POST"
                , async: false
                , dataType: "JSON"
                , success: function(res) {
                	console.log("success" + res);
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
        xhr.setRequestHeader("X-AUTH-RTOKEN", rToken);
        xhr.setRequestHeader("X-AUTH-ATOKEN", aToken);
    },
    // get ajax
    get :  function(url, params, successF, errorF) {
        try {
            return new Promise(async (resolve, reject) => {
				COMM.loading();
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
                    , beforeSend: REQ.rTokenHeader
                    , success: function(res, stat, req) {
                        successF(res, stat, req);
                        resolve(res, stat, req);
						COMM.loading(false);
                    }
                    , error : function(res) {
                        errorF(res);
                        reject(res);
						COMM.loading(false);
                    }
                });
            });
        } catch(e) {
            console.error(e);
        }
    },
    // post ajax
    post : async function(url, params, successF, errorF) {
        try {
            return new Promise(async (resolve, reject) => {
				COMM.loading();
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
                    , beforeSend: REQ.rTokenHeader
                    , success: function(res, stat, req) {
                        successF(res, stat, req);
                        resolve(res, stat, req);
						COMM.loading(false);
                    }
                    , error : function(res) {
                        errorF(res);
                        reject(res);
						COMM.loading(false);
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
            // object 형태의 데이터가 있을 시 세션스토리지에 저장.. 가져오는 것은 common.js 내의 COMM.getPageData 사용
            if(data !== undefined && data !== null && typeof data === "object") {
                sessionStorage.setItem("pageData", JSON.stringify(data));
            }

            $.ajax({
                url: url
                , data: {}
                , type: "GET"
                , async : true
                , beforeSend: REQ.rTokenHeader
				, success : function(res, stat, req) {
					location.href = url;
				}
            });
			
        } catch(e) {
            console.log(e);
        }
    },
	// 팝업 보여주기
	// 팝업 파일 경로는 반드시 static/popup 안으로..
	// 하위 파일 경로 및 파일명 -> /login/test(login 폴더에 있는 test.html)
	openPopup : function(file) {
		var el = document.getElementById("__popup");
		var path = "/popup" + file + ".html";
		REQ.requestHtmlInclude(path, el);
	},
	// 팝업 닫기
	closePopup : function() {
		document.getElementById("__popup").style.display = "none";
	},
	// 팝업 닫기 이벤트를 id로 binding
	// 부모 js에서 이를 셋팅해주면 팝업 닫칠 시 callback 설정도 가능
	setClosePopup : function(id, callback) {
		// 팝업 내부의 element에 event를 binding
		document.addEventListener('click', function(e) {
		    if(e.target
			&& e.target.id === id 
			&& document.querySelector("#" + id).closest("#__popup")){
	         	REQ.closePopup();
				callback();
		     }
		 });
	},
	// html을 특정 div에 넣기	
	requestHtmlInclude: function(path, el) {
		if (path) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 
					&& this.status == 200
					&& !this.responseURL.includes("login.view") ) {
                    el.innerHTML = this.responseText;
					el.style.display = "block";
                }
            };

			let rToken = REQ.getRToken();
        	let aToken = REQ.getAToken();

            xhttp.open('GET', path + "?"+ parseInt(Date.now()/1000), true);
            xhttp.setRequestHeader("X-AUTH-RTOKEN", rToken);
            xhttp.setRequestHeader("X-AUTH-ATOKEN", aToken);
            xhttp.send();
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


