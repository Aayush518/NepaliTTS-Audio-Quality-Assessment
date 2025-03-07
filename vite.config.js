import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [ 'nepali-tts-audio-quality-assessment.vercel.app/survey', 'nepali-tts-audio-quality-assessment.vercel.app','nepali-tts-audio-quality-assessment-shishirrijals-projects.vercel.app', 'nepali-tts-audio-quality-assessment-shishirrijals-projects.vercel.app/survey']
  }
})
