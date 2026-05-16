// 초기 35명 가상 데이터 생성
const defaultStudents = Array.from({length: 35}, (_, i) => `학생 ${i + 1}`);

let currentStudents = [...defaultStudents];
let lockedPositions = {}; // { 의자번호: "학생이름" }

const studentListInput = document.getElementById('student-list');
const layoutTypeSelect = document.getElementById('layout-type');
const btnGenerate = document.getElementById('btn-generate');
const btnResetLock = document.getElementById('btn-reset-lock');
const classroom = document.getElementById('classroom');

studentListInput.value = defaultStudents.join(', ');

// 화면에 책상 그리기 함수
function renderClassroom() {
    const layout = layoutTypeSelect.value;
    classroom.className = `classroom-grid ${layout}`; // 클래스 교체로 디자인 변경
    
    // 선택된 모드에 따른 총 좌석 수 결정
    const totalSeats = layout === 'single-5x7' ? 35 : 36;
    classroom.innerHTML = '';

    for (let index = 0; index < totalSeats; index++) {
        const student = currentStudents[index];
        const desk = document.createElement('div');
        desk.classList.add('desk');
        
        if (!student) {
            desk.classList.add('empty');
        }

        const isLocked = lockedPositions[index] !== undefined;
        if (isLocked) {
            desk.classList.add('locked');
        }

        const deskNum = document.createElement('div');
        deskNum.classList.add('desk-number');
        deskNum.innerText = `${index + 1}번 자리`;

        const nameDiv = document.createElement('div');
        nameDiv.classList.add('student-name');
        nameDiv.innerText = student || '(빈자리)';

        const lockBtn = document.createElement('button');
        lockBtn.classList.add('lock-btn');
        lockBtn.innerText = isLocked ? '🔒 고정됨' : '🔓 고정';
        
        if (student) {
            lockBtn.addEventListener('click', () => toggleLock(index, student));
        } else {
            lockBtn.style.visibility = 'hidden';
        }

        desk.appendChild(deskNum);
        desk.appendChild(nameDiv);
        desk.appendChild(lockBtn);
        classroom.appendChild(desk);
    }
}

function toggleLock(index, studentName) {
    if (lockedPositions[index] !== undefined) {
        delete lockedPositions[index];
    } else {
        lockedPositions[index] = studentName;
    }
    renderClassroom();
}

// 명단 파싱 및 칸 수(35 or 36) 맞춰주기
function parseStudentInput(totalSeats) {
    const rawText = studentListInput.value;
    let list = rawText.split(/[,;\n\s]+/).map(s => s.trim()).filter(s => s.length > 0);
    
    // 총 좌석 수보다 입력된 학생이 적으면 빈자리("")로 채움
    while (list.length < totalSeats) {
        list.push("");
    }
    return list;
}

// 랜덤 배치 및 고정 유지 로직
function generateLayout() {
    const layout = layoutTypeSelect.value;
    const totalSeats = layout === 'single-5x7' ? 35 : 36;
    
    const allInputStudents = parseStudentInput(totalSeats);
    const lockedNames = Object.values(lockedPositions);
    
    // 섞을 학생들 필터링
    let flexibleStudents = allInputStudents.filter(name => !lockedNames.includes(name));

    // Fisher-Yates 셔플
    for (let i = flexibleStudents.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flexibleStudents[i], flexibleStudents[j]] = [flexibleStudents[j], flexibleStudents[i]];
    }

    const nextStudents = new Array(totalSeats).fill("");
    
    // 고정 자리 먼저 배치
    for (let i = 0; i < totalSeats; i++) {
        if (lockedPositions[i] !== undefined) {
            if (allInputStudents.includes(lockedPositions[i])) {
                nextStudents[i] = lockedPositions[i];
            } else {
                delete lockedPositions[i]; // 입력창에 없는 학생이면 고정 해제
            }
        }
    }

    // 남은 자리 배치
    let flexIdx = 0;
    for (let i = 0; i < totalSeats; i++) {
        if (nextStudents[i] === "") {
            nextStudents[i] = flexibleStudents[flexIdx] || "";
            flexIdx++;
        }
    }

    currentStudents = nextStudents;
    renderClassroom();
}

btnResetLock.addEventListener('click', () => {
    lockedPositions = {};
    renderClassroom();
});

// 셀렉트 박스 바꾸면 배열 디자인과 좌석 수가 즉시 리프레시됩니다.
layoutTypeSelect.addEventListener('change', () => {
    const layout = layoutTypeSelect.value;
    const totalSeats = layout === 'single-5x7' ? 35 : 36;
    
    // 바뀐 정원에 맞춰 현재 데이터 크기 조절
    if (currentStudents.length < totalSeats) {
        while(currentStudents.length < totalSeats) currentStudents.push("");
    } else {
        currentStudents = currentStudents.slice(0, totalSeats);
    }
    
    // 범위를 벗어난 고정 데이터 삭제
    Object.keys(lockedPositions).forEach(idx => {
        if (parseInt(idx) >= totalSeats) delete lockedPositions[idx];
    });

    renderClassroom();
});

btnGenerate.addEventListener('click', generateLayout);

// 초기 실행
renderClassroom();
