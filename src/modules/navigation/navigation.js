/**
 * Initializes the site's navigation module.
 * @constructor
 * @param {Object} el - The site's navigation container element.
 */

import { toggle } from 'lib/util'

const navigation = el => {
  const hamburger = el.querySelector('.js-hamburger')
  const closeButton = el.querySelector('.js-close')
  const mobileMenu = el.querySelector('.js-mobile-menu')
  const searchButton = el.querySelector('.navigation__utilities-search')
  const searchBar = el.querySelector('.search-bar')
  const breakpointXLMax = window.matchMedia('(max-width: 1199px)')
  const menuContainer = el.querySelector('.navigation__menu-container')
  const navContainer = el.querySelector('.navigation__container')

  const searchBarRepos = () => {
    if (breakpointXLMax.matches) {
      if (menuContainer && searchBar) {
        menuContainer.insertBefore(searchBar, menuContainer.childNodes[0])
      }
    } else {
      if (searchBar) {
        el.insertBefore(searchBar, el.childNodes[0])
      }
    }
  }

  breakpointXLMax.addListener(searchBarRepos)

  searchBarRepos()

  if (searchButton) {
    searchButton.addEventListener('click', () => {
      toggle(searchBar, 'active')
      toggle(navContainer, 'hide')
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
}

export default navigation
