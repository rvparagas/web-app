var listEl = document.getElementById('notes-list');
var inputEl = document.getElementById('new-note');
var addBtn = document.getElementById('blue-btn');
var searchEl = document.getElementById('search-note');
var viewArea = document.getElementById('view-area');
var allNotes = [];

function viewNote(id) {
    viewArea.textContent = 'Loading...';
    viewArea.style.display = 'block';
    fetch('/api/notes/' + id)
        .then(function(res) { return res.json(); })
        .then(function(note) {
            viewArea.textContent = 'Note #' + note.id + ': ' + note.note;
        })
        .catch(function() {
            viewArea.textContent = 'Could not load note.';
        });
}

function renderNotes(notes) {
    listEl.innerHTML = '';
    if (notes.length === 0) {
        listEl.innerHTML = '<li class="empty">No notes match your search.</li>';
        return;
    }
    for (var i = 0; i < notes.length; i++) {
        var li = document.createElement('li');
        var span = document.createElement('span');
        span.className = 'note-text';
        span.textContent = notes[i].note;
        li.appendChild(span);
        var viewBtn = document.createElement('button');
        viewBtn.textContent = 'View';
        viewBtn.className = 'view-btn';
        viewBtn.onclick = (function(id) {
            return function() { viewNote(id); };
        })(notes[i].id);
        li.appendChild(viewBtn);
        var btn = document.createElement('button');
        btn.textContent = 'Delete';
        btn.className = 'delete-btn';
        btn.onclick = (function(id) {
            return function() {
                fetch('/api/notes/' + id, { method: 'DELETE' })
                .then(function() { loadNotes(); });
            };
        })(notes[i].id);
        li.appendChild(btn);
        listEl.appendChild(li);
    }
}

function filterAndRender() {
    if (allNotes.length === 0) {
        listEl.innerHTML = '<li class="empty">No notes yet. Add one above.</li>';
        return;
    }
    var q = searchEl.value.trim().toLowerCase();
    if (q === '') {
        renderNotes(allNotes);
        return;
    }
    var filtered = [];
    for (var j = 0; j < allNotes.length; j++) {
        if (allNotes[j].note.toLowerCase().indexOf(q) !== -1) {
            filtered.push(allNotes[j]);
        }
    }
    renderNotes(filtered);
}

function loadNotes() {
    viewArea.style.display = 'none';
    viewArea.textContent = '';
    fetch('/api/notes')
        .then(function(res) { return res.json(); })
        .then(function(notes) {
            allNotes = notes;
            if (notes.length === 0) {
                listEl.innerHTML = '<li class="empty">No notes yet. Add one above.</li>';
                return;
        }
            filterAndRender();
        })
        .catch(function() {
            listEl.innerHTML = '<li class="empty">Error loading notes.</li>';
        });
}

addBtn.onclick = function() {
    var text = inputEl.value.trim();
    if (!text) return;
    fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: text })
    })
    .then(function(res) { return res.json(); })
    .then(function() {
        inputEl.value = '';
        loadNotes();
    })
    .catch(function() {
        listEl.innerHTML = '<li class="empty">Error adding note.</li>';
    });
};

    searchEl.oninput = filterAndRender;
loadNotes();