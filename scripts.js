function setPageFocusOnHeader() {
  if (document.location.pathname.indexOf('about') != -1) {
    document.querySelectorAll('.link')[0].classList.toggle('active')
  } else if (document.location.pathname.indexOf('revenue') != -1) {
    document.querySelectorAll('.link')[1].classList.toggle('active')
  }
}

function openCloseModal() {
  document.querySelector('.modal-overlay').classList.toggle('active')
}

const Modal = {
  cards: document.querySelectorAll('.cards .card'),
  addEventListenerOnCards: () => {
    for (let card of Modal.cards) {
      card.addEventListener('click', () => {
        document.querySelector('.modal-overlay .modal .card').innerHTML =
          card.innerHTML

        openCloseModal()
      })
    }
  },
  closeModalWhenClickOutsideCard: () => {
    document.addEventListener('click', e => {
      if (e.path[0].className === 'modal') {
        openCloseModal()
      }
    })
  }
}

setPageFocusOnHeader()
Modal.addEventListenerOnCards()
Modal.closeModalWhenClickOutsideCard()
