/**
 * example.js
 */

/* 
	keepLoading 함수를 맨 위에 선언시, COMM.keeploading(false)호출 전까지 계속 페이지 로딩 진행합니다
	필요 없을시 주석처리 해주시면 window load시 자동으로 페이지 로딩을 가려줍니다.
	주의 : pageLoading과 일반 loading은 다릅니다. 
	pageLoading은 페이지가 이동될 떄에만 실행되며 loading은 ajax 호출시 실행됩니다.
*/
//COMM.keepLoading();

/*
	이전 페이지에서 넘겨줄 object를 가져옵니다.
*/
//const pageData = REQ.getPageData();

/*
	일반 jquery 작성과 동일합니다.
	하지만 document가 준비 되기 전 특별히 실행해야할 사항들이 공통적으로 존재한다면
	execute.js에서 실행하거나 binding 해주세요.
*/
// https://jeonghwan-kim.github.io/dev/2020/06/08/html5-form-validation.html
// -> html form 커스터마이징
$(document).ready(function(){
	/* 
		아래와 같이 보기 편하게 하기 위해 함수 선언부와 
		data binding 영역을 나누는 것을 권장합니다.
	*/
	/*
		※ 공통함수로는 COMM, FORM, DATE, REQ, MOB이 존재합니다.
		
		COMM : COMM의 경우 기본적으로 사용할 수 있는 alert confirm 창 호출
		, null 체크, 숫자체크 등의 함수가 들어있습니다. 
		
		FORM : 텍스트의 형식을 변환해주는 함수가 들어있습니다. 금액 -> 한글 
		금액 -> 숫자 + 한글 등의 함수가 들어있습니다.
		
		DATE : 날짜와 관련된 함수가 들어있습니다. 현재 날짜, 시간 등을 반환하거나
		날짜 포맷을 변경해주는 함수들이 들어있습니다.
		
		REQ : ajax요청, 토큰값 설정, 팝업, 페이지 이동과 관련된 함수들이 들어있습니다.
		
		MOB : native쪽 함수를 호출하는 함수가 들어있습니다. 
		
		※ 공통 로그 COMM.log();
		로그의 경우 COMM.log를 사용하시면 
		개발서버, 로컬서버에서만 해당 로그를 보여줍니다.
		
		※ 이 서버가 개발서버인가 로컬인가? 아님 운영인가?
		COMM.isDevMode를 통해 사용 가능합니다
		다만 개발서버의 경우 common.js 최상단에 선언된
		devUrl를 변경해주셔야 합니다.
	*/
	/*
		함수 선언부 
	*/
    function submit() {
		let obj = {};
		obj["test"] = $("#test").val();
		/*
			REQ.post 혹은 get을 통해 post, get을 호출합니다.
			자세한 설명은 request.js의 주석을 참고해주세요.
		*/
		REQ.post({
			url: "https://httpbin.org/post"
			, params : JSON.stringify(obj)
			, success : function(res, stat, req) {
				/*
					res -> response
					stat -> status
					req -> request
				*/
				$("#submitResult").text(res.data); 
			}, error : function(res) { 
				console.log(res);
			}
		});
	}
	
	/*
		event binding 
	*/
	// ajax 호출
	$("#submitBtn").on("click", function() {
		submit();
	});
	
	// 동기화된 ajax 호출
	/**
		★아래 function 옆에 asnyc 반드시 확인!★
		또한 동기식으로 돌리고 싶은 요청 앞에 await을 작성!
	 */
	$("#syncSubmitBtn").on("click", async function() {
		console.log("첫번째 호출");
		await REQ.post({
			url: "https://httpbin.org/post"
			, params : {test : "test"}
			, success : function(res, stat, req) {
				/*
					res -> response
					stat -> status
					req -> request
				*/
				console.log("첫번째 완료"); 
			}, error : function(res) { 
				console.log(res);
			}
		});
		
		console.log("두번째 호출");
		REQ.post({
			url: "https://httpbin.org/post"
			, params : {test : "test"}
			, success : function(res, stat, req) {
				/*
					res -> response
					stat -> status
					req -> request
				*/
				
				console.log("두번째 완료");
			}, error : function(res) { 
				console.log(res);
			}
		});
	});
	// 비동기식 ajax 호출
	$("#asyncSubmitBtn").on("click", async function() {
		console.log("첫번째 호출");
		REQ.post({
			url: "https://httpbin.org/post"
			, params : {test : "test"}
			, success : function(res, stat, req) {
				/*
					res -> response
					stat -> status
					req -> request
				*/
				console.log("첫번째 완료"); 
			}, error : function(res) { 
				console.log(res);
			}
		});
		
		console.log("두번째 호출");
		REQ.post({
			url: "https://httpbin.org/post"
			, params : {test : "test"}
			, success : function(res, stat, req) {
				/*
					res -> response
					stat -> status
					req -> request
				*/
				
				console.log("두번째 완료"); 
			}, error : function(res) { 
				console.log(res);
			}
		});
	});
	
	// 페이지 이동
	$("#locationBtn").on("click", function() {
		/*
			page이동은 아래와 같이 REQ.location 함수를 사용하여 이용해주세요
			두 번째 인자로 object(반드시 object로)형식을 넣게 되면
			다음 페이지에서 REQ.getPageData()를 통해 가져올 수 있습니다.
		*/
		REQ.location("/view/login/access", {"test" : "test"});
	});
	
	// 팝업 관련
	$("#showPopup").on("click", function() {
		/*
			/static/popup내에 있는 div로 구성된 html을 popup형식으로 보여줍니다.
			단 해당 html은 <html><head><body>등의 기초적인 tag가 빠진
			해당 팝업의 div의 방식으로 들어가 있어야 합니다. 예시는 test_popup을 참고하십시오
			사용법은 request.js 내에 openPopup의 주석을 참고해주세요.
		*/
		REQ.openPopup('/test_popup');
		
		/*
			위 팝업 html 내에 있는 특정 버튼을 닫기 버튼으로 사용하게끔 설정해주는 함수입니다.
			두번째 인자로 함수를 넣으시면 닫기버튼 클릭 이후 해당 함수를 실행해 줍니다.
			혹시 팝업 내에서 다른 버튼을 추가적으로 binding 하고 싶으실 경우
			일반적인 jquery 이벤트 바인딩방식을 그대로 사용하셔도 됩니다.
		*/
		REQ.setClosePopup("firstCloseBtn", function() {});
	});
	
	// alert 관련
	$("#showAlert").on("click", function() {
		/*
			alert를 호출하는 함수입니다. 
			아래의 key 값을 value와 함께 object 형식으로 전달하면 커스터마이징이 가능합니다.
			msg : 메세지
			title : 타이틀
			callback : 버튼 클릭시 콜백
			btnText : 버튼 텍스트	
		*/
		COMM.alert({
			msg: $("#alerText").val()
			, callback: function() {
				alert("확인 누름");
			}
		});
	});
	
	// confirm 관련
	$("#showConfirm").on("click", function() {
		/*
			confirm을 호출하는 함수입니다. 
			아래의 key 값을 value와 함께 object 형식으로 전달하면 커스터마이징이 가능합니다.
			msg : 메세지
			title : 타이틀
			onConfirm : 확인 버튼 클릭시 콜백
			onCancel : 취소 버튼 클릭시 콜백
			confirmText : 확인 버튼 텍스트
			cancelText : 취소 버튼 텍스트	
		*/
		COMM.confirm({
			msg: $("#confirmText").val()
			, onConfirm: function() {
				alert("확인 누름");
			}
			, onCancel: function() {
				alert("취소 누름");
			}
		});
	});
	
	// 각종 텍스트 테스트
	$(".testBtn").on("click", function() {
		let func = new Function("return " + $(this).attr("data-func") + "('" + $(this).siblings(".inp").val() +"')");
		$(this).siblings(".result").text((func()));
	});
	
	// 날짜 차이 구하기
	$("#getDateDiff").on("click", function() {
		$(this).siblings(".result").text(DATE.dateDiff($(this).siblings(".inp1").val(), $(this).siblings(".inp2").val())+"일");
	});
});
