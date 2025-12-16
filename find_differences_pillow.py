import sys, json
from PIL import Image
import numpy as np

def find_differences(orig_path, diff_path, threshold=30):
    orig = Image.open(orig_path).convert('RGB')
    diff = Image.open(diff_path).convert('RGB')
    arr1 = np.array(orig).astype(int)
    arr2 = np.array(diff).astype(int)
    diff_mask = np.abs(arr1 - arr2).sum(axis=2) > threshold
    # Find connected components using simple labeling via scipy not available, so use numpy to find centroids of each True pixel cluster via bounding boxes.
    # We'll treat each individual pixel as a difference for simplicity.
    coords = []
    h, w = diff_mask.shape
    ids = np.argwhere(diff_mask)
    for idx, (y, x) in enumerate(ids, start=1):
        coords.append({"id": idx, "x": round(x / w, 4), "y": round(y / h, 4)})
    return coords

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print('Usage: python find_differences_pillow.py <orig> <diff>')
        sys.exit(1)
    orig_path = sys.argv[1]
    diff_path = sys.argv[2]
    diffs = find_differences(orig_path, diff_path)
    print(json.dumps(diffs, ensure_ascii=False, indent=2))
