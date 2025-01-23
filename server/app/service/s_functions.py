import os
import io
import face_recognition 
from PIL import Image
import numpy as np 
import gc
from werkzeug.utils import secure_filename


USER_FOLDER = f"uploads/users"


def save_post_image(user_id, post_id, img) -> str:
    """
    Receives an image and saves it to the user's post directory.

    Args:
        user_id (int): Unique identifier for the user.
        post_id (int): Unique identifier for the post.
        img (FileStorage): The uploaded image to be saved.

    Returns:
        str: The path to the saved image if it was saved successfully, or an empty string if there was an error.
    """
    # Create the post directory for the user and post
    post_directory = create_post_directory(user_id, post_id)
    
    # Check if the image is valid
    img_ext = check_image_validity(img)
    if not img_ext:
        print("Invalid image extension.")
        return ""  # Return empty string in case of error
    
    # Generate a secure filename for the image
    img_filename = f"post_image.{img_ext}"
    img_path = os.path.join(post_directory, img_filename)
    
    # Save the image
    try:
        img.save(img_path)
        print(f"Image saved successfully: {img_path}")
        return img_path  # Return the path to the saved image
    except Exception as e:
        print(f"Error saving image: {e}")  # Log the exception for debugging
        return ""  # Return empty string in case of error
    
def create_post_directory(user_id, post_id) -> str:
    """
    Creates a directory for storing user-specific posts, including a subdirectory for each post.

    Args:
        user_id (int): Unique identifier for the user.
        post_id (int): Unique identifier for the post.
    
    Returns:
        str: The path to the user's post directory for the specific post.
    """
    # Path to the post directory with an additional post-specific subdirectory
    post_directory = f"{USER_FOLDER}/user_{str(user_id)}/posts/post_{post_id}"
    
    # Check if the directory already exists, and create it if not
    if not os.path.exists(post_directory):
        os.makedirs(post_directory)  # Create the specific post directory
        print(f"Post directory created: {post_directory}")
    
    return post_directory

def check_image_validity(img):
    """
    Validates the uploaded image by checking its file extension.

    Args:
        img: file object (e.g., selfie, gov_id, photo).
    
    Returns:
        str or bool: 
            - Returns the valid extension if the file is a valid image (with extensions '.png', '.jpg', '.jpeg').
            - Returns False if the file is missing or has an invalid extension.
    """
    valid_photo_ext = ('.png', '.jpg', '.jpeg')
    
    # Check if the file has a valid filename and extension
    if img.filename == '':
        return False
    
    if img.filename.lower().endswith(valid_photo_ext):
        return img.filename.lower().split('.')[-1]  # Return the valid extension
    
    return False  # Return False if the extension is invalid
    

def get_image_registration_path(user_dir, **kwargs) -> dict:
    """
    Generates the file paths where the user's images will be saved (selfie, gov_id, and optionally user_photo).
    It also checks if the provided images are valid.

    Args:
        user_dir (str): The directory where images will be stored.
        kwargs: A dictionary containing the image files:
            - 'selfie' (file): The selfie image.
            - 'gov_id' (file): The government ID image.
            - 'user_photo' (optional file): The user's profile photo, if provided.
    
    Returns:
        dict: 
            - A dictionary containing the paths to saved images:
                - 'selfie_path' (str): Path to the selfie image.
                - 'gov_id_path' (str): Path to the government ID image.
                - 'user_photo_path' (str, optional): Path to the user photo, if provided.
            - Returns an empty dictionary if images are invalid.
    """
    
    # Initialize paths
    paths = {
        'user_photo_path': '',
        'selfie_path': '',
        'gov_id_path': ''
    }

    # Extract images from kwargs
    selfie = kwargs.get('selfie')
    gov_id = kwargs.get('gov_id')
    user_photo = kwargs.get('user_photo', None)

    # Validate images
    seflie_ext = check_image_validity(selfie)
    gov_id_ext = check_image_validity(gov_id)

    if not (seflie_ext or gov_id_ext): 
        return {}

    # Create user directory if it doesn't exist
    if not os.path.exists(user_dir):
        os.makedirs(user_dir)

    # Generate paths for selfie and government ID
    paths['selfie_path'] = os.path.join(user_dir, f"selfie.{seflie_ext}") if selfie else ''
    paths['gov_id_path'] = os.path.join(user_dir, f"gov_id.{gov_id_ext}") if gov_id else ''

    # If user photo is provided, generate its path
    if user_photo:
        user_photo_ext = check_image_validity(user_photo)
        paths['user_photo_path'] = os.path.join(user_dir, f"user_photo.{user_photo_ext}")

    return paths

