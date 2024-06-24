// DOM 요소 가져오기
const calendarDays = document.getElementById('calendar-days');
const dayRecordModal = document.getElementById('day-record-modal');
const recordTextarea = document.getElementById('record-textarea');
const monthYearText = document.getElementById('month-year');
const saveBtn = document.getElementById('save-btn');
const closeBtn = document.getElementById('close-btn');
const deleteBtn = document.getElementById('delete-btn');
const prevMonthBtn = document.getElementById('prev-month-btn');
const nextMonthBtn = document.getElementById('next-month-btn');
const dayLabels = document.getElementById('day-labels');
const imageUpload = document.getElementById('imageUpload');
const uploadedImage = document.getElementById('uploadedImage');

// 현재 날짜 설정
let currentDate = new Date();
let selectedDay = null;
let imageUrl = '';

// 초기 달력 생성
generateCalendar(currentDate.getFullYear(), currentDate.getMonth());

// 달력 생성 함수
function generateCalendar(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  calendarDays.innerHTML = '';
  dayLabels.innerHTML = ''; // 요일 레이블 초기화

  // 요일 레이블 추가
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  for (let i = 0; i < 7; i++) {
    const dayLabel = document.createElement('div');
    dayLabel.classList.add('day-label', 'text-center', 'p-2', 'border', 'border-gray-200');
    dayLabel.textContent = daysOfWeek[i];
    dayLabels.appendChild(dayLabel);
  }

  // 이전 달의 빈 공간 추가
  for (let i = 0; i < firstDayOfMonth; i++) {
    const day = document.createElement('div');
    day.classList.add('text-center', 'p-2', 'border', 'border-gray-200');
    calendarDays.appendChild(day);
  }

  // 달력 날짜 생성
  for (let i = 1; i <= daysInMonth; i++) {
    const day = document.createElement('div');
    day.classList.add('text-center', 'p-2', 'border', 'border-gray-200', 'cursor-pointer', 'relative');
    day.textContent = i;

    // 날짜 클릭 시 이벤트
    day.addEventListener('click', () => openDayRecordModal(i, year, month));

    const key = `${year}-${month + 1}-${i}`;
    const record = localStorage.getItem(key);

    if (record) {
      day.classList.add('bg-blue-200'); // 저장된 날짜는 하늘색 배경 추가
    } else {
      day.classList.add('bg-white-200'); // 저장된 날짜가 없는 경우 회색 배경 추가
    }

    calendarDays.appendChild(day);
  }

  monthYearText.innerText = `${year}년 ${month + 1}월`;
}
// 날짜 클릭 시 모달 열기
function openDayRecordModal(day, year, month) {
  selectedDay = day;
  const key = `${year}-${month + 1}-${day}`;
  const storedData = localStorage.getItem(key);
  if (storedData) {
    const { text, imageUrl: storedImageUrl } = JSON.parse(storedData);
    recordTextarea.value = text;
    imageUrl = storedImageUrl || '';
    if (imageUrl) {
      uploadedImage.src = imageUrl;
      uploadedImage.classList.remove('hidden');
    } else {
      uploadedImage.classList.add('hidden');
    }
  } else {
    recordTextarea.value = '';
    uploadedImage.classList.add('hidden');
  }

  dayRecordModal.classList.remove('hidden'); // 모달 보이기
}

// 이미지 업로드 시 미리보기
imageUpload.addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      uploadedImage.src = e.target.result;
      uploadedImage.classList.remove('hidden');
      imageUrl = e.target.result;
    }
    reader.readAsDataURL(file);
  }
});

// 기록 저장
function saveRecord() {
  if (selectedDay !== null) {
    const key = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${selectedDay}`;
    const record = recordTextarea.value.trim();
    localStorage.setItem(key, JSON.stringify({ text: record, imageUrl }));
    updateCalendarAndCloseModal();
  }
}

// 달력 업데이트 및 모달 닫기 함수
function updateCalendarAndCloseModal() {
  closeDayRecordModal();
  generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
}

// 모달 닫기 함수
function closeDayRecordModal() {
  dayRecordModal.classList.add('hidden'); // 모달 숨기기
  recordTextarea.value = ''; // 텍스트 입력창 초기화
  imageUrl = ''; // 이미지 URL 초기화
  uploadedImage.classList.add('hidden'); // 이미지 숨기기
  selectedDay = null; // 선택된 날짜 초기화
}

// 내용과 표시를 지우는 함수
function clearRecordAndUnmarkDay() {
  if (selectedDay !== null) {
    const key = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${selectedDay}`;
    localStorage.removeItem(key);
    updateCalendarAndCloseModal();
  }
}

// 이전 달 버튼 클릭 시
prevMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
});

// 다음 달 버튼 클릭 시
nextMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
});

// 저장 버튼 클릭 시
saveBtn.addEventListener('click', saveRecord);

// 닫기 버튼 클릭 시
closeBtn.addEventListener('click', closeDayRecordModal);

// 삭제 버튼 클릭 시
deleteBtn.addEventListener('click', clearRecordAndUnmarkDay);
