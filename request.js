/**
 * fetch(jquery + ajax) + jwt 토큰 관련 함수
 * @author : coding-orca
 * All copyright reserved by https://github.com/kokomai
 */

 const REQ = {
	// 팝업 html을 저장해 놓는 위치
	popupFolder: "/static/popup/",
	popupJsFolder: "/static/popup/popupJs/",
	popupType: ".html",
	// token 값을 무시하고 페이지 이동하고 싶은 경우 여기에 해당 url 등록 
	ignoreList : [
		"/"
	],
	checkLoginUrl: "/checkLogin",
	loginPage: "/view/login",
	// loading 함수 정의
	loading : function(boo) {
		COMM.loading(boo);
	},
    // refresh token 가져오기(sessionStorage)
    getRToken : function() {
        return sessionStorage.getItem("rToken");
    },
    // refresh token 셋팅(sessionStorage)
    setRToken : function(tokn) {
        sessionStorage.setItem("rToken", tokn);
    },
    // refresh token 삭제(sessionStorage)
    delRToken : function() {
        sessionStorage.removeItem("rToken");
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
    // get request
	/*
		options : {
			url : 요청 url
			params : 전달할 파라미터 ({})
			async : true
			    -> false 선택시 순차적으로 진행 (ajax 사용시)
			success : 성공시 호출할 콜백 함수
			error : 에러시 호출할 콜백 함수
			noLoading : true
				-> true 설정시, loading 없이 호출
			keepLoading : true 
				-> 여러번 비동기로 호출 시 앞서 호출한 요청이 loading을 가리지 않게 하기
		}
	*/
    get : function(options) {
		let url = "";
		let params = {};
		let successF = function(res) {
			console.log(res);
		};
		let errorF = function(res) {
			console.error(res);
		};
		let isLoading = true;
		let isHideLoading = true;
		let async = true;
		
		if(typeof options === "object") {
			if(options.url) {
				url = options.url
			}
			if(options.params) {
				params = options.params
			}
			if(options.success) {
				successF = options.success
			}
			if(options.error) {
				errorF = options.error
			}
			if(options.noLoading != undefined || options.noLoading != null) {
				isLoading = !options.noLoading
			}
			if(options.keepLoading != undefined || options.keepLoading != null) {
				isHideLoading = !options.keepLoading
			}
			// ajax 사용시 활성화
			//  if (options.async != undefined || options.async != null) {
			//  	async = options.async
			//  }
		}
		
		if(isLoading) {
			REQ.loading();
		}
	    	
		let paramsKeys = Object.keys(params);

		for(let key of paramsKeys) {
			if(!url.includes('?')) {
				url = url + '?' + key + '=' +params[key];
			} else {
				url = url + '&' + key + '=' + params[key];
			}
		}
		
        try {
			return fetch(
				url,
				{
					method: 'GET',
					headers: {
						"Content-type" : "application/json",
						"X-AUTH-RTOKEN" : REQ.getRToken(),
						"X-AUTH-ATOKEN" : REQ.getAToken()
					},
				}
			).then((res) => {
				REQ.setAToken(res.headers.get("X-AUTH-ATOKEN"));
				successF(res);

				if(isHideLoading) {
					REQ.loading(false);	
				}
			}).catch((err) =>{
				errorF(err);

				if(isHideLoading) {
					REQ.loading(false);	
				}
			});
			/*
			$.ajax({
				url: url
				, data: params
				, type: "GET"
				, contentType: "application/json"
				, async: async
				, success: function(res, stat, req) {
					successF(res, stat, req);
					
					if (isHideLoading) {
						REQ.loading(false);
					}
				}
				, error: function(res) {
					errorF(res);
					
					if (res.status === 403) {
						alert("세션이 끊겼습니다.");
						location.href = "/";
					}
					
					if (isHideLoading) {
						REQ.loading(false);
					}
				}
			});
			*/
        } catch(e) {
			console.error(e);
        }
    },
    // post request
	/*
		options : {
			url : 요청 url
			params : 전달할 파라미터 ({})
			async : true
			    -> false 선택시 순차적으로 진행 (ajax 사용시)
			success : 성공시 호출할 콜백 함수
			error : 에러시 호출할 콜백 함수
			noLoading : true
				-> true 설정시, loading 없이 호출
			keepLoading : true 
				-> 여러번 비동기로 호출 시 앞서 호출한 요청이 loading을 가리지 않게 하기
		}
	*/
    post : function(options) {
		let url = "";
		let params = {};
		let successF = function(res) {
			console.log(res);
		};
		let errorF = function(res) {
			console.error(res);
		};
		let isLoading = true;
		let isHideLoading = true;
		
		if(typeof options === "object") {
			if(options.url) {
				url = options.url
			}
			if(options.params) {
				params = options.params
			}
			if(options.success) {
				successF = options.success
			}
			if(options.error) {
				errorF = options.error
			}
			if(options.noLoading != undefined || options.noLoading != null) {
				isLoading = !options.noLoading
			}
			if(options.keepLoading != undefined || options.keepLoading != null) {
				isHideLoading = !options.keepLoading
			}
			// ajax 사용시 활성화
			// if (options.async != undefined || options.async != null) {
			// 	async = options.async
			// }
		}
		
		if(isLoading) {
			REQ.loading();
		}

        try {
            return fetch(
				url,
				{
					method: 'POST',
					headers: {
						"Content-type" : "application/json",
						"X-AUTH-RTOKEN" : REQ.getRToken(),
						"X-AUTH-ATOKEN" : REQ.getAToken()
					},
					body: JSON.stringify(params)
				}
			).then((res) => {
				REQ.setAToken(res.headers.get("X-AUTH-ATOKEN"));
				successF(res);

				if(isHideLoading) {
					REQ.loading(false);	
				}
			}).catch((err) =>{
				errorF(err);

				if(isHideLoading) {
					REQ.loading(false);	
				}
			});
			/* 
				$.ajax({
					url: url
					, data: params
					, type: "POST"
					, contentType: "application/json"
					, async: async
					, success: function(res, stat, req) {
						successF(res, stat, req);

						if (isHideLoading) {
							REQ.loading(false);
						}
					}
					, error: function(res) {
						errorF(res);

						if (res.status === 403) {
							alert("세션이 끊겼습니다.");
							location.href = "/";
						}

						if (isHideLoading) {
							REQ.loading(false);
						}
					}
				});
			*/
        } catch(e) {
            console.error(e);
        }
    },
    // 페이지 이동
    // url: 이동할 페이지 url
    // data : 이동할 페이지로 넘길 object (반드시 object 형태로 넘겨줄 것 ex : {"data" : "데이터", "list" : ['1', '2']})
    location : async function(url, data) {
        try {
            // object 형태의 데이터가 있을 시 세션스토리지에 저장.. 가져오는 것은 REQ.getPageData 사용
            if(data !== undefined && data !== null && typeof data === "object") {
                sessionStorage.setItem("pageData", JSON.stringify(data));
            }
			
			// 토큰 인증 없이 해당 view로 이동
			// 만일 url을 추가로 등록하고 싶은 경우 ignoreList에 String 추가 요망
			if(REQ.ignoreList.includes(url)) {
				location.href = url;
			} else {
				// checkLogin을 호출하여 토큰 값이 없거나 만료시 login page로 리턴
				fetch(
					REQ.checkLoginUrl,
					{
						method: 'POST',
						headers: {
							"Content-type" : "application/json",
							"X-AUTH-RTOKEN" : REQ.getRToken(),
							"X-AUTH-ATOKEN" : REQ.getAToken()
						},
						body: JSON.stringify({})
					}
				).then((res) => {
					location.href = "/view" + url;
				}).catch((err) =>{
					if(res.status === 401) {
						sessionStorage.setItem("nextPage", url);
						location.href = loginPage;
					}
				});
				// $.ajax({
	            //     url: "/checkLogin"
	            //     , data: {}
	            //     , type: "POST"
	            //     , async : true
	            //     , beforeSend: REQ.rTokenHeader
				// 	, success : function() {
				// 		location.href = "/view" + url;
				// 	}
				// 	, error : function(res) {
				// 		if(res.status === 401) {
				// 			sessionStorage.setItem("nextPage", url);
				// 			location.href = "/view/login";
				// 		}
				// 	}
	            // });
				
			}
        } catch(e) {
            console.log(e);
        }
    },
	// 이전 페이지에서 보낸 데이터 가져오기
    // 페이지 이동시 데이터를 설정하는 것은 REQ.location을 사용
    getPageData : function() {
		return JSON.parse(sessionStorage.getItem("pageData"));
    },
	// 이전 페이지에서 보낸 데이터 지워주기
	removePageData : function() {
        sessionStorage.removeItem("pageData");
	},
	// 팝업 보여주기
	// 팝업 파일 경로는 맨위에 정의
	// 하위 파일 경로 및 파일명 -> /login/test(login 폴더에 있는 test.html)
	/*
		params {
			popupFile : 팝업 파일명
			jsFile : 해당 팝업에서 실행할 js 명
			closeCallback : 팝업 닫을 때 실행할 함수
			showCallback : 팝업이 보여질 때 실핼할 함수	
		}
	 */
	openPopup: function(popupFile, jsFile, closeCallback, showCallback) {
		var el = document.getElementById("__popup");
		var path = REQ.popupFolder + popupFile + REQ.popupType;
		if (path) {
			var xhttp = new XMLHttpRequest();

			// popup html / jsp가 삽입 성공시 실행할 후처리
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4
					&& this.status == 200) {
					el.innerHTML += this.responseText;
					el.style.display = "block";

					// 팝업에서 실행할 js파일 inject
					if(jsFile) {
						var script = document.createElement("script");
						script.src = REQ.popupJsFolder + jsFile;

						// inject한 스크립트가 로드 성공시 실행
						script.onload = function() {
							if(typeof closeCallback === "function") {
								REQ["_popupCloseCallback"] = closeCallback;
							} else {
								REQ["_popupCloseCallback"] = function() {console.log("popup close callback")}
							}
						};
						el.appendChild(script);
					}
				}
				
			};

			xhttp.open('GET', path + "?" + parseInt(Date.now() / 1000), true);
	        xhttp.overrideMimeType("text/html; charset=UTF-8")
	        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=utf-8');
			xhttp.send();
		}
		
		if(typeof showCallback === "function") {
			showCallback();
		}
		
	},
	// 팝업 닫기
	closePopup: function(data) {
		document.getElementById("__popup").style.display = "none";
		document.getElementById("__popup").innerHTML = "";
		if(typeof REQ["_popupCloseCallback"] === 'function') {
			REQ["_popupCloseCallback"](data);
			REQ["_popupCloseCallback"] = null;
		} else {
			console.log(data);
		}
	},
	// 팝업 닫기 이벤트를 id로 binding
	// 부모 js에서 이를 셋팅해주면 팝업 닫칠 시 callback 설정도 가능
	setClosePopup : function(id, callback) {
		/**
			doc이 그려지고 난 뒤 생성된 element이기에
			docuemnt 전체에 이벤트를 걸어야 함.
		 */
	
		document
		.addEventListener('click', function (e) {
			if(e.target
			&& e.target.id === id 
			&& document.querySelector("#" + id).closest("#__popup")){
				REQ.closePopup();
				callback();
			}
		});
	},
}

// export { CONN }

/*
    test 영역
*/ 

// 동기, 비동기 호출 예시
async function asyncTest() {
    let temp = await REQ.get({
		url :"https://jsonplaceholder.typicode.com/todos/1"
		, params: {}
		, success : function() { console.log("req callback1") }
		, noLoading : true 
		, keepLoading : true 
	});
    console.log(temp);
    let temp2 = await REQ.get({
		url :"https://jsonplaceholder.typicode.com/todos/2"
		, params: temp
		, success : function() { console.log("req callback2") }
		, keepLoading : true 
	});
    console.log(temp2);
    await REQ.get({
		url :"https://jsonplaceholder.typicode.com/todos/3"
		, params: temp2
		, success : function() { console.log("req callback3") }
	});
}

//asyncTest();
