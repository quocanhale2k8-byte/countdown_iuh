// Lịch thi THPT Quốc Gia & ĐGNL V-ACT (ĐHQG TP.HCM) năm 2027
const EXAMS = {
    thpt: {
        name: 'THPT Quốc Gia 2027',
        subtitle: 'Thời gian thi chính thức: <strong>Ngày 11 và 12/06/2027</strong> (07:30 sáng bắt đầu môn đầu tiên)',
        dateLabel: '11 – 12/06/2027',
        startISO: '2027-06-11T07:30:00+07:00',
        endISO: '2027-06-12T10:15:00+07:00'
    },
    vact1: {
        name: 'ĐGNL V-ACT 2027 — Đợt 1',
        subtitle: 'Kỳ thi Đánh giá năng lực ĐHQG TP.HCM Đợt 1 (Dự kiến): <strong>Ngày 28/03/2027</strong> (08:00 sáng làm bài)',
        dateLabel: '28/03/2027 (Đợt 1)',
        startISO: '2027-03-28T08:00:00+07:00',
        endISO: '2027-03-28T10:30:00+07:00'
    },
    vact2: {
        name: 'ĐGNL V-ACT 2027 — Đợt 2',
        subtitle: 'Kỳ thi Đánh giá năng lực ĐHQG TP.HCM Đợt 2 (Dự kiến): <strong>Ngày 23/05/2027</strong> (08:00 sáng làm bài)',
        dateLabel: '23/05/2027 (Đợt 2)',
        startISO: '2027-05-23T08:00:00+07:00',
        endISO: '2027-05-23T10:30:00+07:00'
    }
};

const START_DATE_KEY = 'roi_iuh_start_date';
let currentTargetKey = 'thpt';

const MOTIVATION_QUOTES = [
    "Mỗi ngày trôi qua là một bước tiến gần hơn tới ngày rời khỏi IUH để đến với chân trời bạn thực sự thuộc về!",
    "Có tới 3 cơ hội lớn: V-ACT Đợt 1 (28/03), V-ACT Đợt 2 (23/05) và THPT QG (11–12/06/2027). Quyết tâm lấy tấm vé rời IUH ngay từ đợt đầu!",
    "Dũng cảm bắt đầu lại chưa bao giờ là muộn. Bạn đã dám đặt mục tiêu rời khỏi IUH, hãy đi tới cùng!",
    "Thà vất vả ôn luyện vài tháng còn hơn tiếc nuối cả thanh xuân ở nơi mình không thuộc về.",
    "Chỉ cần hôm nay cố gắng hơn hôm qua 1%, ngày 12/06/2027 bạn sẽ chính thức tự do!"
];

// DOM Elements - Hero
const heroExamNameEl = document.getElementById('heroExamName');
const heroExamSubEl = document.getElementById('heroExamSub');
const targetDateValueEl = document.getElementById('targetDateValue');
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const totalWeeksEl = document.getElementById('totalWeeks');
const totalHoursEl = document.getElementById('totalHours');

// DOM Elements - V-ACT Cards
const vact1DaysBadge = document.getElementById('vact1DaysBadge');
const v1d = document.getElementById('v1-d');
const v1h = document.getElementById('v1-h');
const v1m = document.getElementById('v1-m');
const v1s = document.getElementById('v1-s');
const v1pct = document.getElementById('v1-pct');
const v1fill = document.getElementById('v1-fill');

const vact2DaysBadge = document.getElementById('vact2DaysBadge');
const v2d = document.getElementById('v2-d');
const v2h = document.getElementById('v2-h');
const v2m = document.getElementById('v2-m');
const v2s = document.getElementById('v2-s');
const v2pct = document.getElementById('v2-pct');
const v2fill = document.getElementById('v2-fill');

// Tiến trình rời khỏi IUH Elements
const startDatePicker = document.getElementById('startDatePicker');
const daysPassedEl = document.getElementById('daysPassed');
const daysRemainingEl = document.getElementById('daysRemaining');
const journeyPercentEl = document.getElementById('journeyPercent');
const journeyFillEl = document.getElementById('journeyFill');
const travelerBubbleEl = document.getElementById('travelerBubble');
const startDateLabelEl = document.getElementById('startDateLabel');
const msDateStart = document.getElementById('msDateStart');
const msDateMid = document.getElementById('msDateMid');

const quoteTextEl = document.getElementById('quoteText');
const nextQuoteBtn = document.getElementById('nextQuoteBtn');

function formatDateVN(dateObj) {
    const d = String(dateObj.getDate()).padStart(2, '0');
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const y = dateObj.getFullYear();
    return `${d}/${m}/${y}`;
}

function getBreakdown(diffMs) {
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diffMs / 1000 / 60) % 60);
    const seconds = Math.floor((diffMs / 1000) % 60);
    return { days, hours, minutes, seconds };
}

