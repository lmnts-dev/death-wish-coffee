/**
 * Initializes the site's navigation module.
 * @constructor
 * @param {Object} el - The site's navigation container element.
 */

import { toggle } from 'lib/util'

const navigation = el => {
  const navigation = el
  const hamburger = el.querySelector('.js-hamburger')
  const closeButton = el.querySelector('.js-close')
  const close = el.querySelector('.navigation__search-close')
  const mobileMenu = el.querySelector('.js-mobile-menu')
  const searchButton = el.querySelector('.navigation__utilities-search')
  const searchBar = el.querySelector('.search-bar')
  const breakpointXLMax = window.matchMedia('(max-width: 1199px)')
  const navContainer = el.querySelector('.navigation__container')

  const searchBarRepos = () => {
    if (searchBar) {
      el.insertBefore(searchBar, el.childNodes[0])
    }
  }

  breakpointXLMax.addListener(searchBarRepos)

  searchBarRepos()

  if (searchButton) {
    searchButton.addEventListener('click', () => {
      toggle(searchBar, 'active')
      toggle(navContainer, 'hide')
      toggle(navigation, 'flex')
      toggle(navigation, 'bg--shadow')
    })
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      toggle(hamburger, 'is-active')
      toggle(mobileMenu, 'active')
    })
  }

  if (closeButton && mobileMenu) {
    closeButton.addEventListener('click', () => {
      toggle(hamburger, 'is-active')
      toggle(mobileMenu, 'active')
    })
  }

  close.addEventListener('click', () => {
    console.log('test')
    toggle(searchBar, 'active')
    toggle(navContainer, 'hide')
    toggle(navigation, 'flex')
    toggle(navigation, 'bg--shadow')
  })
}

export default navigation
