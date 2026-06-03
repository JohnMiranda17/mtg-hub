# Board Vision — Local Card Recognition Roadmap

Goal: detect MTG cards from a photo without sending images to an external API.

## Current approach (Phase 1 — shipped)

Send photos to Claude Vision via the `mtg-vision-parse` Supabase Edge Function.  
Pros: works immediately, handles poor lighting and angles.  
Cons: requires Anthropic API, images leave the device.

---

## Phase 2 — OCR-based recognition (browser, no server)

Use [Tesseract.js](https://github.com/naptha/tesseract.js) to run OCR in the browser.

**How it works:**
1. User uploads a photo.
2. Crop each card region from the image (manually or with a simple grid assumption).
3. Run Tesseract on the name-line region (top ~15% of each card).
4. Match extracted text against the Scryfall bulk-data card name list (fuzzy match).
5. Build board state text from matched names.

**Limitations:**
- Works best on well-lit, flat photos with minimal card overlap.
- Requires Tesseract.js (~10 MB WASM download, cached after first load).
- Fuzzy match handles minor OCR errors but not completely obscured text.

**Implementation sketch:**
```js
import Tesseract from 'tesseract.js';

async function extractCardName(imageSrc, { x, y, w, h }) {
  const { data: { text } } = await Tesseract.recognize(imageSrc, 'eng', {
    rectangle: { top: y, left: x, width: w, height: h },
  });
  return fuzzyMatch(text.trim(), scryfallNameList);
}
```

---

## Phase 3 — Perceptual hash matching (most accurate, larger dataset)

**How it works:**
1. Download Scryfall's bulk image dataset (card art thumbnails).
2. Pre-compute perceptual hashes (pHash) for each card image, store as a lookup table.
3. In the browser, segment the photo into individual card regions.
4. Compute pHash for each region and compare against the lookup table.
5. Return the closest match above a confidence threshold.

**Tools:**
- `imghash` or a custom pHash implementation in JS.
- Card segmentation: OpenCV.js or a simple contour-finding approach.
- Scryfall bulk data: `https://api.scryfall.com/bulk-data` (small images ~2 GB total).

**Limitations:**
- Requires pre-downloading a large hash table (~few MB for names + hashes).
- Sensitive to card art vs. full card view (front-face art only vs. full frame).
- Angle and lighting correction needed for good accuracy.

---

## Phase 4 — ML object detection (highest accuracy)

**How it works:**
1. Train a YOLO or EfficientDet model on MTG card images.
2. Export to ONNX format.
3. Run in-browser with [ONNX.js](https://github.com/microsoft/onnxjs) or `@tensorflow/tfjs`.
4. Model outputs bounding boxes + class predictions (card name or set/collector number).
5. Cross-reference collector number with Scryfall API to get full card data.

**Training data:** Scryfall bulk image export (~80k unique cards) with synthetic augmentation (rotation, blur, lighting variation).

**Model size target:** < 20 MB quantized for browser delivery.

**Estimated accuracy:** > 95% on well-lit, face-up cards.

---

## Decision guide

| Need                      | Approach     |
|---------------------------|--------------|
| Works today, any image    | Phase 1 (Claude Vision) |
| No API, readable cards    | Phase 2 (Tesseract OCR) |
| High accuracy, offline    | Phase 3 (pHash lookup)  |
| Production-grade accuracy | Phase 4 (ML model)      |
