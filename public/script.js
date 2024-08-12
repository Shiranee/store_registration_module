'use strict';

let currentSlide = 0;

const overlay = document.querySelector('.overlay');
const btnCloseModals = document.querySelectorAll('.close-modal');
const btnsOpenModal = [
  document.querySelector('#new-store-btn'),  // Added comma
  document.querySelector('#alter-info-btn'),
  document.querySelector('#alter-adress-btn'),
  document.querySelector('#alter-social-btn'),
  document.querySelector('#alter-staff-btn')
];

const modals = [
  document.querySelector('#modal-1'),  // Added comma
  document.querySelector('#modal-2'),
  document.querySelector('#modal-3'),
  document.querySelector('#modal-4'),
  document.querySelector('#modal-5')
];

function modalAction(button, modal) {
  if (!button || !modal) return;  // Check if button and modal exist

  const openModal = function () {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  };

  const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
  };

  button.addEventListener('click', openModal);

  modal.querySelector('.close-modal').addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

for (let i = 0; i < btnsOpenModal.length; i++) {
  modalAction(btnsOpenModal[i], modals[i]);
}

// Data Table Functionality (No issues spotted)
document.addEventListener('DOMContentLoaded', function () {
  const rowsPerPage = 10;
  const dataTable = document.getElementById('dataTable').querySelector('tbody');
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');
  
  let currentPage = 0;
  let data = [];
  let totalRows = 0;

  async function fetchData() {
    try {
      const response = await fetch('/api/stores');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      data = result;
      totalRows = data.length;
      renderTable();
      updateButtons();
      console.log('Fetched Data:', result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  function renderTable() {
    dataTable.innerHTML = '';
    const start = currentPage * rowsPerPage;
    const end = Math.min(start + rowsPerPage, totalRows);
    
    for (let i = start; i < end; i++) {
      const row = data[i];
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.id}</td>
        <td><input type="checkbox" id="delivery-bool" ${row.status ? 'checked' : ''}/></td>
        <td>${row.cnpj}</td>
        <td>${row.state_inscription}</td>
        <td>${row.name}</td>
        <td>${row.name_company}</td>
        <td><input type="checkbox" id="delivery-bool" ${row.delivery_point ? 'checked' : ''}/></td>
        <td>${row.inaugurated_at}</td>
        <td>${(row.closured_at === null) ? 'Open' : new Date(row.closured_at)}</td>
        <td>${row.updated_at}</td>
      `;
      tr.style.cursor = 'pointer';
      tr.addEventListener('click', () => {
        window.location.href = `/stores/${row.id}`;
      });
      dataTable.appendChild(tr);
    }
  }

  function updateButtons() {
    prevButton.disabled = currentPage === 0;
    nextButton.disabled = currentPage === Math.floor(totalRows / rowsPerPage);
  }

  prevButton.addEventListener('click', function () {
    if (currentPage > 0) {
      currentPage--;
      renderTable();
      updateButtons();
    }
  });

  nextButton.addEventListener('click', function () {
    if (currentPage < Math.floor(totalRows / rowsPerPage)) {
      currentPage++;
      renderTable();
      updateButtons();
    }
  });

  fetchData();
});

// Carousel and Dropdown Functions (No issues spotted)
function showSlide(index) {
  const carousel = document.getElementById('form-carousel');
  const totalSlides = document.querySelectorAll('.carousel-form-item').length;
  if (index >= 0 && index < totalSlides) {
    currentSlide = index;
    carousel.style.transform = `translateX(-${100 * currentSlide}%)`;
  }
}

function moveSlide(direction) {
  const totalSlides = document.querySelectorAll('.carousel-form-item').length;
  currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
  showSlide(currentSlide);
}

function dropdown(refElement) {
  document.getElementById(refElement).classList.toggle("show");
}

function filterFunction(refElement) {
  let input, filter, ul, li, a, i, select, options;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById(refElement);
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}

async function fetchData(apiVar, refElement) {
  try {
    const response = await fetch('/api/stores');
    const result = await response.json();
    
    const dropdownElement = document.getElementById(refElement);
    
    for (let i = 0; i < result.length; i++) {
      let row = result[i];
      const content = document.createElement('a');
      content.href = `#${row[apiVar]}`;
      content.textContent = row[apiVar];
      dropdownElement.appendChild(content);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

fetchData('name', 'store-name');
fetchData('cnpj', 'store-cnpj');
