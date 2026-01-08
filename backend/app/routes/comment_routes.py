from flask import Blueprint, request, jsonify
from app import db
from app.models.comment import Comment

comment_bp = Blueprint("comment_bp", __name__)

# -------------------------
# ADD COMMENT
# -------------------------
@comment_bp.route("/tasks/<int:task_id>/comments", methods=["POST"])
def add_comment(task_id):
    data = request.get_json()

    if not data or "content" not in data:
        return jsonify({"error": "Content is required"}), 400

    comment = Comment(
        content=data["content"],
        task_id=task_id
    )

    db.session.add(comment)
    db.session.commit()

    return jsonify(comment.to_dict()), 201


# -------------------------
# UPDATE COMMENT
# -------------------------
@comment_bp.route("/comments/<int:comment_id>", methods=["PUT"])
def update_comment(comment_id):
    comment = Comment.query.get(comment_id)

    if not comment:
        return jsonify({"error": "Comment not found"}), 404

    data = request.get_json()
    comment.content = data.get("content", comment.content)

    db.session.commit()
    return jsonify(comment.to_dict()), 200


# -------------------------
# DELETE COMMENT
# -------------------------
@comment_bp.route("/comments/<int:comment_id>", methods=["DELETE"])
def delete_comment(comment_id):
    comment = Comment.query.get(comment_id)

    if not comment:
        return jsonify({"error": "Comment not found"}), 404

    db.session.delete(comment)
    db.session.commit()

    return jsonify({"message": "Comment deleted successfully"}), 200
