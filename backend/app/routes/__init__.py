from app.routes.comment_routes import comment_bp
from app.routes.task_routes import task_bp

def register_routes(app):
    app.register_blueprint(task_bp)
    app.register_blueprint(comment_bp)
