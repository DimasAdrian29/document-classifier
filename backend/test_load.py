import traceback
try:
    import tf_keras
    m = tf_keras.models.load_model("model/model_klasifikasi_dokumen_kelompok10.keras")
    print("BERHASIL:", m.output_shape)
except Exception as e:
    traceback.print_exc()