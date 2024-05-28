const categoryUri = 'https://localhost:7201/api/Categories';
const artistUri = 'https://localhost:7201/api/Artists';
const workUri = 'https://localhost:7201/api/Works';
let categories = [];
let artists = [];
let works = [];

function getCategories() {
    fetch(categoryUri)
        .then(response => response.json())
        .then(data => _displayCategories(data))
        .catch(error => console.error('Unable to get categories.', error));
}

function getArtists() {
    fetch(artistUri)
        .then(response => response.json())
        .then(data => _displayArtists(data))
        .catch(error => console.error('Unable to get artists.', error));
}

function getWorks() {
    fetch(workUri)
        .then(response => response.json())
        .then(data => _displayWorks(data))
        .catch(error => console.error('Unable to get works.', error));
}

function addCategory() {
    var name = document.getElementById("add-name").value;
    var description = document.getElementById("add-description").value;

    if (!name.trim() || !description.trim()) {
        alert("Category name and description cannot be empty.");
        return;
    }

    var category = {
        name: name,
        description: description
    };

    fetch('/api/categories', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(category)
    })
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                getCategories();
            } else {
                alert("Failed to add category");
            }
        });
}

function addArtist() {
    var name = document.getElementById("add-artist-name").value;
    var description = document.getElementById("add-artist-description").value;

    if (!name.trim() || !description.trim()) {
        alert("Artist name and description cannot be empty.");
        return;
    }

    var artist = {
        name: name,
        description: description
    };

    fetch('/api/artists', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(artist)
    })
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                getArtists();
            } else {
                alert("Failed to add artist");
            }
        });
}

function addWork() {
    var title = document.getElementById("add-work-title").value;
    var description = document.getElementById("add-work-description").value;
    var categoryId = document.getElementById("add-work-category").value;
    var artistId = document.getElementById("add-work-artist").value;

    if (!title.trim() || !description.trim()) {
        alert("Work title and description cannot be empty.");
        return;
    }

    var work = {
        title: title,
        description: description,
        categoryId: parseInt(categoryId)
    };

    fetch(workUri, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(work)
    })
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                if (artistId) {
                    addArtistToWork(data.id, parseInt(artistId));
                }
                getWorks();
            } else {
                alert("Failed to add work");
            }
        });
}

function addArtistToWork(workId, artistId) {
    var artistWork = {
        artistId: artistId,
        workId: workId
    };

    fetch('/api/artistworks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(artistWork)
    })
    .then(response => response.json())
    .then(data => {
        if (data.id) {
            getWorks();
        } else {
            alert("Failed to associate artist with work");
        }
    });
}

function deleteWork(id) {
    fetch(`${workUri}/${id}`, {
        method: 'DELETE'
    })
        .then(() => getWorks())
        .catch(error => console.error('Unable to delete work.', error));
}

function deleteCategory(id) {
    fetch(`${categoryUri}/${id}`, {
        method: 'DELETE'
    })
        .then(() => getCategories())
        .catch(error => console.error('Unable to delete category.', error));
}

function deleteArtist(id) {
    fetch(`${artistUri}/${id}`, {
        method: 'DELETE'
    })
        .then(() => getArtists())
        .catch(error => console.error('Unable to delete artist.', error));
}

function _displayCategories(data) {
    const tBody = document.getElementById('categories');
    tBody.innerHTML = '';

    data.forEach(category => {
        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        let textNode = document.createTextNode(category.name);
        td1.appendChild(textNode);

        let td2 = tr.insertCell(1);
        let textNodeDescription = document.createTextNode(category.description);
        td2.appendChild(textNodeDescription);

        let td3 = tr.insertCell(2);
        let editButton = document.createElement('button');
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', `displayEditForm(${category.id}, 'category')`);
        td3.appendChild(editButton);

        let deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', `deleteCategory(${category.id})`);
        td3.appendChild(deleteButton);
    });

    categories = data;
}

function _displayArtists(data) {
    const tBody = document.getElementById('artists');
    tBody.innerHTML = '';

    data.forEach(artist => {
        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        let textNode = document.createTextNode(artist.name);
        td1.appendChild(textNode);

        let td2 = tr.insertCell(1);
        let textNodeDescription = document.createTextNode(artist.description);
        td2.appendChild(textNodeDescription);

        let td3 = tr.insertCell(2);
        let editButton = document.createElement('button');
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', `displayEditForm(${artist.id}, 'artist')`);
        td3.appendChild(editButton);

        let deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', `deleteArtist(${artist.id})`);
        td3.appendChild(deleteButton);
    });

    artists = data;
}

function _displayWorks(data) {
    const tBody = document.getElementById('works');
    tBody.innerHTML = '';

    data.forEach(work => {
        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        let textNode = document.createTextNode(work.title);
        td1.appendChild(textNode);

        let td2 = tr.insertCell(1);
        let textNodeDescription = document.createTextNode(work.description);
        td2.appendChild(textNodeDescription);

        let td3 = tr.insertCell(2);
        let textNodeCategory = document.createTextNode(work.category ? work.category.name : 'Unknown');
        td3.appendChild(textNodeCategory);

        let td4 = tr.insertCell(3);
        let textNodeArtists = document.createTextNode(work.artists.length > 0 ? work.artists.map(a => a.name).join(', ') : 'Unknown');
        td4.appendChild(textNodeArtists);

        let td5 = tr.insertCell(4);
        let editButton = document.createElement('button');
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', `displayEditForm(${work.id}, 'work')`);
        td5.appendChild(editButton);

        let deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', `deleteWork(${work.id})`);
        td5.appendChild(deleteButton);
    });

    works = data;
}



