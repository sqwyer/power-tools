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

function createNew(list) {
    id++;

    let e = document.createElement('form');
    e.id = 'create-' + id;
    e.className = 'task no-padding';

    let sec1 = document.createElement('div');
    let sec2 = document.createElement('div');

    sec1.className = 'section';
    sec2.classList = 'section';

    let lab1 = document.createElement('label');
    lab1.innerHTML = 'Name';

    let inp1 = document.createElement('input');
    inp1.name = 'name';
    inp1.placeholder = 'My Task'

    let lab2 = document.createElement('label');
    lab2.innerHTML = 'Note';

    let inp2 = document.createElement('input');
    inp2.name = 'note';
    inp2.placeholder = 'My task\'s note.';

    let row = document.createElement('div');
    row.className = 'flex-row';
    row.style.display = 'flex';
    row.style.flexDirection = 'row';

    let make = document.createElement('button');
    make.className = 'btn success';
    make.type = 'submit';
    make.innerHTML = 'Save';
    make.style.flex = '1';

    let cancel = document.createElement('button');
    cancel.className = 'btn danger';
    cancel.type = 'button';
    cancel.innerHTML = 'Cancel';
    cancel.onclick = () => { document.querySelector('form#create-'+id) }
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

    console.log(list);

    list.prepend(e);
}