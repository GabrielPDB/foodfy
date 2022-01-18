function setPageFocusOnHeader() {
  if (document.location.pathname.includes('admin')) {
    if (document.location.pathname.indexOf('recipes') != -1) {
      document.querySelectorAll('.link')[0].classList.toggle('active')
    } else if (document.location.pathname.indexOf('chefs') != -1) {
      document.querySelectorAll('.link')[1].classList.toggle('active')
    } else if (document.location.pathname.indexOf('users') != -1) {
      document.querySelectorAll('.link')[2].classList.toggle('active')
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
  const cards = document.querySelectorAll('section.recipes.site .card')

  cards.forEach(card => {
    const cardId = card.getAttribute('id')
    card.addEventListener('click', () => {
      window.location.href = `/recipes/${cardId}`
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

function hideSearchForm() {
  if (
    document.location.pathname.includes('about') ||
    (document.location.pathname.includes('chefs') &&
      !document.location.pathname.includes('admin'))
  ) {
    document.querySelector('form.search').classList.add('hide')
  }
}

setPageFocusOnHeader()
hideSearchForm()
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

function confirmDelete(event) {
  const formDelete = document.querySelector(
    `#${event.target.getAttribute('form')}`
  )
  formDelete.addEventListener('submit', event => {
    const confirmation = confirm('Tem certeza de que deseja deletar?')
    if (!confirmation) {
      event.preventDefault()
    }
  })
}

function confirmLogout(event) {
  const confirmation = confirm('Tem certeza de que deseja sair?')
  if (!confirmation) {
    event.preventDefault()
  }
}

const ImagesUpload = {
  input: '',
  preview: document.querySelector('.images-preview'),
  /* uploadLimit: 5, */
  files: [],
  handleFileInput(event) {
    const { files: fileList } = event.target
    ImagesUpload.input = event.target

    if (ImagesUpload.hasLimit(event, 5)) return

    Array.from(fileList).forEach(file => {
      ImagesUpload.files.push(file)

      const reader = new FileReader()

      reader.readAsDataURL(file)

      reader.onload = () => {
        const image = new Image()

        image.src = String(reader.result)

        const div = ImagesUpload.getContainer(image)

        ImagesUpload.preview.appendChild(div)
      }
    })
    ImagesUpload.input.files = ImagesUpload.getAllFiles()
  },
  handleChefFileInput(event) {
    const { files: fileList } = event.target
    ImagesUpload.input = event.target

    if (ImagesUpload.hasLimit(event, 1)) return

    Array.from(fileList).forEach(file => {
      ImagesUpload.files.push(file)

      const reader = new FileReader()

      reader.readAsDataURL(file)

      reader.onload = () => {
        const image = new Image()

        image.src = String(reader.result)

        const div = ImagesUpload.getContainer(image)

        ImagesUpload.preview.appendChild(div)
        ImagesUpload.preview.style.position = 'absolute'
      }
    })

    ImagesUpload.input.files = ImagesUpload.getAllFiles()
  },
  hasLimit(event, limit) {
    const { input, preview } = ImagesUpload
    const { files: fileList } = input

    if (fileList.length > limit) {
      alert(`Limite de imagens: ${limit}`)
      event.preventDefault()
      return true
    }

    const photosDiv = []
    preview.childNodes.forEach(item => {
      if (item.classList && item.classList.value == 'photo') {
        photosDiv.push(item)
      }
    })

    const totalPhotos = fileList.length + photosDiv.length

    if (totalPhotos > limit) {
      alert(`Você atingiu o limite máximo de fotos`)
      event.preventDefault()
      return true
    }

    return false
  },
  getAllFiles() {
    const dataTransfer =
      new ClipboardEvent('').clipboardData || new DataTransfer()

    ImagesUpload.files.forEach(file => dataTransfer.items.add(file))

    return dataTransfer.files
  },
  getContainer(image) {
    const div = document.createElement('div')
    div.classList.add('photo')

    div.onclick = ImagesUpload.removePhoto

    div.appendChild(image)

    div.appendChild(ImagesUpload.getRemoveButton())

    return div
  },
  removePhoto(event) {
    const photoDiv = event.target.parentNode
    const photosArray = Array.from(ImagesUpload.files)
    const index = photosArray.indexOf(photoDiv)

    ImagesUpload.files.splice(index, 1)
    ImagesUpload.input.files = ImagesUpload.getAllFiles()

    photoDiv.remove()
  },
  getRemoveButton() {
    const button = document.createElement('i')
    button.classList.add('material-icons')
    button.innerHTML = 'close'
    return button
  },
  removeOldPhoto(event) {
    const photoDiv = event.target.parentNode
    if (photoDiv.id) {
      const removedFiles = document.querySelector('input[name="removed_files"]')
      if (removedFiles) {
        removedFiles.value += `${photoDiv.id},` // 1,2,3,4,5,...
      }
    }

    photoDiv.remove()
  }
}

const ImageGallery = {
  highlight: document.querySelector('.gallery .gallery-highlight > img'),
  previews: document.querySelectorAll('.gallery .gallery-preview img'),
  setImage(event) {
    const { target } = event

    ImageGallery.setActivePreview(target)

    ImageGallery.highlight.src = target.src
  },
  setActivePreview(target) {
    ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
    target.classList.add('active')
  }
}
