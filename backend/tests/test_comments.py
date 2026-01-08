def test_add_comment(client):
    response = client.post(
        "/tasks/1/comments",
        json={"content": "This is a test comment"}
    )
    assert response.status_code == 201


def test_update_comment(client):
    # First add comment
    post_response = client.post(
        "/tasks/1/comments",
        json={"content": "Old comment"}
    )
    comment_id = post_response.json["id"]

    # Update comment
    response = client.put(
        f"/comments/{comment_id}",
        json={"content": "Updated comment"}
    )
    assert response.status_code == 200


def test_delete_comment(client):
    # First add comment
    post_response = client.post(
        "/tasks/1/comments",
        json={"content": "Delete me"}
    )
    comment_id = post_response.json["id"]

    # Delete comment
    response = client.delete(f"/comments/{comment_id}")
    assert response.status_code == 200
