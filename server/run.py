from app import create_app, request, send_from_directory
import os

app = create_app()
""" @app.route('/api/uploads/users/<path:filename>', methods=['GET'])
def fetch_user_photo_path(filename):
    return send_from_directory(os.path.join(os.getcwd(), 'uploads', 'users'), filename)

@app.route('/api/uploads/users/<int:user_id>/posts/<path:filename>', methods=['GET'])
def fetch_user_post_image(user_id, filename):
    # Define the path to the user's post images
    user_post_directory = os.path.join(os.getcwd(), 'uploads', 'users', f'user_{user_id}', 'posts')

    # Serve the file from the posts directory
    return send_from_directory(user_post_directory, filename)

@app.route('/api/image')
def serve_image():
    return send_from_directory(os.path.join(os.getcwd(), 'static'), 'user_photo.jpg')
 """

if __name__ == "__main__":
    app.run(
        debug=True,
        host="0.0.0.0",
        port="5001"
    )