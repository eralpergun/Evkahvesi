
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Custom plugin to serve specific files directly
const serveStaticFilesPlugin = () => {
  return {
    name: 'serve-static-files',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/sitemap.xml') {
          const sitemapPath = path.resolve(__dirname, 'public/sitemap.xml');
          if (fs.existsSync(sitemapPath)) {
            res.setHeader('Content-Type', 'application/xml');
            res.end(fs.readFileSync(sitemapPath, 'utf-8'));
            return;
          }
        }
        if (req.url === '/googleb4f6380fc462631a.html') {
          const googlePath = path.resolve(__dirname, 'public/googleb4f6380fc462631a.html');
          if (fs.existsSync(googlePath)) {
            res.setHeader('Content-Type', 'text/html');
            res.end(fs.readFileSync(googlePath, 'utf-8'));
            return;
          }
        }
        if (req.url === '/robots.txt') {
          const robotsPath = path.resolve(__dirname, 'public/robots.txt');
          if (fs.existsSync(robotsPath)) {
            res.setHeader('Content-Type', 'text/plain');
            res.end(fs.readFileSync(robotsPath, 'utf-8'));
            return;
          }
        }
        next();
      });
    }
  };
};

export default defineConfig({
  plugins: [react(), serveStaticFilesPlugin()],
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
