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
  let totalRows = 0;

  // Sample data generation for demonstration
  const data = [];
  for (let i = 1; i <= 100; i++) {
      data.push({
          id: i,
          status: `<input type="checkbox">`,
          cnpj: `CNPJ ${i}`,
          stateInscription: `State Inscription ${i}`,
          name: `Name ${i}`,
          socialName: `Social Name ${i}`,
          deliveryPoint: `Delivery Point ${i}`,
          inauguratedAt: `Inaugurated At ${i}`,
          closuredAt: `Closured At ${i}`,
          lastUpdate: `Last Update ${i}`
      });
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
              <td>${row.status}</td>
              <td>${row.cnpj}</td>
              <td>${row.stateInscription}</td>
              <td>${row.name}</td>
              <td>${row.socialName}</td>
              <td>${row.deliveryPoint}</td>
              <td>${row.inauguratedAt}</td>
              <td>${row.closuredAt}</td>
              <td>${row.lastUpdate}</td>
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

  totalRows = data.length;
  renderTable();
  updateButtons();
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