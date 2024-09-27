from app import create_app, request
app = create_app()

@app.route('/api/user/verifyfacecheck', methods=['POST'])
def verify_face():
    from app.service.s_functions import verify_face
    gov_id = request.files['gov_id']
    selfie = request.files['selfie']

    if not verify_face(gov_id, selfie):
        return "No face detected"
    return 'Face detected'
if __name__ == "__main__":
    app.run(
        debug=True,
        host="0.0.0.0",
        port="5001"
    )