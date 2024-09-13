import os
USER_FOLDER = f"uploads/users"

def check_image_validity(*args) -> bool:
    valid_photo_ext = ('.png', '.jpg' ,'.jpeg')
    for i in args:
        if i.filename=='' or not i.filename.lower().endswith(valid_photo_ext):
            return False
    return True

def get_image_registration_path(user_dir, **kwargs):
    user_photo = ""
    selfie = kwargs['selfie']
    gov_id = kwargs['gov_id']

    if not check_image_validity(selfie, gov_id):
        return {}
    user_photo_path = ""
    if user_photo!="":
        user_photo = kwargs['user_photo']
        user_photo_path = os.path.join(user_dir, user_photo.filename)
        user_photo.save(user_photo_path)
    selfie_path = os.path.join(user_dir, selfie.filename)
    gov_id_path = os.path.join(user_dir, gov_id.filename)
    return  {
                'user_photo_path': user_photo_path if user_photo_path != "" else "",
                'selfie_path': selfie_path,
                'gov_id_path': gov_id_path
            }

def create_user_directory(user_id):
    user_directory = f"{USER_FOLDER}/user_{str(user_id)}"
    if not os.path.exists(user_directory):
        os.makedirs(user_directory)  # Create directory if it does not exist
        return user_directory
    return user_directory

def save_user_registration_image(img, img_path):
    try:
        img.save(img_path)
        return True
    except:
        return False
    
def check_if_local(brgy_street_id, village_id):
    if brgy_street_id:
        return True
    if village_id:
        return False