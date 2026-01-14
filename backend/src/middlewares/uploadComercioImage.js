// Configuração do Multer para upload de imagens
import multer from "multer";
import path from "path";
import fs from "fs";

// Pasta onde as imagens serão salvas
const UPLOAD_DIR = path.resolve("uploads/comercios");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // Nome único: timestamp + original
    const ext = path.extname(file.originalname);
    const name =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_").toLowerCase();
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Arquivo não é uma imagem válida."), false);
  }
};

export const uploadComercioImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});
