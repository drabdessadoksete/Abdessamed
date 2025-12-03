import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'

const app = express()
const PORT = process.env.PORT || 5000
const DATA_DIR = path.join(process.cwd(), 'server')
const DATA_FILE = path.join(DATA_DIR, 'data.json')
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads')

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify({ services: [], gallery: { implant: [], invisalign: [], general: [] }, messages: [], articles: [], media: [] }, null, 2)
  )
}

const readData = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))

app.use(cors({ origin: true }))
app.use(express.json({ limit: '5mb' }))
app.use('/uploads', express.static(UPLOAD_DIR))

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`)
  },
})
const upload = multer({ storage })

const tokens = new Set()
const requireAuth = (req, res, next) => { next() }

app.post('/api/auth/login', (req, res) => {
  const { password } = req.body || {}
  const expected = process.env.ADMIN_PASSWORD || 'admin'
  if (password !== expected) return res.status(401).json({ error: 'invalid' })
  const token = uuidv4()
  tokens.add(token)
  res.json({ token })
})

// Services endpoints
app.get('/api/services', (_, res) => {
  const data = readData()
  res.json(data.services)
})

app.post('/api/services', requireAuth, (req, res) => {
  const { title, description } = req.body
  if (!title) return res.status(400).json({ error: 'title required' })
  const data = readData()
  const item = { id: uuidv4(), title, description: description || '' }
  data.services.push(item)
  writeData(data)
  res.status(201).json(item)
})

app.put('/api/services/:id', requireAuth, (req, res) => {
  const { id } = req.params
  const { title, description } = req.body
  const data = readData()
  const idx = data.services.findIndex((s) => s.id === id)
  if (idx === -1) return res.status(404).json({ error: 'not found' })
  data.services[idx] = { ...data.services[idx], title: title ?? data.services[idx].title, description: description ?? data.services[idx].description }
  writeData(data)
  res.json(data.services[idx])
})

app.delete('/api/services/:id', requireAuth, (req, res) => {
  const { id } = req.params
  const data = readData()
  const idx = data.services.findIndex((s) => s.id === id)
  if (idx === -1) return res.status(404).json({ error: 'not found' })
  const removed = data.services.splice(idx, 1)[0]
  writeData(data)
  res.json(removed)
})

// Gallery endpoints
app.get('/api/gallery', (_, res) => {
  const data = readData()
  res.json(data.gallery)
})

app.post('/api/gallery/:section', requireAuth, upload.single('file'), async (req, res) => {
  const { section } = req.params
  const valid = ['implant', 'invisalign', 'general']
  if (!valid.includes(section)) return res.status(400).json({ error: 'invalid section' })
  const data = readData()
  let url = req.body.url
  let thumbUrl = null
  if (req.file) {
    url = `/uploads/${req.file.filename}`
    const thumbName = `${path.parse(req.file.filename).name}-thumb.jpg`
    const thumbPath = path.join(UPLOAD_DIR, thumbName)
    try {
      const m = await import('sharp')
      await m.default(req.file.path).resize(400).jpeg({ quality: 80 }).toFile(thumbPath)
      thumbUrl = `/uploads/${thumbName}`
    } catch {}
  }
  if (!url) return res.status(400).json({ error: 'file or url required' })
  const item = { id: uuidv4(), url, thumbUrl }
  data.gallery[section].push(item)
  writeData(data)
  res.status(201).json(item)
})

app.delete('/api/gallery/:section/:id', requireAuth, (req, res) => {
  const { section, id } = req.params
  const valid = ['implant', 'invisalign', 'general']
  if (!valid.includes(section)) return res.status(400).json({ error: 'invalid section' })
  const data = readData()
  const idx = data.gallery[section].findIndex((i) => i.id === id)
  if (idx === -1) return res.status(404).json({ error: 'not found' })
  const removed = data.gallery[section].splice(idx, 1)[0]
  writeData(data)
  res.json(removed)
})

// Messages endpoints
app.get('/api/messages', (_, res) => {
  const data = readData()
  res.json(data.messages)
})

app.post('/api/messages', (req, res) => {
  const { name, email, phone, message } = req.body
  if (!name || !email || !message) return res.status(400).json({ error: 'name, email, message required' })
  const data = readData()
  const item = { id: uuidv4(), name, email, phone: phone || '', message, createdAt: new Date().toISOString() }
  data.messages.push(item)
  writeData(data)
  res.status(201).json(item)
})

// Media library
app.post('/api/media/upload', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'file required' })
  const data = readData()
  const id = uuidv4()
  const url = `/uploads/${req.file.filename}`
  let meta = { width: null, height: null }
  let thumbUrl = null
  try {
    const m = await import('sharp')
    const img = m.default(req.file.path)
    const info = await img.metadata()
    meta = { width: info.width || null, height: info.height || null }
    const thumbName = `${path.parse(req.file.filename).name}-thumb.jpg`
    const thumbPath = path.join(UPLOAD_DIR, thumbName)
    await img.resize(360).jpeg({ quality: 80 }).toFile(thumbPath)
    thumbUrl = `/uploads/${thumbName}`
  } catch {}
  const item = { id, url, thumbUrl, meta, createdAt: new Date().toISOString() }
  data.media.push(item)
  writeData(data)
  res.status(201).json(item)
})

app.get('/api/media', requireAuth, (_, res) => {
  const data = readData()
  res.json(data.media)
})

// Articles
app.get('/api/articles', (req, res) => {
  const { status } = req.query
  const data = readData()
  let list = data.articles
  if (status) list = list.filter((a) => a.status === status)
  res.json(list)
})

app.get('/api/articles/:id', (req, res) => {
  const data = readData()
  const a = data.articles.find((x) => x.id === req.params.id)
  if (!a) return res.status(404).json({ error: 'not found' })
  res.json(a)
})

app.post('/api/articles', requireAuth, (req, res) => {
  const { title, contentHTML, status, media } = req.body
  if (!title || !contentHTML) return res.status(400).json({ error: 'title and content required' })
  const data = readData()
  const now = new Date().toISOString()
  const item = { id: uuidv4(), title, contentHTML, status: status || 'draft', media: media || [], createdAt: now, updatedAt: now, versions: [{ at: now, title, contentHTML }] }
  data.articles.push(item)
  writeData(data)
  res.status(201).json(item)
})

app.put('/api/articles/:id', requireAuth, (req, res) => {
  const { id } = req.params
  const { title, contentHTML, status, media } = req.body
  const data = readData()
  const idx = data.articles.findIndex((a) => a.id === id)
  if (idx === -1) return res.status(404).json({ error: 'not found' })
  const now = new Date().toISOString()
  const prev = data.articles[idx]
  prev.versions.push({ at: now, title: title ?? prev.title, contentHTML: contentHTML ?? prev.contentHTML })
  data.articles[idx] = { ...prev, title: title ?? prev.title, contentHTML: contentHTML ?? prev.contentHTML, status: status ?? prev.status, media: media ?? prev.media, updatedAt: now }
  writeData(data)
  res.json(data.articles[idx])
})

app.delete('/api/articles/:id', requireAuth, (req, res) => {
  const { id } = req.params
  const data = readData()
  const idx = data.articles.findIndex((a) => a.id === id)
  if (idx === -1) return res.status(404).json({ error: 'not found' })
  const removed = data.articles.splice(idx, 1)[0]
  writeData(data)
  res.json(removed)
})

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})