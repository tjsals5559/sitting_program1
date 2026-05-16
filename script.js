// 초기 35명 가상 데이터 (선생님이 쉽게 바꾸실 수 있습니다)
const defaultStudents = Array.from({length: 35}, (_, i) => `학생 ${i + 1}`);

// 프로그램 상태 관리 변수
let currentStudents = [...defaultStudents];
let lockedPositions = {}; // { 의자번호: "학생이름" } 형태로 고정 유저 저장

// DOM 요소 가져오기
const studentListInput = document.getElementById('student-list');
const colsCountSelect = document.getElementById('cols-count');
const btnGenerate = document.getElementById('btn-generate');
const btnResetLock = document.getElementById('btn-reset-lock');
const classroom = document.getElementById('classroom');

// 초기 텍스트박스 세팅
studentListInput.value = defaultStudents.join(', ');

// 화면에 책상 그리기 함수
function renderClassroom() {
    const cols = parseInt(colsCountSelect.value);
    classroom.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    classroom.innerHTML = '';

    currentStudents.forEach((student, index) => {
        const desk = document.createElement('div');
        desk.classList.add('desk');
        
        if (!student) {
            desk.classList.add('empty');
        }

        // 고정 여부 체크 상태 반영
        const isLocked = lockedPositions[index] !== undefined;
        if (isLocked) {
            desk.classList.add('locked');
        }

        // 번호 태그
        const deskNum = document.createElement('div');
        deskNum.classList.add('desk-number');
        deskNum.innerText = `${index + 1}번 자리`;

        // 이름 태그
        const nameDiv = document.createElement('div');
        nameDiv.classList.add('student-name');
        nameDiv.innerText = student || '(빈자리)';

        // 고정 버튼
        const lockBtn = document.createElement('button');
        lockBtn.classList.add('lock-btn');
        lockBtn.innerText = isLocked ? '🔒 고정됨' : '🔓 고정';
        
        // 빈자리가 아닐 때만 고정 가능하도록
        if (student) {
            lockBtn.addEventListener('click', () => toggleLock(index, student));
        } else {
            lockBtn.style.visibility = 'hidden';
        }

        desk.appendChild(deskNum);
        desk.appendChild(nameDiv);
        desk.appendChild(lockBtn);
        classroom.appendChild(desk);
    });
}

// 특정 자리 고정 토글 함수
function toggleLock(index, studentName) {
    if (lockedPositions[index] !== undefined) {
        // 이미 고정되어 있다면 해제
        delete lockedPositions[index];
    } else {
        // 고정되어 있지 않다면 현재 학생 이름 저장
        lockedPositions[index] = studentName;
    }
    renderClassroom();
}

// 입력 창으로부터 학생 배열 받아오기
function parseStudentInput() {
    const rawText = studentListInput.value;
    // 쉼표, 줄바꿈, 공백 등으로 분리 후 빈 문자열 제거
    let list = rawText.split(/[,;\n\s]+/).map(s => s.trim()).filter(s => s.length > 0);
    
    // 최대 35명 (혹은 그 이상 유연하게 대처하기 위해 부족하면 빈자리로 채움)
    if (list.length < 35) {
        while (list.length < 35) list.push("");
    }
    return list;
}

// 랜덤 배치 핵심 로직 (자리 고정 기능 포함)
function generateLayout() {
    const allInputStudents = parseStudentInput();
    
    // 1. 고정된 자리에 있는 학생 리스트 확보
    const lockedNames = Object.values(lockedPositions);
    
    // 2. 섞여야 할 (고정되지 않은) 학생들 리스트만 추출
    //    이때 입력창에 여전히 존재하는 학생만 대상으로 함
    let flexibleStudents = allInputStudents.filter(name => !lockedNames.includes(name));

    // 3. 섞여야 할 학생들 리스트 무작위 셔플 (Fisher-Yates Shuffle)
    for (let i = flexibleStudents.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flexibleStudents[i], flexibleStudents[j]] = [flexibleStudents[j], flexibleStudents[i]];
    }

    // 4. 새로운 최종 자리 배열 만들기 (35개 칸 유지)
    const nextStudents = new Array(35).fill("");
    
    // 4-1. 고정된 자리 먼저 채우기
    for (let i = 0; i < 35; i++) {
        if (lockedPositions[i] !== undefined) {
            // 현재 고정된 자리에 있는 학생이 전체 입력창에도 존재하는지 확인 후 배치
            if (allInputStudents.includes(lockedPositions[i])) {
                nextStudents[i] = lockedPositions[i];
            } else {
                // 만약 입력창에서 이름이 지워졌다면 고정 해제
                delete lockedPositions[i];
            }
        }
    }

    // 4-2. 남은 자리에 셔플된 학생들 차례대로 채우기
    let flexIdx = 0;
    for (let i = 0; i < 35; i++) {
        if (nextStudents[i] === "") {
            nextStudents[i] = flexibleStudents[flexIdx] || "";
            flexIdx++;
        }
    }

    currentStudents = nextStudents;
    renderClassroom();
}

// 모든 고정 해제 버튼 이벤트
btnResetLock.addEventListener('click', () => {
    lockedPositions = {};
    renderClassroom();
});

// 가로 줄(열) 정렬 변경 시 실시간 반영
colsCountSelect.addEventListener('change', renderClassroom);

// 배치하기 버튼 이벤트
btnGenerate.addEventListener('click', generateLayout);

// 최초 실행
renderClassroom();
