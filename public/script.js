// 'use strict';

let currentSlide = 0;

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const btnsOpenModal = document.querySelectorAll('#new-store-btn');
const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  // console.log(e.key);

  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

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
      console.log('Fetched Data:', result); // Log the fetched data
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

  fetchData(); // Fetch the data when the page loads
});



function showSlide(index) {
  const carousel = document.getElementById('carousel');
  const totalSlides = document.querySelectorAll('.carousel-item').length;
  if (index >= 0 && index < totalSlides) {
    currentSlide = index;
    carousel.style.transform = `translateX(-${100 * currentSlide}%)`;
  }
}

function moveSlide(direction) {
  const totalSlides = document.querySelectorAll('.carousel-item').length;
  currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
  showSlide(currentSlide);
}


function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown");
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