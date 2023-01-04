/**
 * Initializes the javascript for the form-address module
 * @param {Object} el - The DOM Node containing the data-module="form-address" attribute.
 */
import select from 'select-dom'
import { addClass, removeClass } from 'lib/util'

const formAddress = (el) => {
  const countrySelector = select('#country', el)
  const provinceSelector = select('#province', el)

  const setupProvinces = () => {
    const provinces = JSON.parse(countrySelector.options[countrySelector.selectedIndex].dataset.provinces)
    provinceSelector.innerHTML = ''
    if (provinces.length) {
      let provinceOptions = ''

      for (const province of provinces) {
        provinceOptions += `<option value="${province[0]}">${province[1]}</option>`
      }

      provinceSelector.innerHTML = provinceOptions
      removeClass(provinceSelector.parentElement.parentElement, 'form-field--hidden')
    } else {
      addClass(provinceSelector.parentElement.parentElement, 'form-field--hidden')
    }
  }

  const correctLoc = (selector, attr) => {
    const userLoc = selector.getAttribute(`data-${attr}`)
    console.log(userLoc)
    const selectedLoc = selector.options[0]

    if (userLoc.localeCompare(selectedLoc.value) !== 0 && userLoc.length > 0) {
      for (const loc of selector.options) {
        if (userLoc.localeCompare(loc.value) === 0) {
          selectedLoc.selected = false
          loc.selected = true
          selector.insertBefore(loc, selectedLoc)
          break
        }
      }
    }
  }

  window.addEventListener('load', () => {
    setupProvinces()
    correctLoc(countrySelector, 'country')
    correctLoc(provinceSelector, 'province')
  })
  countrySelector.addEventListener('change', setupProvinces)
}

export default formAddress
