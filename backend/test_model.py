import zipfile, json, shutil, os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

SRC = 'model/model_klasifikasi_dokumen_kelompok10.keras'
DST = 'model/model_patched.keras'

def patch_config(obj):
    if isinstance(obj, dict):
        obj.pop('quantization_config', None)
        for v in obj.values():
            patch_config(v)
    elif isinstance(obj, list):
        for item in obj:
            patch_config(item)

print("step 1: patching config...")
with zipfile.ZipFile(SRC, 'r') as zin:
    with zipfile.ZipFile(DST, 'w', zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            if item.filename == 'config.json':
                config = json.loads(zin.read(item.filename).decode('utf-8'))
                patch_config(config)
                zout.writestr(item, json.dumps(config))
            else:
                zout.writestr(item, zin.read(item.filename))

print("step 2: loading patched model...")
import keras
model = keras.models.load_model(DST, compile=False)
print("step 3: SUCCESS", model.input_shape)