// --- 🤫 선생님만의 비밀 무기 (몰래 자리 배정) ---
// true로 설정하면 버튼을 눌렀을 때 아래의 'secretSeats' 명단대로 배치됩니다.
// 평소처럼 진짜 랜덤으로 섞고 싶다면 false로 바꿔주시면 됩니다!
const useSecretMode = true; 

// 미리 설정해둘 자리 배치도 (1번 자리부터 차례대로 이름을 적어주세요)
// 특정 자리를 비워두려면 "" (큰따옴표 두 개)로 남겨두시면 됩니다.
const secretSeats = [
    "강백호", "서태웅", "송태섭", "정대만", "채치수", // 1~5번 자리
    "권준호", "이달재", "신현철", "정우성", "이명헌", // 6~10번 자리
    "학생11", "학생12", "학생13", "학생14", "학생15", // 11~15번 자리
    "학생16", "학생17", "학생18", "학생19", "학생20", // 16~20번 자리
    "학생21", "학생22", "학생23", "학생24", "학생25", // 21~25번 자리
    "학생26", "학생27", "학생28", "학생29", "학생30", // 26~30번 자리
    "학생31", "학생32", "학생33", "학생34", "학생35", // 31~35번 자리
    "" // 36번 자리 (짝꿍 배열일 때 보통 남는 빈자리)
];
// ----------------------------------------------


let students = Array.from({ length: 35 }, (_, i) => `학생 ${i + 1}`);
let lockedSeats = {}; 

const layoutSelect = document.getElementById('layoutSelect');
const studentNamesInput = document.getElementById('studentNames');
const seatGrid = document.getElementById('seatGrid');
const shuffleBtn = document.getElementById('shuffleBtn');
const resetBtn = document.getElementById('resetBtn');

studentNamesInput.value = students.join(', ');

function renderSeats() {
    const layout = layoutSelect.value;
    const totalSeats = layout === 'single' ? 35 : 36;
    
    seatGrid.className = layout === 'single' ? 'grid-single' : 'grid-pair';
    seatGrid.innerHTML = '';

    for (let i = 0; i < totalSeats; i++) {
        const seatDiv = document.createElement('div');
        seatDiv.className = 'seat';
        
        const studentName = students[i] || "";
        
        if (!studentName) seatDiv.classList.add('empty');
        if (lockedSeats[i] !== undefined) seatDiv.classList.add('locked');

        const numDiv = document.createElement('div');
        numDiv.className = 'seat-num';
        numDiv.textContent = `${i + 1}번`;

        const nameDiv = document.createElement('div');
        nameDiv.className = 'student-name';
        nameDiv.textContent = studentName || "(빈자리)";

        const lockBtn = document.createElement('button');
        lockBtn.className = 'lock-btn';
        lockBtn.textContent = lockedSeats[i] !== undefined ? '🔒 고정됨' : '🔓 고정';
        
        if (studentName) {
            lockBtn.onclick = () => toggleLock(i, studentName);
        } else {
            lockBtn.style.visibility = 'hidden'; 
        }

        seatDiv.appendChild(numDiv);
        seatDiv.appendChild(nameDiv);
        seatDiv.appendChild(lockBtn);
        seatGrid.appendChild(seatDiv);
    }
}

function toggleLock(index, name) {
    if (lockedSeats[index] !== undefined) {
        delete lockedSeats[index];
    } else {
        lockedSeats[index] = name;
    }
    renderSeats();
}

function shuffle() {
    const layout = layoutSelect.value;
    const totalSeats = layout === 'single' ? 35 : 36;

    let newStudents = new Array(totalSeats).fill("");

    // 🎯 비밀 모드가 켜져 있을 때의 로직
    if (useSecretMode) {
        for (let i = 0; i < totalSeats; i++) {
            newStudents[i] = secretSeats[i] || "";
        }
        
        // 비밀 모드라도, 선생님이 클릭해서 '고정'해둔 자리가 있다면 그 자리는 유지시켜 줍니다.
        for (let i = 0; i < totalSeats; i++) {
            if (lockedSeats[i] !== undefined) {
                newStudents[i] = lockedSeats[i];
            }
        }
        
        students = newStudents;
        renderSeats();
        return; // 여기서 함수를 종료하여 진짜 랜덤 섞기를 건너뜁니다!
    }

    // 🎲 비밀 모드가 꺼져 있을 때의 진짜 랜덤 로직
    const rawText = studentNamesInput.value;
    let inputNames = rawText.split(/[,;\n\s]+/).map(s => s.trim()).filter(s => s.length > 0);
    
    const lockedNames = Object.values(lockedSeats);
    let flexibleNames = inputNames.filter(name => !lockedNames.includes(name));

    for (let i = flexibleNames.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flexibleNames[i], flexibleNames[j]] = [flexibleNames[j], flexibleNames[i]];
    }
    
    for (let i = 0; i < totalSeats; i++) {
        if (lockedSeats[i] !== undefined) {
            if (inputNames.includes(lockedSeats[i])) {
                newStudents[i] = lockedSeats[i];
            } else {
                delete lockedSeats[i]; 
            }
        }
    }

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

shuffleBtn.onclick = shuffle;

resetBtn.onclick = () => {
    lockedSeats = {};
    renderSeats();
};

layoutSelect.onchange = () => {
    const totalSeats = layoutSelect.value === 'single' ? 35 : 36;
    if(students.length < totalSeats) {
        while(students.length < totalSeats) students.push("");
    } else {
        students = students.slice(0, totalSeats);
    }
    renderSeats();
};

renderSeats();
