import os
import io
import face_recognition 
from PIL import Image
import numpy as np 
import gc
from werkzeug.utils import secure_filename
from google.cloud import storage


GCS_BUCKET_NAME = 'pklink'

def delete_post_folder_from_gcs(user_id, post_id):
    """Deletes all files inside a post_<post_id> folder from GCS."""
    try:
        bucket_name = "pklink"  # Replace with your actual GCS bucket
        storage_client = storage.Client()
        bucket = storage_client.bucket(bucket_name)

        # Construct the folder path
        folder_prefix = f"uploads/users/user_{user_id}/posts/post_{post_id}/".replace("\\", "/")  # Ensure correct format

        # List all objects in the folder
        blobs = list(bucket.list_blobs(prefix=folder_prefix))

        if not blobs:
            print(f"No files found in {folder_prefix}. Folder might already be empty or deleted.")
            return False

        # Delete all files in the folder
        for blob in blobs:
            blob_name = blob.name.replace("\\", "/")  # Ensure correct format
            bucket.blob(blob_name).delete()
            print(f"Deleted {blob_name} from GCS")

        print(f"Deleted folder {folder_prefix} from GCS")
        return True
    except Exception as e:
        print(f"Error deleting folder from GCS: {e}")
        return False


def upload_image_to_gcs(image_file, destination_path):
    """
    Uploads an image to Google Cloud Storage.

    Args:
        image_file (FileStorage): The uploaded image file.
        destination_path (str): The path where the image will be stored in the bucket.

    Returns:
        str: The public URL of the uploaded image if successful, otherwise an empty string.
    """
    try:
        # Initialize GCS client
        client = storage.Client()
        bucket = client.bucket(GCS_BUCKET_NAME)
        blob = bucket.blob(destination_path)
        
        # Upload image to GCS
        blob.upload_from_file(image_file, content_type=image_file.content_type)
        
        # Make the file public (optional)
        blob.make_public()
        
        print(f"Image uploaded to GCS: {blob.public_url}")
        return blob.public_url  # Return the URL of the uploaded image
    except Exception as e:
        print(f"Error uploading to GCS: {e}")
        return ""  # Return empty string in case of failure

def generate_gcs_post_image_path(user_id, post_id, image_ext):
    """
    Generates a GCS storage path for a given image.

    Args:
        user_id (int): Unique identifier for the user.
        post_id (int): Unique identifier for the post.
        image_ext (str): File extension of the image (e.g., 'jpg', 'png').

    Returns:
        str: The GCS path for storing the image.
    """
    return f"uploads/users/user_{user_id}/posts/post_{post_id}/post_image.{image_ext}"

def generate_gcs_incident_image_path(user_id, incident_id, image_ext):
    """
    Generates a GCS storage path for a given image.

    Args:
        user_id (int): Unique identifier for the user.
        incident_id (int): Unique identifier for the incident.
        image_ext (str): File extension of the image (e.g., 'jpg', 'png').

    Returns:
        str: The GCS path for storing the image.
    """
    return f"uploads/users/user_{user_id}/incidents/incident_{incident_id}/incident_image.{image_ext}"

def generate_gcs_registration_image_path(user_id, image_type, image_ext):
    """
    Generates a GCS storage path for user registration images.

    Args:
        user_id (int): Unique identifier for the user.
        image_type (str): Type of the image (e.g., 'selfie', 'gov_id', 'user_photo').
        image_ext (str): File extension of the image (e.g., 'jpg', 'png').

    Returns:
        str: The GCS path for storing the image.
    """
    return f"uploads/users/user_{user_id}/{image_type}.{image_ext}"


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
