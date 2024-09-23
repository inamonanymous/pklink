from app import create_app, request
app = create_app()

@app.route('/api/user/verifyfacecheck', methods=['POST'])
def verify_face():
    from app.service.functions import verify_face
    gov_id = request.files['gov_id']
    selfie = request.files['selfie']

    if verify_face(gov_id, selfie):
        return "Face matched"
    return 'Face not matched'
if __name__ == "__main__":
    app.run(
        debug=True,
        host="0.0.0.0",
        port="5001"
    )