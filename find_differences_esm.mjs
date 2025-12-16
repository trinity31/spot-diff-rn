// find_differences_esm.mjs
// Usage: node find_differences_esm.mjs <orig.png> <diff.png>

import fs from 'fs';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

function loadImage(path) {
  return new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(path)
      .pipe(new PNG())
      .on('parsed', function () {
        resolve(this);
      })
      .on('error', reject);
  });
}

function getDiffClusters(origImg, diffImg, threshold = 0.1) {
  const { width, height } = origImg;
  const diff = new PNG({ width, height });
  const numDiffPixels = pixelmatch(origImg.data, diffImg.data, diff.data, width, height, { threshold });
  const mask = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const idx = i * 4;
    mask[i] = diff.data[idx] > 0 ? 1 : 0; // any non-zero indicates diff
  }
  const visited = new Uint8Array(width * height);
  const clusters = [];
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pos = y * width + x;
      if (mask[pos] && !visited[pos]) {
        const queue = [pos];
        visited[pos] = 1;
        let sumX = 0, sumY = 0, count = 0;
        while (queue.length) {
          const cur = queue.pop();
          const cx = cur % width;
          const cy = Math.floor(cur / width);
          sumX += cx;
          sumY += cy;
          count++;
          for (const [dx, dy] of dirs) {
            const nx = cx + dx;
            const ny = cy + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const npos = ny * width + nx;
              if (mask[npos] && !visited[npos]) {
                visited[npos] = 1;
                queue.push(npos);
              }
            }
          }
        }
        const centroidX = sumX / count;
        const centroidY = sumY / count;
        clusters.push({ x: centroidX / width, y: centroidY / height });
      }
    }
  }
  return clusters;
}

(async () => {
  const [origPath, diffPath] = process.argv.slice(2);
  if (!origPath || !diffPath) {
    console.error('Usage: node find_differences_esm.mjs <orig.png> <diff.png>');
    process.exit(1);
  }
  try {
    const [origImg, diffImg] = await Promise.all([loadImage(origPath), loadImage(diffPath)]);
    const clusters = getDiffClusters(origImg, diffImg);
    const result = clusters.map((c, idx) => ({ id: idx + 1, x: Number(c.x.toFixed(4)), y: Number(c.y.toFixed(4)), radius: 0.06 }));
    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
})();
