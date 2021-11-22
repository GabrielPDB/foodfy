function setPageFocusOnHeader() {
  if (document.location.pathname.includes('admin')) {
    if (document.location.pathname.indexOf('recipes') != -1) {
      document.querySelectorAll('.link')[0].classList.toggle('active')
      console.log('passou aqui')
    } else if (document.location.pathname.indexOf('chefs') != -1) {
      document.querySelectorAll('.link')[1].classList.toggle('active')
    }
  } else {
    if (document.location.pathname.indexOf('about') != -1) {
      document.querySelectorAll('.link')[0].classList.toggle('active')
    } else if (document.location.pathname.indexOf('recipes') != -1) {
      document.querySelectorAll('.link')[1].classList.toggle('active')
    } else if (document.location.pathname.indexOf('chefs') != -1) {
      document.querySelectorAll('.link')[2].classList.toggle('active')
    }
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

function addIngredient() {
  const ingredients = document.querySelector('.ingredients')
  const inputIngredients = document.querySelectorAll('.ingredients input')

  const newInput = inputIngredients[inputIngredients.length - 1].cloneNode(true)

  if (newInput.value == '') {
    return false
  } else {
    newInput.value = ''
  }

  ingredients.appendChild(newInput)
}

function addPreparation() {
  const preparation = document.querySelector('.preparation')
  const inputPreparations = document.querySelectorAll('.preparation input')

  const newInput =
    inputPreparations[inputPreparations.length - 1].cloneNode(true)

  if (newInput.value == '') {
    return false
  } else {
    newInput.value = ''
  }

  preparation.appendChild(newInput)
}

function confirmDelete() {
  const formDelete = document.querySelector('#deleteRecipeForm')
  formDelete.addEventListener('submit', event => {
    const confirmation = confirm(
      'Tem certeza de que deseja deletar essa receita?'
    )
    if (!confirmation) {
      event.preventDefault()
    }
  })
}
