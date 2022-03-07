// let defaults = {};

// function _inputWactch(id) {
//     let form = document.getElementById(id);
//     if(form) {
//         let inputs = [...form.querySelectorAll('input'), ...form.querySelectorAll('textarea')].map(s=>s.value);
//         let inputsNotEmpty = [...form.querySelectorAll('input.not-empty'), ...form.querySelectorAll('textarea.not-empty')].map(s=>s.value);
//         if(inputsNotEmpty.includes('')) return form.querySelector('.submit-btn').disabled = true;
//         let def = defaults[id];
//         if(!inputs.every((val, index) => val==def[index])) form.querySelector('.submit-btn').disabled = false;
//         else form.querySelector('.submit-btn').disabled = true;
//     }
//     else {
//         console.error(`No form with id ${id}`);
//     }
// }

// function watch(id) {
//     let form = document.getElementById(id);
//     if(form) {
//         let inputs = [...form.querySelectorAll('input'), ...form.querySelectorAll('textarea')];
//         defaults[id] = inputs.map(s=>s.value);
//         inputs.forEach(input => input.addEventListener('input', () => _inputWactch(id)));
//     }
//     else {
//         console.error(`No form with id ${id}`);
//     }
// }

//