import select from 'select-dom'
import { removeClass, addClass } from 'lib/util'

const ADD_NEW_BUTTON_SELECTOR = '.js-add-new-button'
const EDIT_BUTTON_SELECTOR = '.js-edit-button'
const ADD_NEW_FORM_SELECTOR = '.js-address-form-add'
const LIST_SELECTOR = '.js-address-list'
const EDIT_FORM_SELECTOR = '.js-address-form-edit'
const EDIT_SELECTOR = (id) => `.js-address-form-edit-${id}`

const customerAddresses = (el) => {
  const addNewButtonEl = select(ADD_NEW_BUTTON_SELECTOR, el)
  const editButtonEls = select.all(EDIT_BUTTON_SELECTOR, el)
  const editFormEls = select.all(EDIT_FORM_SELECTOR, el)
  const newAddressFormEl = select(ADD_NEW_FORM_SELECTOR, el)
  const addressListEl = select(LIST_SELECTOR, el)
  const cancelAddressFormButtonEls = select.all('.js-cancel-address-form')

  const showAddressForm = (e) => {
    e.preventDefault()
    const formId = e.currentTarget.dataset.id
    const formEl = (typeof formId !== 'undefined' && formId.length) ? select(EDIT_SELECTOR(formId), el) : newAddressFormEl
    if (formEl) {
      removeClass(formEl, 'hidden')
    }
    if (addressListEl) {
      addClass(addressListEl, 'hidden')
    }
  }

  const hideAllAddressForm = () => {
    if (editFormEls) {
      for (const editFormEl of editFormEls) {
        addClass(editFormEl, 'hidden')
      }
    }

    if (newAddressFormEl) {
      addClass(newAddressFormEl, 'hidden')
    }
  }

  const hideAddressForm = (e) => {
    e.preventDefault()
    const formId = e.currentTarget.dataset.id
    const formEl = (typeof formId !== 'undefined' && formId.length) ? select(EDIT_SELECTOR(formId), el) : newAddressFormEl
    if (formEl) {
      addClass(formEl, 'hidden')
    }
    if (addressListEl) {
      removeClass(addressListEl, 'hidden')
    }
  }

  if (addNewButtonEl) {
    addNewButtonEl.addEventListener('click', (e) => {
      hideAllAddressForm()
      showAddressForm(e)
    })
  }

  if (editButtonEls.length) {
    for (const editButtonEl of editButtonEls) {
      editButtonEl.addEventListener('click', (e) => {
        hideAllAddressForm()
        showAddressForm(e)
      })
    }
  }

  if (cancelAddressFormButtonEls.length) {
    for (const cancelButtonEl of cancelAddressFormButtonEls) {
      cancelButtonEl.addEventListener('click', hideAddressForm)
    }
  }
}

export default customerAddresses
