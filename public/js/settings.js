function _archiveInputWatch(e, p) {
    if(e.value != p) document.getElementById('archive-submit').disabled = true;
    else document.getElementById('archive-submit').disabled = false;
}

window.onload = () => {
    let form = document.getElementById('archive-form');
    let input = form.querySelector('input');
    let p = input.placeholder;

    input.addEventListener('input', () => _archiveInputWatch(input, p))
}