def test_create_note(client, auth_headers):
    response = client.post("/notes/", json={
        "title": "Test Note",
        "content": "This is a test note"
    }, headers=auth_headers)

    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Note"
    assert data["content"] == "This is a test note"
    assert "id" in data

def test_read_notes(client, auth_headers):
    response = client.get("/notes/", headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_update_note(client, auth_headers):
    create_resp = client.post("/notes/", json={
        "title": "Old Title",
        "content": "Old content"
    }, headers=auth_headers)

    note_id = create_resp.json()["id"]

    update_resp = client.patch(f"/notes/{note_id}", json={
        "title": "New Title"
    }, headers=auth_headers)

    assert update_resp.status_code == 200
    assert update_resp.json()["title"] == "New Title"

def test_delete_note(client, auth_headers):
    create_resp = client.post("/notes/", json={
        "title": "Delete Me",
        "content": "To be deleted"
    }, headers=auth_headers)

    note_id = create_resp.json()["id"]

    delete_resp = client.delete(f"/notes/{note_id}", headers=auth_headers)
    assert delete_resp.status_code == 204

    get_resp = client.get("/notes/", headers=auth_headers)
    ids = [note["id"] for note in get_resp.json()]
    assert note_id not in ids

"""
Running:
cd backend
python -m pytest -v

no need to run main backend server
"""