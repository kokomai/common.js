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
    // 비어있는 값인지 체크
    // 공백, null, undefined, {}, []이 아닐시, true 리턴
    isNotEmpty : function(obj) {
        if(typeof obj === "null" 
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
			document.getElementById("__loading").style.display = "block";
		} else {
			document.getElementById("__loading").style.display = "none";
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
			let check = new Function("return " + e.target.getAttribute("data-Fvalid") + "('" + e.target.value +"')");
			let onInvalid = e.target.getAttribute("data-Finvalid");
			if(!(check()) && e.target.value !== "") {
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
	// input의 자동 formatting 추가
	setFormedInput : function() {
		document.querySelectorAll("input[data-Fform]").forEach((input) => {
			input.removeEventListener("focusout", COMM._formedFunc);	
		});
		
		COMM["_formedFunc"] = (e) => {
			let form = new Function("return " + e.target.getAttribute("data-Fform") + "('" + e.target.value +"')");
			if(e.target.value !== "") {
				e.target.value = form();
			}
		}
		
		document.querySelectorAll("input[data-Fform]").forEach((input) => {
			input.addEventListener("focusout", COMM._formedFunc);
			
//			let position = 0;
//			
//			input.addEventListener("keydown", (e) => {
//				if(e.key === "Backspace" || e.key === "Delete") {
//					position = input.selectionStart;
//				}
//			});
//			
//			input.addEventListener("keyup", (e)=> {
//				let originL = e.target.value.length;
//				let formedL = FORM.toNum(e.target.value).length;
//				let diff = formedL - originL;
//				
//				if((e.key === "Backspace" || e.key === "Delete")) {
//					if(formedL === originL) {
//						// 길이가 같으면 아무것도 안함
//						console.log("same");
////						input.setSelectionRange(position, position);	
//					} else {
//						console.log("diff");
//						// 길이가 다르면 빼줌
//						input.setSelectionRange(position-1, position-1);
//					}
//				}
//			});
		})
	}
}

const FORM = {
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