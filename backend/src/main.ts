import app from './app.js'

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`🌿 脆蜜金桔 AI 智能体后端已启动 → http://localhost:${PORT}`)
})
