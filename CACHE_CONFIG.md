# Performance Optimization Configuration

## Browser Caching Headers

### For Static Assets (Images, CSS, JS)
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary "Accept-Encoding";
}
```

### For HTML Files
```nginx
location ~* \.html$ {
    expires -1;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    add_header Expires "0";
}
```

## Content Delivery Network (CDN) Configuration

### Cloudflare Settings
- **Caching Level**: Standard
- **Browser Cache TTL**: 4 hours
- **Always Online**: Enabled
- **Auto Minify**: Enable for CSS, JS, and HTML
- **Brotli**: Enabled
- **Rocket Loader**: Disabled (can interfere with React)

### Image Optimization
- **Polish**: Lossless
- **WebP**: Automatic
- **AVIF**: Enabled

## Service Worker Cache Strategy

### Cache Names
- `medannot-v1-static`: For static assets (1 year)
- `medannot-v1-api`: For API responses (5 minutes)
- `medannot-v1-pages`: For HTML pages (network first)

### Cache Strategies
1. **Static Assets**: Cache First
2. **API Calls**: Network First (with cache fallback)
3. **HTML Pages**: Network First
4. **Images**: Cache First (with network fallback)

## Performance Monitoring

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **FCP (First Contentful Paint)**: < 1.8s
- **TTFB (Time to First Byte)**: < 600ms

### Monitoring Tools
1. **Google PageSpeed Insights**: Weekly checks
2. **WebPageTest**: Monthly comprehensive tests
3. **Chrome DevTools**: Daily development monitoring
4. **Real User Monitoring (RUM)**: Production monitoring

## Build Optimization

### Vite Configuration
- Code splitting enabled
- Tree shaking optimized
- Compression: Gzip + Brotli
- Asset optimization: WebP, responsive images
- Service worker for offline support

### Bundle Analysis
```bash
npm run build
npx vite-bundle-analyzer dist
```

## Database Query Optimization

### Supabase/RDS Optimization
- Index frequently queried columns
- Use connection pooling
- Implement query result caching
- Optimize image storage with CDN

## Mobile Performance

### Responsive Images
- Use `srcset` for different screen sizes
- Implement lazy loading
- Use WebP format with JPEG fallback
- Compress images appropriately

### Touch Optimization
- Use `touch-manipulation` CSS
- Implement passive event listeners
- Optimize for 60fps scrolling
- Minimize reflows and repaints