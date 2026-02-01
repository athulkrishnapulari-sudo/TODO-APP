let tasks = JSON.parse(localStorage.getItem('pro_bento_tasks')) || [];

function toTitleCase(str) {
    if (!str) return '';
    return String(str)
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

function addTask() {
    const titleRaw = document.getElementById('taskName').value;
    const title = toTitleCase(titleRaw);
    const date = document.getElementById('taskDate').value;
    if (!title || !date) return;

    tasks.push({
        id: Date.now(),
        title,
        desc: document.getElementById('taskDesc').value,
        date,
        cat: document.getElementById('taskCat').value,
        imp: document.getElementById('isImp').checked,
        done: false
    });
    saveAndRender();
    document.getElementById('taskName').value = '';
    document.getElementById('taskDesc').value = '';
}

function saveAndRender() {
    localStorage.setItem('pro_bento_tasks', JSON.stringify(tasks));
    render();
}

function render() {
    const mainFeed = document.getElementById('mainFeed');
    const priorityFeed = document.getElementById('priorityFeed');
    const query = (document.getElementById('search')?.value || '').toLowerCase();

    mainFeed.innerHTML = '';
    priorityFeed.innerHTML = '';
    tasks.sort((a, b) => new Date(a.date) - new Date(b.date));

    tasks.forEach(t => {
        if (!t.title.toLowerCase().includes(query)) return;

        const html = `
            <div class="task-item" style="border-left: 8px solid ${t.imp ? '#f87171' : '#6366f1'}">
                <div id="view-${t.id}">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <strong>${toTitleCase(t.title)}</strong>
                        <span style="font-size:0.8rem; background:#f1f5f9; padding:4px 8px; border-radius:10px;">${t.cat}</span>
                    </div>
                    <p style="color:#64748b; margin:10px 0;">${t.desc}</p>
                    <small>📅 ${t.date.replace('T', ' ')}</small>
                    <div style="margin-top:15px; display:flex; gap:10px;">
                        <button onclick="toggleDone(${t.id})">${t.done ? 'Undo' : 'Complete'}</button>
                        <button onclick="showEdit(${t.id})">Edit</button>
                        <button onclick="delTask(${t.id})">Delete</button>
                    </div>
                </div>
                <div id="edit-${t.id}" style="display:none">
                    <input type="text" id="et-${t.id}" value="${toTitleCase(t.title)}">
                    <textarea id="ed-${t.id}">${t.desc}</textarea>
                    <button onclick="saveEdit(${t.id})" class="btn-primary" style="padding:10px;">Update</button>
                </div>
            </div>
        `;

        mainFeed.innerHTML += html;
        if (t.imp && !t.done) priorityFeed.innerHTML += html;
    });

    updateStats();
}

function showEdit(id) {
    document.querySelectorAll(`#view-${id}`).forEach(v => v.style.display = 'none');
    document.querySelectorAll(`#edit-${id}`).forEach(e => e.style.display = 'block');
}

function saveEdit(id) {
    const t = tasks.find(x => x.id === id);
    if (!t) return;
    t.title = toTitleCase(document.getElementById(`et-${id}`).value);
    t.desc = document.getElementById(`ed-${id}`).value;
    saveAndRender();
}

function toggleDone(id) {
    const t = tasks.find(x => x.id === id);
    if (!t) return;
    t.done = !t.done;
    saveAndRender();
}

function delTask(id) {
    tasks = tasks.filter(x => x.id !== id);
    saveAndRender();
}

function updateStats() {
    const total = tasks.length;
    const done = tasks.filter(x => x.done).length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    const pf = document.getElementById('progressFill');
    const pt = document.getElementById('percentText');
    if (pf) pf.style.width = percent + '%';
    if (pt) pt.innerText = percent + '%';
}

render();