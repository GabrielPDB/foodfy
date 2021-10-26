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

setPageFocusOnHeader()
getRecipe()
