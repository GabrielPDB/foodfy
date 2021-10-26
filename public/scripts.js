function setPageFocusOnHeader() {
  if (document.location.pathname.indexOf('about') != -1) {
    document.querySelectorAll('.link')[0].classList.toggle('active')
  } else if (document.location.pathname.indexOf('revenue') != -1) {
    document.querySelectorAll('.link')[1].classList.toggle('active')
  }
}

function getRecipe() {
  const cards = document.querySelectorAll('.card')

  cards.forEach((card, index) => {
    card.addEventListener('click', () => {
      window.location.href = `/recipes/${index}`
    })
  })
}

function showHideContentOfRecipe(info) {
  const content = document.querySelector(`.${info} .content`)
  const button = document.querySelector(`.${info} button`)

  content.classList.toggle('hide')
  if (button.innerHTML == 'Mostrar') {
    button.innerHTML = 'Esconder'
  } else if (button.innerHTML == 'Esconder') {
    button.innerHTML = 'Mostrar'
  }
}

setPageFocusOnHeader()
getRecipe()
