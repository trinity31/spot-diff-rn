import sys
import json
import cv2
import numpy as np

def find_differences(orig_path, diff_path, threshold=30):
    orig = cv2.imread(orig_path)
    diff = cv2.imread(diff_path)
    if orig is None or diff is None:
        raise FileNotFoundError('Image not found')
    # Compute absolute difference per channel and sum
    diff_mask = np.sum(cv2.absdiff(orig, diff), axis=2) > threshold
    # Connected components
    num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(diff_mask.astype(np.uint8), connectivity=8)
    results = []
    h, w = diff_mask.shape
    for i in range(1, num_labels):  # skip background 0
        cx, cy = centroids[i]
        results.append({
            "id": i,
            "x": round(cx / w, 4),
            "y": round(cy / h, 4)
        })
    return results

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print('Usage: python find_differences.py <orig_path> <diff_path>')
        sys.exit(1)
    orig_path = sys.argv[1]
    diff_path = sys.argv[2]
    diffs = find_differences(orig_path, diff_path)
    print(json.dumps(diffs, ensure_ascii=False, indent=2))
