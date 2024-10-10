from app import create_app, request, send_from_directory
import os

app = create_app()
@app.route('/api/uploads/users/<path:filename>', methods=['GET'])
def upload(filename):
    return send_from_directory(os.path.join(os.getcwd(), 'uploads', 'users'), filename)


@app.route('/api/image')
def serve_image():
    return send_from_directory(os.path.join(os.getcwd(), 'static'), 'user_photo.jpg')


if __name__ == "__main__":
    app.run(
        debug=True,
        host="0.0.0.0",
        port="5001"
    )