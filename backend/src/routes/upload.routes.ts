import { Router, Request, Response } from 'express'
import multer from 'multer'
import path from 'path'
import { v4 as uuid } from 'uuid'

const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname)
      cb(null, `${uuid()}${ext}`)
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp']
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowed.includes(ext)) {
      cb(null, true)
    } else {
      cb(new Error('仅支持 jpg、jpeg、png、webp 格式'))
    }
  },
})

export const uploadRouter = Router()

uploadRouter.post('/image', upload.single('image'), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: '未找到上传文件' })
    return
  }

  res.json({
    url: `/uploads/${req.file.filename}`,
    filename: req.file.filename,
    size: req.file.size,
  })
})
