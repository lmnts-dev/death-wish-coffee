/**
 * Initializes the site's navigation module.
 * @constructor
 * @param {Object} el - The site's navigation container element.
 */

import { toggle } from 'lib/util'

const navigation = el => {
  const hamburger = el.querySelector('.navigation__mobile-menu')
  const mobileMenu = el.querySelector('.navigation__menu-container')
  const searchButton = el.querySelector('.navigation__action--search')
  const searchBar = el.querySelector('.navigation__search')
  const breakpointXLMax = window.matchMedia('(max-width: 1199px)')
  const menuContainer = el.querySelector('.navigation__menu-container')

  const searchBarRepos = () => {
    if (breakpointXLMax.matches) {
      menuContainer.insertBefore(searchBar, menuContainer.childNodes[0])
    } else {
      el.insertBefore(searchBar, el.childNodes[0])
    }
  }

  breakpointXLMax.addListener(searchBarRepos)

  searchBarRepos()

  searchButton.addEventListener('click', () => {
    toggle(searchBar, 'active')
  })

  hamburger.addEventListener('click', () => {
    toggle(hamburger, 'is-active')
    toggle(mobileMenu, 'active')
  })
}

export default navigation
