/**
 * 자주쓰는 공통함수
 * @author : coding-orca
 * All copyright reserved by https://github.com/kokomai
 */
 const COMM = {
    // 개발서버 주소 (default = localhost)
    devUrl : "localhost",
	// 페이지 이동시 계속 로딩 여부
	isKeepLoading : false,
    // 개발서버, 로컬인지 체크
    isDevMode : function() {
        if(window.location.href.indexOf("localhost") === -1
        && window.location.href.indexOf(this.devUrl) === -1) {
            return false;
        } else {
            return true;
        }
    },
    // 공통 로그
    log : function(msg) {
        if(this.isDevMode()) {
            console.log(msg);
        }
    },
    // null, undefined를 공백으로 만들어주기
    null2Void : function(obj) {
        if(typeof obj === "null" || typeof obj === "undefined") {
            return "";
        } else {
            return obj;
        }
    },
    // null, undefined, ""를 0으로 만들어주기
    null2Zero : function(obj) {
        if(typeof obj === "null" || typeof obj === "undefined" || obj === "") {
            return 0;
        } else {
            return obj;
        }
    },
    // 값이 들어있는지 체크
    // 공백, null, undefined, {}, []이 아닐시, true 리턴
    isNotEmpty : function(obj) {
    	if(!obj
		|| typeof obj === "null" 
        || typeof obj === "undefined" 
        || obj === ""
        || (typeof obj === "object" 
            && (JSON.stringify(obj) === "{}" || JSON.stringify(obj) === "[]")
			)
        ) {
            return false;
        } else {
            return true;
        }
    },
	// 비어있는 값인지 체크
	isEmpty : function(obj) {
        if(!obj || obj === undefined || obj === null)  {
            return true;
        }

        if(Array.isArray(obj) && obj.length === 0) {
            return true;
        } else if(typeof obj === 'string' && this.replaceAll(obj, " ", "") === "") {
            return true;
        } else if(typeof obj === 'object' && Object.keys(obj).length === 0) {
            return true;
        }

        return false;
    }, 
    // replaceAll 구현
    // str : 원본 문자열
    // org : 바뀌기 전 문자
    // dest : 바뀐 후의 문자
    replaceAll : function(str, org, dest) {
        return str.split(org).join(dest);
    },
	// 개발자들이 전역으로 사용해야 할 휘발성 커스텀 함수 정의
	custFn : {
		sample: function() {
			console.log("sample 커스텀 함수입니다. 전역으로 사용 가능합니다.");
		}
	},
	// 로딩 
	// 보여주기 : (빈값)/(true)
	// 가려주기 : (false)
	loading : function(isShow) {
		if(isShow === undefined) {
			isShow = true;
		}
		
		if(isShow) {
			// document.getElementById("__loading").style.display = "block";
		} else {
			// document.getElementById("__loading").style.display = "none";
		}
	},
	// page 로딩을 계속 지속
	// 계속 페이지 로딩 : (빈값)/(true)
	// 페이지 로딩 가려주기 : (false) 
	keepLoading : function(isKeep) {
		if(isKeep === undefined || isKeep === true) {
			COMM.isKeepLoading = true;
		} else {
			document.getElementById("__pageLoading").style.display = "none";	
		}
	},
	// 공용 alert를 띄워줌
	/*
		options :{
			msg : 메세지
			title : 타이틀
			callback : 버튼 클릭시 콜백
			btnText : 버튼 텍스트	
		}
	*/
	 
	alert : function(options) {
		let msg = "";
		let title = "안내";
		let callback = function() {};
		let btnText = "확인";
		
		if(typeof options === "object") {
			if(options.msg) {
				msg = options.msg
			}
			if(options.title) {
				title = options.title
			}
			if(options.callback) {
				callback = options.callback
			}
			if(options.btnText) {
				btnText = options.btnText
			}
		}
		
		// 기존 alert / confirm 없애주기
		document.getElementById("__confirm").style.display = "none";
		document.getElementById("__alert").style.display = "none";
		
		document.querySelector("#__alert #__title").textContent = title;
		document.querySelector("#__alert #__msg").textContent = msg;
		document.querySelector("#__alert #__confirmBtn").textContent = btnText;
		
		/**
			vanilla js에서는 계속 addEvent를 할시에 콜백이 계속 추가 되므로
			동일한 버튼을 계속 사용할 시에
			반드시 바인딩 이전에 이전 함수를 지워줘야 함. 
		 */
		
		// confrim 버튼
		let confirmBtn = document.querySelector("#__alert #__confirmBtn");
		// 이전에 바인딩 된 함수 제거
		confirmBtn.removeEventListener("click", COMM._alert_onConfirm);
		
		COMM["_alert_onConfirm"] = function() {
			document.getElementById("__alert").style.display = "none";
			callback();
		}
		
		// 새로운 함수 바인딩
		confirmBtn.addEventListener("click", COMM._alert_onConfirm);
		
		document.getElementById("__alert").style.display = "block";
	},
	// 공용 confirm창을 띄워줌
	/*
		options : {
			msg : 메세지
			title : 타이틀
			onConfirm : 확인 버튼 클릭시 콜백
			onCancel : 취소 버튼 클릭시 콜백
			confirmText : 확인 버튼 텍스트
			cancelText : 취소 버튼 텍스트
		}
	*/
	confirm : function(options) {
		let msg = "";
		let title = "안내";
		let onConfirm = function() {};
		let onCancel = function() {};
		let confirmText = "확인";
		let cancelText = "취소";
		
		if(typeof options === "object") {
			if(options.msg) {
				msg = options.msg
			}
			if(options.title) {
				title = options.title
			}
			if(options.onConfirm) {
				onConfirm = options.onConfirm
			}
			if(options.onCancel) {
				onCancel = options.onCancel
			}
			if(options.confirmText) {
				confirmText = options.confirmText
			}
			if(options.cancelText) {
				cancelText = options.cancelText
			}
		}
		// 기존 alert / confirm 없애주기
		document.getElementById("__confirm").style.display = "none";
		document.getElementById("__alert").style.display = "none";
		
		document.querySelector("#__confirm #__msg").textContent = msg;
		document.querySelector("#__confirm #__title").textContent = title;	
		document.querySelector("#__confirm #__confirmBtn").textContent = confirmText;	
		document.querySelector("#__confirm #__cancelBtn").textContent = cancelText;	
		
		/**
			vanilla js에서는 계속 addEvent를 할시에 콜백이 계속 추가 되므로
			동일한 버튼을 계속 사용할 시에
			반드시 바인딩 이전에 이전 함수를 지워줘야 함. 
		 */
		// confrim 버튼
		let confirmBtn = document.querySelector("#__confirm #__confirmBtn");
		// 이전에 바인딩 된 함수 제거
		confirmBtn.removeEventListener("click", COMM._confirm_onConfirm);
		
		COMM["_confirm_onConfirm"] = function() {
			document.getElementById("__confirm").style.display = "none";
			onConfirm();
		}
		// 새로운 함수 바인딩
		confirmBtn.addEventListener("click", COMM._confirm_onConfirm);
		
		// cancel 버튼
		let cancelBtn = document.querySelector("#__confirm #__cancelBtn");
		// 이전에 바인딩 된 함수 제거
		cancelBtn.removeEventListener("click", COMM._confirm_onCancel);
		
		COMM["_confirm_onCancel"] = function() {
			document.getElementById("__confirm").style.display = "none";
			onCancel();
		}
		
		cancelBtn.addEventListener("click", COMM._confirm_onCancel);
		
		document.getElementById("__confirm").style.display = "block";
	},
	// 한글이 포함되어 있는지 체크
	checkKor : function(str) {
		let check = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
		if(check.test(str)) {
			return true;
		} else {
			return false;
		}
	},
	// 특수문자가 포함되어 있는지 체크
	checkSymbol : function(str) {
		let check = /[`~!@#$%^&*|\\\'\";:\/?,.\-{}()\[\]<>]/gi;
		if(check.test(str)) {
			return true;
		} else {
			return false;
		}
	},
	// 영어가 포함되어 있는지 체크
	checkEng : function(str) {
		let check = /[a-zA-Z]/;
		if(check.test(str)) {
			return true;
		} else {
			return false;
		}
	},
	// 숫자가 포함되어 있는지 체크
	checkNum : function(str) {
		let check = /[0-9]/;
		if(check.test(str)) {
			return true;
		} else {
			return false;
		}
	},
	// 이메일 양식 체크
	isEmail : function(str) {
		let reg_email = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;;
		
		if(COMM.isNotEmpty(str)
		&& reg_email.test(str)) {                            
		     return true;         
		}                            
		else {                       
		     return false;         
		} 
	},
	// 숫자인지 체크
	isNum : function(str) {
		if(isNaN(str) || !COMM.isNotEmpty(str)) {
			return false;
		} else {
			return true;
		}
	},
	// 순 한글인지 체크
	isKor : function(str) {
		if(COMM.isNotEmpty(str)
		&& COMM.checkKor(str) 
		&& !COMM.checkEng(str) 
		&& !COMM.checkSymbol(str)
		&& !COMM.checkNum(str)) {
			return true;
		} else {
			return false;
		}
	},
	// 영어만 있는지 체크
	isEng : function(str) {
		if(COMM.isNotEmpty(str)
		&&COMM.checkEng(str) 
		&& !COMM.checkKor(str) 
		&& !COMM.checkSymbol(str)
		&& !COMM.checkNum(str)) {
			return true;
		} else {
			return false;
		}
	},
	// 영어 + 숫자만 있는지 체크
	isEngNum : function(str) {
		if(COMM.isNotEmpty(str)
		&& (COMM.checkEng(str) || COMM.checkNum(str)) 
		&& !COMM.checkSymbol(str)
		&& !COMM.checkKor(str)) {
			return true;
		} else {
			return false;
		}
	},
	// 주민등록번호 체크
	isRegNum : function(str) {
		let check = /^(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))-[1-8][0-9]{6}$/;
		let check2 = /^(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))[1-8][0-9]{6}$/;
		
		if(COMM.isNotEmpty(str) && (check.test(str) || check2.test(str))) {
			return true;
		} else {
			return false;
		}
	},
	// 핸드폰번호 체크
	isPhoneNum : function(str) {
		let check = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
		
		if(COMM.isNotEmpty(str) && check.test(str)) {
			return true;
		} else {
			return false;
		}
	},
	// 차량번호 체크
	isCarNum : function(str) {
		let check1 = /\d{2}[가-힣ㄱ-ㅎㅏ-ㅣ\x20]\d{4}/g; // 12저1234
		let check2 = /\d{3}[가-힣ㄱ-ㅎㅏ-ㅣ\x20]\d{4}/g; // 123저1234
    	let check3 = /[가-힣ㄱ-ㅎㅏ-ㅣ\x20]{2}\d{2}[가-힣ㄱ-ㅎㅏ-ㅣ\x20]\d{4}/g; // 서울12치1233

		if(COMM.isNotEmpty(str) 
		&& (check1.test(str) || check2.test(str) || check3.test(str))) {
			return true;
		} else {
			return false;
		}
	},
	// input의 validation 기능 추가
	setValidInput : function() {
		document.querySelectorAll("input[data-Fvalid]").forEach((input) => {
			input.removeEventListener("keyup", COMM._validFunc);	
			input.removeEventListener("keydown", COMM._validFunc);	
		});
		
		COMM["_validFunc"] = (e) => {
			let val = e.target.value.replace("'", "").replace("\\", "");
			let check = new Function("return " + e.target.getAttribute("data-Fvalid") + "('" + val +"')");
			let onInvalid = e.target.getAttribute("data-Finvalid");
			if(!(check()) && val !== "") {
				if(onInvalid && onInvalid !== "") {
					new Function("return " + e.target.getAttribute("data-Finvalid") + "()")();
				} else {
					let errorEl = e.target.nextElementSibling;
					
					if(errorEl && errorEl.getAttribute("data-Ferror")) {
						errorEl.style.display = "block"
						errorEl.innerText = errorEl.getAttribute("data-Ferror");		
					}
				}
			} else {
				let errorEl = e.target.nextElementSibling;
					
				if(errorEl && errorEl.getAttribute("data-Ferror")) {
					errorEl.style.display = "none";
				}
			}
		}
		
		document.querySelectorAll("input[data-Fvalid]").forEach((input) => {
			let _errorEl = input.nextElementSibling;
						
			if(_errorEl && _errorEl.getAttribute("data-Ferror")) {
				_errorEl.style.display = "none";
			}
			
			input.addEventListener("keyup", COMM._validFunc);
			input.addEventListener("keydown", COMM._validFunc);
			
		})
	},
	// input의 자동 formatting 추가(focusout 시)
//	setFormedInput : function() {
//		document.querySelectorAll("input[data-Fform]").forEach((input) => {
//			input.removeEventListener("focusout", COMM._formedFunc);	
//		});
//		
//		COMM["_formedFunc"] = (e) => {
//			let val = e.target.value.replace("'", "").replace("\\", "");
//			let form = new Function("return " + e.target.getAttribute("data-Fform") + "('" + val +"')");
//			if(val !== "") {
//				e.target.value = form();
//			}
//		}
//		
//		document.querySelectorAll("input[data-Fform]").forEach((input) => {
//			input.addEventListener("focusout", COMM._formedFunc);
//			
//		})
//	},
	// input의 자동 formatting 추가
	setFormedInput : function() {
		document.querySelectorAll("input[data-Fform]").forEach((input) => {
			input.removeEventListener("input", COMM._formedFunc);	
		});
		
		COMM["_formedFunc"] = (e) => {
			let val = e.target.value.replace("'", "").replace("\\", "");
			let form = new Function("return " + e.target.getAttribute("data-Fform") + "('" + val +"')");
			let position = e.target.selectionStart;
			let length = val.length;
			if(position === length) {
				e.target.value = form();
			} else {
				let formedL = form().length;
				if(length === formedL) {
					e.target.value = form();
					e.target.setSelectionRange(position, position);
				} else {
					let diff = length - formedL;
					e.target.value = form();
					e.target.setSelectionRange(position-diff, position-diff);
				}
			}
		}
		
		document.querySelectorAll("input[data-Fform]").forEach((input) => {
			input.addEventListener("input", COMM._formedFunc);
		})
	},
	// input에서 특정 타입만 입력 가능하게
	setInputType : function() { 
		document.querySelectorAll("input[data-Ftype]").forEach((input) => {
			input.removeEventListener("input", COMM._typeFunc);
		});
		
		document.querySelectorAll("input[data-Ftype]").forEach((input) => {
			input.removeEventListener("keydown", COMM._typeFunc_keydown);
		});
		
		COMM["_typeFunc"] = (e) => {
			let keyData = "";
			
			if(e.data !== null) {
				keyData = e.data.replace("\\", "\\\\").replace("'", "\\'");;
			}
			
			let check = new Function("return " + e.target.getAttribute("data-Ftype") + "('" + keyData +"')");
			if(!check() && keyData !== "") {
				e.target.value = COMM["_typeFunc_beforeValue"];
			}
		}
		
		COMM["_typeFunc_keydown"] = (e) => {
			COMM["_typeFunc_beforeValue"] = e.target.value;
		}
		
		document.querySelectorAll("input[data-Ftype]").forEach((input) => {
			input.addEventListener("input", COMM._typeFunc);
		});
		
		document.querySelectorAll("input[data-Ftype]").forEach((input) => {
			input.addEventListener("keydown", COMM._typeFunc_keydown);
		});
	},
	// 접속한 device가 모바일인지 아닌지 체크
	isMobile : function() {
		// device detection
		if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
		    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
		    return true;
		}

		return false;
	},
	// sessionStoarage에 모바일인지 아닌지 체크하여 넣기
	setIsMobile : function(isMobile) {
		if(isMobile == null || isMobile == undefined) {
			isMobile = COMM.isMobile();
		}
		
		sessionStorage.setItem("isMobile", isMobile);
	},
	// sessionStorage에 있는 모바일 여부 정보를 가져옴
	getIsMobile : function() {
		return JSON.parse(sessionStorage.getItem("isMobile"));
	}
}

const FORM = {
	// 공백제거 함수
	delSpace : function (str) {
		return  str.replace(/ /g, '');
	},
    // 금액에 콤마 추가
    money2Comma : function(num) {
		num = COMM.replaceAll(num.toString(), ",", "");
        return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    // 금액 숫자 + 한글로 변환 (1억, 3천만원)
    money2NumKor : function(num) {
        let inputNumber  = num < 0 ? false : num;
        let unitWords    = ['', '만', '억', '조', '경'];
        let splitUnit    = 10000;
        let splitCount   = unitWords.length;
        let resultArray  = [];
        let resultString = '';

        for (let i = 0; i < splitCount; i++){
            let unitResult = (inputNumber % Math.pow(splitUnit, i + 1)) / Math.pow(splitUnit, i);
            unitResult = Math.floor(unitResult);
            if (unitResult > 0){
                resultArray[i] = unitResult;
            }
        }

        for (let i = 0; i < resultArray.length; i++){
            if(!resultArray[i]) continue;
            resultString = String(resultArray[i]) + unitWords[i] + resultString;
        }

        return resultString;
    },
    // 금액을 순 한글로 변환
    money2Kor : function(num) {
		if(typeof num === 'number') {
			num = num.toString();
		}
		
        let korNum = ["","일","이","삼","사","오","육","칠","팔","구","십"]; 
        let korUnit = ["","십","백","천","","십","백","천","","십","백","천","","십","백","천","","십","백","천"]; 
        let numStr = ""; 
        let tempStr = ""; 
        let result = "";
 
    	if(num) {
			for(let i=0; i<num.length; i++) {                
            tempStr = ""; 
	            numStr = korNum[num.charAt(num.length-(i+1))]; 
	            if(numStr !== "") tempStr += numStr+korUnit[i]; 
	            if(i === 4) tempStr += "만"; 
	            if(i === 8) tempStr += "억"; 
	            if(i === 12) tempStr += "조";
	            if(i === 16) tempStr += "경"; 
	            
	            result = tempStr + result; 
	        }
	    	result = result.replace("경조억만", "경").replace("조억만", "조").replace("억만", "억");	
		}

        return result; 
    },
	// 숫자만 반환
	toNum : function(str) {
		return str.toString().replace(/[^0-9]/g, "");
	},
	// 핸드폰 번호 하이픈
	phoneNum : function(str) {
		let value = FORM.toNum(str);
		
		if(value.length > 9) {
			return value.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,"$1-$2-$3");	
		}  else {
			return value;				
		}
	},
	// 유선 전화번호 하이폰
	telNum : function(str) {
		let value = FORM.toNum(str);
		if(value.length === 9) {
			return value.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
		} else if(value.length === 10) {
			return value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
		} else {
			return value;
		}
	},
	// 계좌번호 하이픈
	accountNum : function(str) {
		str = FORM.toNum(str);
		if (str.length === 11) { //계좌번호가 11자리일 경우
			return str.substring(0,3) + "-" + str.substring(3,5) + "-" + str.substring(5)
		} else if (str.length === 12){
			return str.substring(0,3) + "-" + str.substring(3,5) + "-" + str.substring(5,11) + "-" + str.substring(11)
		}else if(str.length === 13) { //계좌번호가 13자리일 경우
			return str.substring(0,3) + "-" + str.substring(3,5) + "-" + str.substring(5,11) + "-" + str.substring(11)
		} else if (str.length === 14) { //계좌번호가 14자리일 경우
			return str.substring(0,3) + "-" + str.substring(3,5) + "-" + str.substring(5,11) + "-" + str.substring(11)
		} else if (str.length === 16){
			return str.substring(0,3) + "-" + str.substring(3,5) + "-" + str.substring(5,11) + "-" + str.substring(11)
		} else {
			return str;
		}
	},
	// 이메일 마스킹
	emailMask : function(str) {
		if(COMM.isEmail(str)) {
			let strLength = str.split('@')[0].length - 3;
			return str.replace(new RegExp('.(?=.{0,' + strLength + '}@)', 'g'), '*');
		} else {
			return str;
		}
	},
	// 이름 마스킹
	nameMask : function(str) {
		if (str.length > 2) {
		    let originName = str.split('');

		    originName.forEach(function(name, i) {
		      	if (i === 0 || i === originName.length - 1) return;
	      		originName[i] = '*';
			});

			let joinName = originName.join();

			return joinName.replace(/,/g, '');
	  	} else {
	    	let pattern = /.$/; // 정규식
    		return str.replace(pattern, '*');
	  	}
	},
	// 휴대폰 번호 마스킹
	phoneMask : function(str) {
		let originStr = str; 
		let phoneStr; 
		let maskingStr; 
		
		if(!originStr){ 
			return originStr; 
		} 
		
		if (originStr.toString().split('-').length != 3) { 
			// 1) -가 없는 경우 
			phoneStr = originStr.length < 11 
					? originStr.match(/\d{10}/gi) 
					: originStr.match(/\d{11}/gi);
			if(!phoneStr){ 
				return originStr; 
			} 
			
			if(originStr.length < 11) { 
				// 1.1) 0110000000 
				maskingStr = originStr.toString()
							.replace(phoneStr, phoneStr.toString().replace(/(\d{3})(\d{3})(\d{4})/gi,'$1***$3')); 
			} else { 
				// 1.2) 01000000000 
				maskingStr = originStr.toString()
							.replace(phoneStr, phoneStr.toString().replace(/(\d{3})(\d{4})(\d{4})/gi,'$1****$3')); 
			} 
		} else { 
			// 2) -가 있는 경우 
			phoneStr = originStr.match(/\d{2,3}-\d{3,4}-\d{4}/gi); 
			
			if(!phoneStr){ 
				return originStr; 
			}
			 
			if(/-[0-9]{3}-/.test(phoneStr)) { 
				// 2.1) 00-000-0000 
				maskingStr = originStr.toString()
							.replace(phoneStr, phoneStr.toString().replace(/-[0-9]{3}-/g, "-***-")); 
			} else if(/-[0-9]{4}-/.test(phoneStr)) { 
				// 2.2) 00-0000-0000 
				maskingStr = originStr.toString().replace(phoneStr, phoneStr.toString().replace(/-[0-9]{4}-/g, "-****-"));
			} 
		} 
		return maskingStr;
	},
	// 주민등록번호 마스킹
	regNumMask : function(str){ 
		let originStr = str; 
		let rrnStr; 
		let maskingStr; 
		
		if(!originStr) { 
			return originStr; 
		} 
		
		rrnStr = originStr.match(/(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))-[1-4]{1}[0-9]{6}\b/gi);
		
		if(rrnStr){ 
			strLength = rrnStr.toString().split('-').length; 
			maskingStr = originStr.toString().replace(rrnStr,rrnStr.toString().replace(/(-?)([1-4]{1})([0-9]{6})\b/gi,"$1$2******"));
			
		}else { 
			rrnStr = originStr.match(/\d{13}/gi); 
			
			if(rrnStr){ 
				strLength = rrnStr.toString().split('-').length; 
				maskingStr = originStr.toString().replace(rrnStr,rrnStr.toString().replace(/([0-9]{6})$/gi,"******")); 
			} else { 
				return originStr; 
			} 
		} 
		
		return maskingStr; 
	},
}

const DATE = {
	getNowDateUrl : "/common/getNowDate",
	getNowTimeUrl : "/common//getNowTime",
	getNowDateTimeUrl : "/common//getNowDateTime",
    // 현재 서버 날짜 가져오기
    // params : 구분자 ("-", ".")
    getNowServerDate : function(str) {
		let request = new XMLHttpRequest();
		request.open('POST', this.getNowDateUrl, false);  // false : 동기로 동작
		request.send(str);
		
		if (request.status === 200) {
			return request.responseText;
		}
    },
    // 현재 서버 시간 가져오기
    getNowServerTime : function() {
		let request = new XMLHttpRequest();
		request.open('POST', this.getNowTimeUrl, false);  // false : 동기로 동작
		request.send();
		
		if (request.status === 200) {
			return request.responseText;
		}
    },
    // 현재 서버 날짜 및 시간가져오기
    // params : 구분자 ("-", ".")
    getNowServerDateTime : function(str) {
		let request = new XMLHttpRequest();
		request.open('POST', this.getNowDateTimeUrl, false);  // false : 동기로 동작
		request.send(str);
		
		if (request.status === 200) {
			return request.responseText;
		}
    },
    // 현재 날짜 가져오기
    // params : 구분자 ("-", ".")
    getNowDate : function(str) {
        str = COMM.null2Void(str);
        let resultStr = "";
        let now = new Date()
        let year = now.getFullYear().toString();
        let month = (now.getMonth() + 1).toString();
        let date = now.getDate().toString();
        
        if(month.length === 1) {
            month = "0" + month;
        }

        resultStr = year + str + month + str + date;

        return resultStr
    },
    // 현재 시간 가져오기
    getNowTime : function() {
        let resultStr = "";
        let now = new Date()
        let hour = now.getHours().toString();
        let minute = now.getMinutes().toString();

        resultStr = hour + ":" + minute;

        return resultStr
    },
    // 현재 날짜 및 시간가져오기
    // params : 구분자 ("-", ".")
    getNowDateTime : function(str) {
        str = COMM.null2Void(str);
        let resultStr = "";
        let now = new Date()
        let year = now.getFullYear().toString();
        let month = (now.getMonth() + 1).toString();
        let date = now.getDate().toString();

        let hour = now.getHours().toString();
        let minute = now.getMinutes().toString();

        if(month.length === 1) {
            month = "0" + month;
        }

        resultStr = year + str + month + str + date + " " + hour + ":" + minute;

        return resultStr
    },
    // 6자리 생년월일 8자리로 변환 930913 => 19930913
    // params : "930913"
    getLongBirth : function(birth) {
        if(birth.startsWith("0")) {
            // 2000년 이후 출생
            return "20" + birth;
        } else {
            return "19" + birth;
        }
    },
    // 만나이 계산기
    // params : "930913"
    getManAge : function(birth) {
        let age = 0;
        if(birth !== "") {
            let now = new Date();
            let year = now.getFullYear();
            let month = now.getMonth() + 1;
            let date = now.getDate();
            
            let birthYear = "";
            
            if(birth.startsWith("0")) {
                // 2000년 이후 출생
                birthYear = "20" + birth.substring(0,2);
            } else {
                birthYear = "19" + birth.substring(0,2);
            }
            
            birth = new Date(birthYear, birth.substring(2, 4) - 1, birth.substring(4, 6));

            age = year - birthYear;
            let monthDiff = month - birth.getMonth();
            
            if(monthDiff < 0 || (monthDiff === 0 && date < birth.getDate())) {
                // 생일이 안지났으면 나이 줄여주기
                age--;
            }
        }

        return age;
    },
    // 나이 계산기
    // params : "930913"
    getAge : function(birth) {
        let age = 0;
        if(birth !== "") {
            let now = new Date();
            let year = now.getFullYear();
            let month = now.getMonth() + 1;
            let date = now.getDate();
            
            let birthYear = "";
            
            if(birth.startsWith("0")) {
                // 2000년 이후 출생
                birthYear = "20" + birth.substring(0,2);
            } else {
                birthYear = "19" + birth.substring(0,2);
            }
            
            birth = new Date(birthYear, birth.substring(2, 4) - 1, birth.substring(4, 6));

            age = year - birthYear + 1;
        }

        return age;
    },
    // 날짜 차이 구하기
    // start : 시작년월일("19930913")
    // end : 끝년월일("20000913")
    dateDiff : function(start, end) {
        let stDt = new Date(start.substring(0, 4), start.substring(4, 6), start.substring(6, 8));
        let edDt = new Date(end.substring(0, 4), end.substring(4, 6), end.substring(6, 8));
        let msDiff = edDt.getTime() - stDt.getTime();

        return msDiff / (1000*60*60*24);
    },
    // 밀리세컨드 -> 날짜로 변환
    ms2Date : function(ms, str) {
		if(typeof ms === "string") {
			ms = Math.round(ms);	
		}
		
        str = COMM.null2Void(str);
        let resultStr = "";
        let now = new Date(ms)
        let year = now.getFullYear().toString();
        let month = (now.getMonth() + 1).toString();
        let date = now.getDate().toString();
        
        if(month.length === 1) {
            month = "0" + month;
        }

        if(date.length === 1) {
            date = "0" + date;
        }

        resultStr = year + str + month + str + date;

        return resultStr
    }
}

// export { COMM, FORM, DATE }

// test 영역 .. live server 라는 확장 프로그램 필요
let d = new Date().getTime();
console.log(DATE.ms2Date(d));