function initApp() {
    const savedStart = localStorage.getItem(START_DATE_KEY) || '2026-09-01';
    startDatePicker.value = savedStart;

    startDatePicker.addEventListener('change', () => {
        if (startDatePicker.value) {
            localStorage.setItem(START_DATE_KEY, startDatePicker.value);
            updateAll();
        }
    });

    // Bộ chuyển đổi kỳ thi trên Hero Card
    document.querySelectorAll('.switch-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.switch-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTargetKey = btn.dataset.target;
            const cfg = EXAMS[currentTargetKey];
            heroExamNameEl.textContent = cfg.name;
            heroExamSubEl.innerHTML = cfg.subtitle;
            targetDateValueEl.textContent = cfg.dateLabel;
            updateAll();
        });
    });

    updateAll();
    setInterval(updateAll, 1000);
}

function updateAll() {
    const now = new Date();
    const startStr = localStorage.getItem(START_DATE_KEY) || '2026-09-01';
    const startDate = new Date(startStr + 'T00:00:00+07:00');

    // 1. Cập nhật Hero Countdown theo kỳ thi đang chọn
    const activeExam = EXAMS[currentTargetKey];
    const activeStart = new Date(activeExam.startISO);
    const activeEnd = new Date(activeExam.endISO);
    const diff = activeStart - now;

    if (diff <= 0) {
        if (now <= activeEnd) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            totalWeeksEl.textContent = 'Đang diễn ra!';
            totalHoursEl.textContent = 'Bình tĩnh & Tự tin!';
        } else {
            daysEl.textContent = '🎉';
            hoursEl.textContent = 'HOÀN';
            minutesEl.textContent = 'TẤT';
            secondsEl.textContent = 'RỒI';
            totalWeeksEl.textContent = 'Đã hoàn thành!';
            totalHoursEl.textContent = 'Chúc mừng bạn!';
        }
    } else {
        const { days, hours, minutes, seconds } = getBreakdown(diff);
        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');

        const totalWeeks = (days / 7).toFixed(1);
        const totalHours = Math.floor(diff / (1000 * 60 * 60)).toLocaleString('vi-VN');
        totalWeeksEl.textContent = `${totalWeeks} tuần`;
        totalHoursEl.textContent = `${totalHours} giờ`;
    }

    // 2. Cập nhật 2 thẻ ĐGNL V-ACT Đợt 1 (28/03/2027) & Đợt 2 (23/05/2027)
    updateVactCard(now, startDate, new Date(EXAMS.vact1.startISO), {
        badge: vact1DaysBadge, d: v1d, h: v1h, m: v1m, s: v1s, pct: v1pct, fill: v1fill
    });

    updateVactCard(now, startDate, new Date(EXAMS.vact2.startISO), {
        badge: vact2DaysBadge, d: v2d, h: v2h, m: v2m, s: v2s, pct: v2pct, fill: v2fill
    });

    // 3. Cập nhật Tiến trình rời khỏi IUH (tới mốc THPT QG 11/06/2027 & các trạm V-ACT)
    updateLeaveIUHProgress(now, startDate);

    // 4. Cập nhật từng buổi thi THPT QG ngày 11 & 12/06/2027
    document.querySelectorAll('.schedule-item').forEach(item => {
        const examTime = new Date(item.dataset.examTime);
        const badge = item.querySelector('.sched-countdown');
        const subDiff = examTime - now;

        if (subDiff <= 0) {
            badge.textContent = 'Đã hoàn thành ✓';
        } else {
            const d = Math.floor(subDiff / (1000 * 60 * 60 * 24));
            const h = Math.floor((subDiff / (1000 * 60 * 60)) % 24);
            badge.textContent = `Còn ${d} ngày ${h}h`;
        }
    });
}

function updateVactCard(now, startDate, targetDate, ui) {
    const diff = targetDate - now;
    if (diff <= 0) {
        ui.badge.textContent = 'Đã diễn ra ✓';
        ui.d.textContent = '00';
        ui.h.textContent = '00';
        ui.m.textContent = '00';
        ui.s.textContent = '00';
        ui.pct.textContent = '100%';
        ui.fill.style.width = '100%';
    } else {
        const { days, hours, minutes, seconds } = getBreakdown(diff);
        ui.badge.textContent = `Còn ${days} ngày`;
        ui.d.textContent = String(days).padStart(2, '0');
        ui.h.textContent = String(hours).padStart(2, '0');
        ui.m.textContent = String(minutes).padStart(2, '0');
        ui.s.textContent = String(seconds).padStart(2, '0');

        const total = targetDate - startDate;
        const elapsed = now - startDate;
        const pct = total > 0 ? Math.min(100, Math.max(0, (elapsed / total) * 100)) : 0;
        ui.pct.textContent = `${pct.toFixed(1)}%`;
        ui.fill.style.width = `${pct}%`;
    }
}

