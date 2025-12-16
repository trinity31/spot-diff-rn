import os
import glob
from PIL import Image

# Configuration
ARTIFACT_DIR = '/Users/trinity/.gemini/antigravity/brain/75faba39-ec62-4ca3-bc61-668b3d7d772f'
TARGET_DIR = '/Users/trinity/Projects/find-difference/find-the-difference/assets/images/season1'
ASPECT_RATIO = 1.2

def crop_center(image, target_ratio):
    width, height = image.size
    img_ratio = width / height

    if img_ratio > target_ratio:
        # Image is wider than target, crop width
        new_width = int(height * target_ratio)
        left = (width - new_width) // 2
        top = 0
        right = left + new_width
        bottom = height
    else:
        # Image is taller/narrower than target, crop height
        new_height = int(width / target_ratio)
        left = 0
        top = (height - new_height) // 2
        right = width
        bottom = top + new_height

    return image.crop((left, top, right, bottom))

def process_images():
    if not os.path.exists(TARGET_DIR):
        os.makedirs(TARGET_DIR)

    files = glob.glob(os.path.join(ARTIFACT_DIR, 'season1_stage*.png'))
    files.sort()

    processed_count = 0

    for file_path in files:
        filename = os.path.basename(file_path)
        parts = filename.split('_')
        
        # Check if it matches season1_stageX_type_timestamp.png
        # We need at least 3 parts: season1, stageX, type
        if len(parts) >= 3:
            stage_part = parts[1] # stage5
            type_part = parts[2]  # orig or diff
            
            # Simple validation
            if not stage_part.startswith('stage') or type_part not in ['orig', 'diff']:
                continue
                
            # Construct target filename
            target_filename = f"season1_{stage_part}_{type_part}.png"
            target_path = os.path.join(TARGET_DIR, target_filename)
            
            # Process
            try:
                img = Image.open(file_path)
                cropped_img = crop_center(img, ASPECT_RATIO)
                cropped_img.save(target_path)
                print(f"Processed {filename} -> {target_filename}")
                processed_count += 1
            except Exception as e:
                print(f"Error processing {filename}: {e}")

    print(f"Total processed images: {processed_count}")

if __name__ == "__main__":
    process_images()
