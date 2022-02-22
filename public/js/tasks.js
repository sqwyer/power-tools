/*
<div class="section">
    <h4 class="push-up-small">{{name}}</h4>
    <p>{{note}}</p>
</div>
<div class="section">
    {{#ifEmpty due}}
    <a href="/project/{{@root/project.id}}/1/{{../id}}/{{id}}">No due date.</a>
    {{else}}
    <a href="/project/{{@root/project.id}}/1/{{../id}}/{{id}}">Due {{due}}.</a>
    {{/ifEmpty}}
</div>
*/

let id = 0;

function getJson() {
    let newtasks = localStorage.getItem('new-tasks');
    let parsed = [];

    if(newtasks == null) parsed = [];
    else parsed = JSON.parse(newtasks);

    if(typeof parsed == 'string') parsed = getJson();
    
    return JSON.parse(parsed);
}

function listener (mId) {
    let list = getJson();

    let find = list.find(self => self.id === mId);
    let ind = list.indexOf(find);

    let form = document.getElementById('create-' + find.id);
    let inp1 = form.querySelector('.inp1');
    let inp2 = form.querySelector('.inp2');

    list[ind].inp1 = inp1;
    list[ind].inp2 = inp2;

    localStorage.setItem('new-tasks', JSON.stringify(list));
}

function save(mId) {
    let list = getJson();

    let find = list.find(self => self.id === mId);
    let ind = list.indexOf(find);

    let form = document.getElementById('create-' + find.id);

    list.splice(ind, 1);
    localStorage.setItem('new-tasks', JSON.stringify(list));
    
    form.submit();
}

function cancelC(mId) {
    let list = getJson();

    let find = list.find(self => self.id === mId);
    let ind = list.indexOf(find);

    let form = document.getElementById('create-' + find.id);
    
    form.remove();
    list.splice(ind, 1);
    localStorage.setItem('new-tasks', JSON.stringify(list));
}

function createNew(list, inp1val, inp2val) {
    id++;

    console.log(list);

    let lid = list.id.split('-')[1];
    let e = document.createElement('form');

    e.action = '/project/' + lid + '/1/create';
    e.method = 'POST';
    e.id = 'create-' + id;
    e.className = 'task no-padding';

    let listId = document.createElement('input');
    listId.name = 'list';
    listId.style.display = 'none';
    listId.value = lid;

    let sec1 = document.createElement('div');
    let sec2 = document.createElement('div');

    sec1.className = 'section';
    sec2.classList = 'section';

    let lab1 = document.createElement('label');
    lab1.innerHTML = 'Name';

    let inp1 = document.createElement('input');
    inp1.className = 'inp1';
    inp1.name = 'name';
    inp1.placeholder = 'My Task';
    inp1.value = inp1val || '';

    let lab2 = document.createElement('label');
    lab2.innerHTML = 'Note';

    let inp2 = document.createElement('input');
    inp2.className = 'inp2';
    inp2.name = 'note';
    inp2.placeholder = 'My task\'s note.';
    inp2.value = inp2val || '';

    inp1.addEventListener('input', () => listener());
    inp2.addEventListener('input', () => listener());

    let row = document.createElement('div');
    row.className = 'flex-row';
    row.style.display = 'flex';
    row.style.flexDirection = 'row';

    let make = document.createElement('button');
    make.className = 'btn success';
    make.type = 'submit';
    make.innerHTML = 'Save';
    make.onclick = () => { save(id) }
    make.style.flex = '1';

    let cancel = document.createElement('button');
    cancel.className = 'btn danger';
    cancel.type = 'button';
    cancel.innerHTML = 'Cancel';
    cancel.onclick = () => { cancelC(id) }
    cancel.style.flex = '1';

    make.style.height = '100%';
    cancel.style.height = '100%';
    make.style.marginTop = '0';
    cancel.style.marginTop = '0';
    sec2.style.marginTop = '0';
    

    sec1.appendChild(lab1);
    sec1.appendChild(inp1);
    sec1.appendChild(lab2);
    sec1.appendChild(inp2);

    row.appendChild(make);
    row.appendChild(cancel);

    sec2.appendChild(row);

    e.appendChild(sec1);
    e.appendChild(sec2);
    e.appendChild(listId);

    list.prepend(e);

    let N = getJson();
    if(!N.find(self => self.id === id)) {
        N.push({
            lid: '',
            name: '',
            note: ''
        });
        localStorage.setItem('new-tasks', JSON.stringify(N))
    }
}

let L = getJson();

console.log(L, JSON.parse(L));

for(let i = 0; i < L.length; i++) {
    createNew(L[i].lid, L[i].name, L[i].note);
}