function updateLeaveIUHProgress(now, startDate) {
    const thptStart = new Date(EXAMS.thpt.startISO);
    const vact1Start = new Date(EXAMS.vact1.startISO);
    const vact2Start = new Date(EXAMS.vact2.startISO);

    const totalDuration = thptStart - startDate;
    const elapsed = now - startDate;

    let percent = 0;
    if (totalDuration > 0) {
        percent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
    }

    const passedDays = Math.max(0, Math.floor(elapsed / (1000 * 60 * 60 * 24)));
    const remainingDays = Math.max(0, Math.ceil((thptStart - now) / (1000 * 60 * 60 * 24)));

    daysPassedEl.textContent = `${passedDays} ngày`;
    daysRemainingEl.textContent = `${remainingDays} ngày`;
    journeyPercentEl.textContent = `${percent.toFixed(4)}%`;
    journeyFillEl.style.width = `${percent}%`;
    travelerBubbleEl.textContent = `${percent.toFixed(1)}%`;

    const formattedStart = formatDateVN(startDate);
    startDateLabelEl.textContent = formattedStart;
    msDateStart.textContent = formattedStart;

    const midDate = new Date(startDate.getTime() + totalDuration * 0.4);
    msDateMid.textContent = formatDateVN(midDate);

    // Tính vị trí % của V-ACT Đợt 1 & Đợt 2 trên con đường
    const vact1Pct = totalDuration > 0 ? Math.min(96, Math.max(10, ((vact1Start - startDate) / totalDuration) * 100)) : 73;
    const vact2Pct = totalDuration > 0 ? Math.min(98, Math.max(20, ((vact2Start - startDate) / totalDuration) * 100)) : 93;

    const nodeVact1 = document.getElementById('node-vact1');
    const nodeVact2 = document.getElementById('node-vact2');
    if (nodeVact1) nodeVact1.style.left = `${vact1Pct}%`;
    if (nodeVact2) nodeVact2.style.left = `${vact2Pct}%`;

    // Danh sách các trạm mốc theo thứ tự thời gian
    const milestones = [
        { id: 'mid', targetTime: midDate, nodeId: 'node-mid', cardId: 'ms-mid', statusId: 'msStatusMid' },
        { id: 'vact1', targetTime: vact1Start, nodeId: 'node-vact1', cardId: 'ms-vact1', statusId: 'msStatusVact1' },
        { id: 'vact2', targetTime: vact2Start, nodeId: 'node-vact2', cardId: 'ms-vact2', statusId: 'msStatusVact2' },
        { id: 'thpt', targetTime: thptStart, nodeId: 'node-thpt', cardId: 'ms-thpt', statusId: 'msStatusThpt' }
    ];

    let activeFound = false;
    milestones.forEach(m => {
        const nodeEl = document.getElementById(m.nodeId);
        const cardEl = document.getElementById(m.cardId);
        const statusEl = document.getElementById(m.statusId);
        const diffDays = Math.ceil((m.targetTime - now) / (1000 * 60 * 60 * 24));

        if (now >= m.targetTime) {
            nodeEl.classList.add('done');
            cardEl.classList.add('done');
            cardEl.classList.remove('active-target');
            statusEl.textContent = 'Đã vượt qua ✓';
        } else {
            nodeEl.classList.remove('done');
            cardEl.classList.remove('done');

            if (!activeFound) {
                activeFound = true;
                cardEl.classList.add('active-target');
                statusEl.textContent = `🔥 Còn ${diffDays} ngày`;
            } else {
                cardEl.classList.remove('active-target');
                statusEl.textContent = `Còn ${diffDays} ngày`;
            }
        }
    });
}

// Đổi câu nói truyền động lực
let quoteIndex = 0;
nextQuoteBtn.addEventListener('click', () => {
    quoteIndex = (quoteIndex + 1) % MOTIVATION_QUOTES.length;
    quoteTextEl.textContent = MOTIVATION_QUOTES[quoteIndex];
});

// Nút toàn màn hình
document.getElementById('focusModeBtn').addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
    } else {
        document.exitFullscreen().catch(() => {});
    }
});

// Nút hiệu ứng pháo hoa ăn mừng
document.getElementById('celebrateBtn').addEventListener('click', launchConfetti);

function launchConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = Array.from({ length: 100 }, () => ({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 100,
        size: 6 + Math.random() * 7,
        color: ['#0ea5e9', '#10b981', '#f59e0b', '#6366f1', '#ec4899'][Math.floor(Math.random() * 5)],
        vx: -2.5 + Math.random() * 5,
        vy: 3 + Math.random() * 5,
        angle: Math.random() * Math.PI * 2,
        spin: -0.12 + Math.random() * 0.24
    }));

    let frame = 0;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.angle += p.spin;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
        });
        frame++;
        if (frame < 160) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    animate();
}

initApp();
