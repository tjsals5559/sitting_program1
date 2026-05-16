// 초기 기본 35명 데이터
let students = Array.from({ length: 35 }, (_, i) => `학생 ${i + 1}`);
let lockedSeats = {}; // 고정된 자리 저장소 { 자리번호: "학생이름" }

const layoutSelect = document.getElementById('layoutSelect');
const studentNamesInput = document.getElementById('studentNames');
const seatGrid = document.getElementById('seatGrid');
const shuffleBtn = document.getElementById('shuffleBtn');
const resetBtn = document.getElementById('resetBtn');

// 입력창에 기본 명단 세팅
studentNamesInput.value = students.join(', ');

// 화면에 책상 그리기
function renderSeats() {
    const layout = layoutSelect.value;
    const totalSeats = layout === 'single' ? 35 : 36; // 한줄은 35칸, 짝꿍은 36칸
    
    seatGrid.className = layout === 'single' ? 'grid-single' : 'grid-pair';
    seatGrid.innerHTML = '';

    for (let i = 0; i < totalSeats; i++) {
        const seatDiv = document.createElement('div');
        seatDiv.className = 'seat';
        
        const studentName = students[i] || "";
        
        if (!studentName) seatDiv.classList.add('empty');
        if (lockedSeats[i] !== undefined) seatDiv.classList.add('locked');

        // 자리 번호
        const numDiv = document.createElement('div');
        numDiv.className = 'seat-num';
        numDiv.textContent = `${i + 1}번`;

        // 학생 이름
        const nameDiv = document.createElement('div');
        nameDiv.className = 'student-name';
        nameDiv.textContent = studentName || "(빈자리)";

        // 고정 버튼
        const lockBtn = document.createElement('button');
        lockBtn.className = 'lock-btn';
        lockBtn.textContent = lockedSeats[i] !== undefined ? '🔒 고정됨' : '🔓 고정';
        
        if (studentName) {
            lockBtn.onclick = () => toggleLock(i, studentName);
        } else {
            lockBtn.style.visibility = 'hidden'; // 빈자리는 고정 불가
        }

        seatDiv.appendChild(numDiv);
        seatDiv.appendChild(nameDiv);
        seatDiv.appendChild(lockBtn);
        seatGrid.appendChild(seatDiv);
    }
}

// 고정 켜기/끄기
function toggleLock(index, name) {
    if (lockedSeats[index] !== undefined) {
        delete lockedSeats[index];
    } else {
        lockedSeats[index] = name;
    }
    renderSeats();
}

// 자리 섞기 로직
function shuffle() {
    const layout = layoutSelect.value;
    const totalSeats = layout === 'single' ? 35 : 36;

    // 1. 텍스트 박스에서 이름 가져오기
    const rawText = studentNamesInput.value;
    let inputNames = rawText.split(/[,;\n\s]+/).map(s => s.trim()).filter(s => s.length > 0);
    
    // 2. 고정된 학생 제외하고 섞을 명단 만들기
    const lockedNames = Object.values(lockedSeats);
    let flexibleNames = inputNames.filter(name => !lockedNames.includes(name));

    // 3. 남은 아이들 무작위 섞기 (Fisher-Yates)
    for (let i = flexibleNames.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flexibleNames[i], flexibleNames[j]] = [flexibleNames[j], flexibleNames[i]];
    }

    // 4. 새로운 배치표 생성
    let newStudents = new Array(totalSeats).fill("");
    
    // 고정된 자리 먼저 꽂아넣기
    for (let i = 0; i < totalSeats; i++) {
        if (lockedSeats[i] !== undefined) {
            if (inputNames.includes(lockedSeats[i])) {
                newStudents[i] = lockedSeats[i];
            } else {
                delete lockedSeats[i]; // 명단에서 사라진 아이면 고정 해제
            }
        }
    }

    // 빈자리에 섞인 아이들 차례대로 앉히기
    let fIdx = 0;
    for (let i = 0; i < totalSeats; i++) {
        if (!newStudents[i]) {
            newStudents[i] = flexibleNames[fIdx] || "";
            fIdx++;
        }
    }

    students = newStudents;
    renderSeats();
}

// 이벤트 연결
shuffleBtn.onclick = shuffle;

resetBtn.onclick = () => {
    lockedSeats = {};
    renderSeats();
};

layoutSelect.onchange = () => {
    // 배열이 바뀔 때 학생 배열 크기를 조절해줍니다.
    const totalSeats = layoutSelect.value === 'single' ? 35 : 36;
    if(students.length < totalSeats) {
        while(students.length < totalSeats) students.push("");
    } else {
        students = students.slice(0, totalSeats);
    }
    renderSeats();
};

// 첫 화면 그리기
renderSeats();
