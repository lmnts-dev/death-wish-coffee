const addressList = (el) => {
  const removeForm = el.querySelectorAll('.address-list__remove-form')
  removeForm.forEach(deleteForm => {
    deleteForm.addEventListener('submit', event => {
      const confirmMessage = event.target.getAttribute('data-confirm-message')
      if (
        !window.confirm(
          confirmMessage || 'Are you sure you wish to delete this address?'
        )
      ) {
        event.preventDefault()
      }
    })
  })
}

export default addressList
