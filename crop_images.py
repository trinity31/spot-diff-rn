from PIL import Image
import os

def crop_center(pil_img, crop_width, crop_height):
    img_width, img_height = pil_img.size
    return pil_img.crop(((img_width - crop_width) // 2,
                         (img_height - crop_height) // 2,
                         (img_width + crop_width) // 2,
                         (img_height + crop_height) // 2))

def crop_to_aspect_ratio(image_path, target_ratio=1.5):
    try:
        img = Image.open(image_path)
        width, height = img.size
        current_ratio = width / height
        
        if abs(current_ratio - target_ratio) < 0.01:
            print(f"Image {image_path} is already close to target ratio.")
            return

        print(f"Cropping {image_path} from {width}x{height} (Ratio: {current_ratio:.2f}) to 3:2")

        if current_ratio > target_ratio:
            # Too wide, crop width
            new_width = int(height * target_ratio)
            new_height = height
        else:
            # Too tall (square is usually here), crop height
            new_width = width
            new_height = int(width / target_ratio)

        cropped_img = crop_center(img, new_width, new_height)
        cropped_img.save(image_path)
        print(f"Saved {image_path} as {new_width}x{new_height}")

    except Exception as e:
        print(f"Error processing {image_path}: {e}")

# Paths to the V2 images
base_path = "/Users/trinity/Projects/find-difference/find-the-difference/assets/images"
images = [
    os.path.join(base_path, "season1_stage1_3to2_v2_orig.png"),
    os.path.join(base_path, "season1_stage1_3to2_v2_diff.png")
]

for img_path in images:
    crop_to_aspect_ratio(img_path, 3/2)
