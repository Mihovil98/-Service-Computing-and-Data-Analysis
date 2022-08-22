const label = document.querySelector('.form-label')

function spinnerInfo() {
    const loading = document.querySelector('.spinner-border')
    const predictButton = document.querySelector('.predictbtn')
    loading.style.visibility = 'visible'
    predictButton.classList.add('disabled')
}
function savedInfo() {
    const info = document.querySelector('.saved')
    const resetButton = document.querySelector('.resetbtn')
    const saveButton = document.querySelector('.savebtn')
    info.style.visibility = 'visible'
    resetButton.classList.add('disabled')
    saveButton.classList.add('disabled')
}
function resetClick() {
    const resetButton = document.querySelector('.resetbtn')
    const saveButton = document.querySelector('.savebtn')
    resetButton.classList.add('disabled')
    saveButton.classList.add('disabled')
}