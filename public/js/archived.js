window.onload = () => {
    let a = document.getElementById('project-state');
    if(a) {
        if(a.innerHTML = '1') {
            let k = [...document.querySelectorAll('input'), ...document.querySelectorAll('textarea'), ...document.querySelectorAll('button'), ...document.querySelectorAll('select')];
            for(let i = 0; i < k.length; i++) {
                if(!k[i].classList.contains('archive-exc')) {
                    let o = k[i].cloneNode(true);
                    o.disabled = true;
                    k[i].parentNode.replaceChild(o, k[i]);
                }
            }
            let r = [...document.querySelectorAll('.del-archived')];
            for(let i = 0; i < r.length; i++) {
                r[i].remove();
            }
        }
    }
}