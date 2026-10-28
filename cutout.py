import onnxruntime as ort, numpy as np, cv2, os, sys, time, glob
MODELS = {
  'general': ('BiRefNet-general-epoch_244.onnx', 1024),
  'lite': ('BiRefNet-general-bb_swin_v1_tiny-epoch_232.onnx', 1024),
}
def run(model, size):
    o = ort.SessionOptions(); o.intra_op_num_threads = os.cpu_count()
    s = ort.InferenceSession(model, o, providers=['CPUExecutionProvider'])
    os.makedirs('out/' + tag, exist_ok=True)
    for p in sorted(glob.glob('src/*.png')):
        t = time.time()
        bgr = cv2.imread(p); h, w = bgr.shape[:2]
        rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
        im = cv2.resize(rgb, (size, size), interpolation=cv2.INTER_LANCZOS4).astype(np.float32)
        im = im / max(im.max(), 1e-6)
        im = (im - np.array((0.485, 0.456, 0.406), np.float32)) / np.array((0.229, 0.224, 0.225), np.float32)
        out = s.run(None, {s.get_inputs()[0].name: im.transpose(2, 0, 1)[None].astype(np.float32)})[0][0, 0]
        out = 1 / (1 + np.exp(-out))
        a = cv2.resize(out.astype(np.float32), (w, h), interpolation=cv2.INTER_CUBIC)
        cv2.imwrite('out/%s/%s' % (tag, os.path.basename(p)), np.clip(a * 255, 0, 255).astype(np.uint8))
        print(tag, os.path.basename(p), '%.1fs' % (time.time() - t), flush=True)
tag = sys.argv[1]
run(*MODELS[tag])
