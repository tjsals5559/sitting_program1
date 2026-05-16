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

    const rawText = studentNamesInput.value;
    let inputNames = rawText.split(/[,;\n\s]+/).map(s => s.trim()).filter(s => s.length > 0);
    
    const lockedNames = Object.values(lockedSeats);
    let flexibleNames = inputNames.filter(name => !lockedNames.includes(name));

    for (let i = flexibleNames.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flexibleNames[i], flexibleNames[j]] = [flexibleNames[j], flexibleNames[i]];
    }

    let newStudents = new Array(totalSeats).fill("");
    
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
