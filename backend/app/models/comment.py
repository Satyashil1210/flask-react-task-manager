from app import db

class Comment(db.Model):
    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(255), nullable=False)

    task_id = db.Column(
        db.Integer,
        db.ForeignKey("tasks.id"),
        nullable=False
    )

    def to_dict(self):
        return {
            "id": self.id,
            "content": self.content,
            "task_id": self.task_id
        }
