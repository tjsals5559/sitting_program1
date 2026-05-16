:root {
    --primary-color: #ffb7c5; /* 벚꽃 핑크 */
    --secondary-color: #a2d2ff; /* 파스텔 블루 */
    --accent-color: #fcf6bd; /* 파스텔 옐로우 */
    --text-color: #555;
    --bg-color: #f9f7f7;
}

* { box-sizing: border-box; font-family: 'Nanum Gothic', sans-serif; }

body {
    background-color: var(--bg-color);
    color: var(--text-color);
    margin: 0;
    padding: 20px;
    display: flex;
    justify-content: center;
}

.container {
    width: 100%;
    max-width: 900px;
    background: white;
    padding: 30px;
    border-radius: 30px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
}

header { text-align: center; margin-bottom: 20px; }

h1 { 
    font-family: 'Nanum Pen Script', cursive; 
    font-size: 3rem; 
    color: var(--primary-color);
    margin: 0;
}

.controls {
    background: #fff9f9;
    padding: 20px;
    border-radius: 20px;
    border: 2px dashed var(--primary-color);
    margin-bottom: 30px;
}

textarea {
    width: 100%;
    height: 60px;
    border-radius: 10px;
    border: 1px solid #ddd;
    padding: 10px;
    margin-top: 5px;
    resize: none;
}

.setting-group {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 15px;
    flex-wrap: wrap;
    gap: 10px;
}

.buttons { display: flex; gap: 10px; }

button {
    padding: 10px 20px;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    font-weight: bold;
    transition: 0.3s;
}

.btn-primary { background: var(--primary-color); color: white; }
.btn-primary:hover { background: #ff9eaa; transform: translateY(-2px); }

.btn-secondary { background: #eee; color: #777; }

.classroom {
    position: relative;
    padding: 40px 20px;
    background: #fdfdfd;
    border-radius: 20px;
}

.teacher-desk {
    width: 150px;
    height: 40px;
    background: var(--secondary-color);
    margin: 0 auto 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
}

/* 배열 관련 핵심 CSS */
#seatGrid {
    display: grid;
    gap: 15px;
    justify-content: center;
}

.grid-single { grid-template-columns: repeat(5, 1fr); }

/* 짝꿍 버전 디자인: 2개씩 묶임 */
.grid-pair { 
    grid-template-columns: repeat(6, 1fr); 
}
.grid-pair .seat:nth-child(2n) { margin-right: 20px; }
.grid-pair .seat:nth-child(2n+2) { margin-right: 0; }
.grid-pair .seat:nth-child(6n) { margin-right: 0; }

.seat {
    aspect-ratio: 1/1;
    background: var(--accent-color);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    transition: 0.3s;
    border: 2px solid transparent;
}

.seat.locked {
    background: #d1ffd1;
    border-color: #88d488;
}

.student-name { font-size: 0.9rem; font-weight: bold; }

.lock-icon {
    position: absolute;
    top: 5px;
    right: 5px;
    cursor: pointer;
    font-size: 0.8rem;
    opacity: 0.5;
}

.seat.locked .lock-icon { opacity: 1; color: #2ecc71; }

footer { text-align: center; margin-top: 20px; font-size: 0.8rem; color: #999; }