function displayEditForm(id, type) {
    let url;
    switch (type) {
        case 'category':
            url = `${categoryUri}/${id}`;
            break;
        case 'artist':
            url = `${artistUri}/${id}`;
            break;
        case 'work':
            url = `${workUri}/${id}`;
            break;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById('edit-id').value = data.id;
            document.getElementById('edit-type').value = type;

            // Show or hide appropriate fields based on the type
            document.getElementById('edit-category-form').style.display = 'none';
            document.getElementById('edit-artist-form').style.display = 'none';
            document.getElementById('edit-work-form').style.display = 'none';

            switch (type) {
                case 'category':
                    document.getElementById('edit-category-form').style.display = 'block';
                    document.getElementById('edit-name').value = data.name;
                    document.getElementById('edit-description').value = data.description;
                    break;
                case 'artist':
                    document.getElementById('edit-artist-form').style.display = 'block';
                    document.getElementById('edit-artist-name').value = data.name;
                    document.getElementById('edit-artist-description').value = data.description;
                    break;
                case 'work':
                    document.getElementById('edit-work-form').style.display = 'block';
                    document.getElementById('edit-title').value = data.title;
                    document.getElementById('edit-description').value = data.description;
                    document.getElementById('edit-category').value = data.categoryId;
                    document.getElementById('edit-artist').value = data.artistId;
                    break;
            }

            document.getElementById('editForm').style.display = 'block';
        })
        .catch(error => console.error('Unable to fetch data for editing.', error));
}


function closeInput() {
    document.getElementById('editForm').style.display = 'none';
    document.getElementById('edit-id').value = '';
    document.getElementById('edit-name').value = '';
    document.getElementById('edit-description').value = '';
    document.getElementById('edit-title').value = '';
    document.getElementById('edit-category').value = '';
    document.getElementById('edit-artist').value = '';
}

function updateItem() {
    const itemId = document.getElementById('edit-id').value;
    const itemType = document.getElementById('edit-type').value;

    let item;
    let url;
    switch (itemType) {
        case 'category':
            item = {
                id: itemId,
                name: document.getElementById('edit-name').value.trim(),
                description: document.getElementById('edit-description').value.trim()
            };
            url = `${categoryUri}/${itemId}`;
            break;
        case 'artist':
            item = {
                id: itemId,
                name: document.getElementById('edit-artist-name').value.trim(),
                description: document.getElementById('edit-artist-description').value.trim()
            };
            url = `${artistUri}/${itemId}`;
            break;
        case 'work':
            item = {
                id: itemId,
                title: document.getElementById('edit-title').value.trim(),
                description: document.getElementById('edit-description').value.trim(),
                categoryId: parseInt(document.getElementById('edit-category').value, 10),
                artistId: parseInt(document.getElementById('edit-artist').value, 10)
            };
            url = `${workUri}/${itemId}`;
            break;
    }

    fetch(url, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(() => {
            closeInput();
            if (itemType === 'category') getCategories();
            if (itemType === 'artist') getArtists();
            if (itemType === 'work') getWorks();
        })
        .catch(error => console.error('Unable to update item.', error));
}


function populateCategorySelect() {
    fetch(categoryUri)
        .then(response => response.json())
        .then(data => {
            let select = document.getElementById('add-work-category');
            select.innerHTML = '';
            data.forEach(category => {
                let option = document.createElement('option');
                option.value = category.id;
                option.text = category.name;
                select.add(option);
            });
        });
}

function populateArtistSelect() {
    fetch(artistUri)
        .then(response => response.json())
        .then(data => {
            let select = document.getElementById('add-work-artist');
            select.innerHTML = '';
            data.forEach(artist => {
                let option = document.createElement('option');
                option.value = artist.id;
                option.text = artist.name;
                select.add(option);
            });
        })
        .catch(error => console.error('Unable to populate artist select.', error));
}


function populateEditDropdowns() {
    fetch(categoryUri)
        .then(response => response.json())
        .then(data => {
            let select = document.getElementById('edit-category');
            select.innerHTML = '';
            data.forEach(category => {
                let option = document.createElement('option');
                option.value = category.id;
                option.text = category.name;
                select.add(option);
            });
        });

    fetch(artistUri)
        .then(response => response.json())
        .then(data => {
            let select = document.getElementById('edit-artist');
            select.innerHTML = '';
            data.forEach(artist => {
                let option = document.createElement('option');
                option.value = artist.id;
                option.text = artist.name;
                select.add(option);
            });
        });
}

document.addEventListener('DOMContentLoaded', function () {
    getCategories();
    getArtists();
    getWorks();
    populateCategorySelect();
    populateArtistSelect();
    populateEditDropdowns(); // Populate dropdowns for editing works
});

