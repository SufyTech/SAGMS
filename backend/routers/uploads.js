const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('image'), (req, res) => {
  const imagePath = path.join(__dirname, '..', 'uploads', req.file.filename);
  const pythonScript = path.join(__dirname, '..', '..', 'ai-model', 'detect.py');

  exec(`python ${pythonScript} ${imagePath}`, (err, stdout, stderr) => {
    if (err) return res.status(500).json({ error: 'Detection failed', details: stderr });

    res.json({ message: 'Detection complete', result: stdout });
  });
});

module.exports = router;