def create_user_directory(user_id) -> str:
    """
    Creates a directory for storing user-specific files if it doesn't exist.

    Args:
        user_id (int): Unique identifier for the user.
    
    Returns:
        str: The path to the user's directory.
    """
    user_directory = f"{USER_FOLDER}/user_{str(user_id)}"
    if not os.path.exists(user_directory):
        os.makedirs(user_directory)  # Create directory if it does not exist
        return user_directory
    return user_directory

def save_user_registration_image(img, img_path) -> bool:
    try:
        print(f'Saving image to: {img_path}')
        img.save(img_path)
        print(f'Image saved successfully: {img_path}')
        return True
    except Exception as e:
        print(f'Error saving image: {e}')  # Log the exception for debugging
        return False

    
def check_if_local(brgy_street_id, village_id) -> bool:
    """
    Determines whether a user is local based on their barangay street or village ID.
    
    Args:
        brgy_street_id (int or None): The ID of the barangay street.
        village_id (int or None): The ID of the village.
    
    Returns:
        bool:
            - True if a barangay street ID is provided (user is local).
            - False if only a village ID is provided (user is not local).
    
    Raises:
        ValueError: If both `brgy_street_id` and `village_id` are provided, or if neither is provided.
    """
    # Raise an error if both or neither of the arguments are provided
    if (brgy_street_id and village_id) or not (brgy_street_id or village_id):
        raise ValueError("Either 'brgy_street_id' or 'village_id' must be provided, but not both.")
    if brgy_street_id:
        return True
    if village_id:
        return False

import time
def verify_face(id_photo, face_scan):
    """
    stephen pogi
    Verifies if the face in the provided ID photo and face scan is valid.

    Args:
        id_photo (FileStorage): The uploaded ID photo file object.
        face_scan (FileStorage): The uploaded face scan (selfie) file object.

    Returns:
        bool:
            - True if the face in the ID photo and the face in the face scan is valid.
            - False if there is no face is detected, or an error occurs.
    """
    if not check_image_validity(face_scan):
        print('face scan not valid')
        return False
    if not check_image_validity(id_photo):
        print('government id not valid')
        return False
    start_time = time.time()
    try:
        # Load images directly into memory (without saving to disk)
        id_photo_stream = io.BytesIO(id_photo.read())
        face_scan_stream = io.BytesIO(face_scan.read()) 

        # Reset file pointers for later saving
        id_photo.seek(0)
        face_scan.seek(0)

        # Try to open the images using Pillow and convert them to RGB
        try:
            id_image = Image.open(id_photo_stream)
            face_image = Image.open(face_scan_stream)
            print("Images loaded and converted successfully.")
        except Exception as e:
            print(f"Error loading or converting images: {e}")
            return False  # Return False if there's an issue with loading the images

        # Convert Pillow images back to numpy arrays for face_recognition
        id_image_np = np.array(id_image)
        face_image_np = np.array(face_image)

        # Try to get face encodings from both images
        try:
            id_face_encodings = face_recognition.face_encodings(id_image_np)
            face_scan_encodings = face_recognition.face_encodings(face_image_np)
        except Exception as e:
            print(f"Error getting face encodings: {e}")
            return False  # Return False if there's an issue with face encoding

        # Check if any face encodings were found
        if len(id_face_encodings) == 0 or len(face_scan_encodings) == 0:
            print('id ', len(id_face_encodings))
            print('selfie ', len(face_scan_encodings))
            print("No face detected in one of the images.")
            return False  # No face found in one of the images

        # Return True if both images contain faces
        return True

    except Exception as e:
        print(f"Unexpected error occurred: {e}")
        return False  # Catch any unexpected errors
    
    finally:
        end_time = time.time()
        print(f"Time taken to execute verify_face: {end_time - start_time:.2f} seconds")
