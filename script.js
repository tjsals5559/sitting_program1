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

// 화면에 책상 그리기 함수 (디자인 복구를 위해 짝꿍 모드 통로 처리 방식 변경)
function renderClassroom() {
    const layout = layoutTypeSelect.value;
    classroom.className = `classroom-grid`; // 클래스는 그냥 grid로 통일

    // JS에서 열 개수를 직접 제어 (원래 디자인 gap 유지)
    const cols = layout === 'pair-6x6' ? 6 : 5;
    classroom.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    
    // 짝꿍 모드일 때, 통로 역할을 할 투명한 '가짜 칸'의 인덱스들
    const pathIndices = cols === 6 ? [2, 4, 8, 10, 14, 16, 20, 22, 26, 28, 32, 34, 38, 40] : [];
    
    classroom.innerHTML = '';
    let studentIdx = 0;

    // 칸을 채웁니다. (짝꿍 모드는 통로 칸을 포함해 조금 더 많이 만듭니다)
    const totalCells = cols === 6 ? 42 : 35; // 6열일 때는 42칸 중 35~36칸만 사용

    for (let index = 0; index < totalCells; index++) {
        const desk = document.createElement('div');
        desk.classList.add('desk');

        // 짝꿍 모드에서 통로 역할을 할 칸 처리
        if (pathIndices.includes(index)) {
            desk.classList.add('fake-path'); // 투명하고 안보이게
            classroom.appendChild(desk);
            continue; // 학생 배치 없이 다음 칸으로
        }

        // 실제 학생 데이터 배치
        const student = currentStudents[studentIdx];
        
        // 데이터가 없거나 다 채웠으면 빈 칸으로
        if (studentIdx >= currentStudents.length || !student) {
            desk.classList.add('empty');
        }

        const isLocked = lockedPositions[studentIdx] !== undefined;
        if (isLocked) {
            desk.classList.add('locked');
        }

        const deskNum = document.createElement('div');
        deskNum.classList.add('desk-number');
        // 통로를 제외한 실제 학생 순서 번호 표시
        deskNum.innerText = `${studentIdx + 1}번 자리`;

        const nameDiv = document.createElement('div');
        nameDiv.classList.add('student-name');
        nameDiv.innerText = student || '(빈자리)';

        const lockBtn = document.createElement('button');
        lockBtn.classList.add('lock-btn');
        lockBtn.innerText = isLocked ? '🔒 고정됨' : '🔓 고정';
        
        if (student) {
            const currentIdx = studentIdx; // 클로저 이슈 방지
            const currentStudent = student;
            lockBtn.addEventListener('click', () => toggleLock(currentIdx, currentStudent));
        } else {
            lockBtn.style.visibility = 'hidden';
        }

        desk.appendChild(deskNum);
        desk.appendChild(nameDiv);
        desk.appendChild(lockBtn);
        classroom.appendChild(desk);
        studentIdx++; // 학생 데이터 인덱스 증가
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

// 명단 파싱 및 칸 수 맞춰주기
function parseStudentInput(totalSeats) {
    const rawText = studentListInput.value;
    let list = rawText.split(/[,;\n\s]+/).map(s => s.trim()).filter(s => s.length > 0);
    
    // 부족하면 빈자리로 채움
    while (list.length < totalSeats) {
        list.push("");
    }
    return list;
}

// 랜덤 배치 및 고정 유지 로직
function generateLayout() {
    const totalSeats = 36; // 어떤 모드든 데이터는 36칸으로 관리 (최대값)
    
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
    renderClassroom();
});

btnGenerate.addEventListener('click', generateLayout);

// 초기 실행
renderClassroom();
