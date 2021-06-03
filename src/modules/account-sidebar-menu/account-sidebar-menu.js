import select from 'select-dom'

const TRIGGER_SELECTOR = '.js-account-sidebar-menu-trigger'
const TRIGGER_ACTIVE_CLASS = 'account-sidebar-menu__trigger--active'
const CONTENT_SELECTOR = '.js-account-sidebar-menu-content'

const accountSidebarMenu = (el) => {
  const triggerEl = select(TRIGGER_SELECTOR, el)
  const contentEl = select(CONTENT_SELECTOR, el)
  if (triggerEl && contentEl) {
    triggerEl.addEventListener('click', () => {
      triggerEl.classList.toggle(TRIGGER_ACTIVE_CLASS)
      contentEl.style.maxHeight = contentEl.style.maxHeight ? null : `${contentEl.scrollHeight}px`
    })
    window.addEventListener('resize', () => {
      triggerEl.classList.remove(TRIGGER_ACTIVE_CLASS)
      contentEl.style.maxHeight = null
    })
  }
}

export default accountSidebarMenu
