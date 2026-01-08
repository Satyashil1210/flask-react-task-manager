from flask import Blueprint, request, jsonify
from app import db
from app.models.task import Task

task_bp = Blueprint("task_bp", __name__)

# CREATE TASK
@task_bp.route("/tasks", methods=["POST"])
def create_task():
    data = request.get_json()

    task = Task(title=data["title"])
    db.session.add(task)
    db.session.commit()

    return jsonify(task.to_dict()), 201


# GET ALL TASKS
@task_bp.route("/tasks", methods=["GET"])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([task.to_dict() for task in tasks]), 200


# UPDATE TASK
@task_bp.route("/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404

    data = request.get_json()
    task.title = data.get("title", task.title)
    db.session.commit()

    return jsonify(task.to_dict()), 200


# DELETE TASK
@task_bp.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404

    db.session.delete(task)
    db.session.commit()

    return jsonify({"message": "Task deleted"}), 200
