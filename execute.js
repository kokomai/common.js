/**
 *  공통으로 실행시켜 주어야 할 함수 모음 (window on load시.. 즉 화면이 그려지고 난 뒤 자동으로 실행.)
 */
// window가 로드 되면 실행시키는 event listener
window.addEventListener("load", function() {
	// keeploading 조건을 biz js에서 설정했을 시, 로딩화면은 hideLoading 때 까지 계속 돌게 설정
	if(!COMM.isKeepLoading) {
		COMM.keepLoading(false);
	}
	// valid 체크 하는 input 셋팅
	COMM.setValidInput(); 
	// 자동으로 form을 지정하는 input 셋팅
	COMM.setFormedInput();
	// 입력값이 지정한 값이 아닐 때 입력이 안되는 input 셋팅
	COMM.setInputType();
});	