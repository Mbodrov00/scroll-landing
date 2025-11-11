# Nginx Configuration for planground

## Step-by-Step: Setting Up Nginx Config File

### 1. Open the File

```bash
sudo nano /etc/nginx/sites-available/planground
```

### 2. Paste This Complete Configuration

**If the file is empty, paste this entire block:**

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/planground/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # Main location - React Router support
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 3. Important: Replace Placeholders

**Before saving, replace:**
- `yourdomain.com` → Your actual domain name
- `www.yourdomain.com` → Your www subdomain (or remove this line if you don't use www)

**Example:**
```nginx
server_name planground.com www.planground.com;
```

### 4. Save and Exit

- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter` to save

### 5. Test the Configuration

```bash
sudo nginx -t
```

**Expected output:**
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

**If you see errors:**
- Check that you replaced `yourdomain.com` with your actual domain
- Make sure there are no typos
- Ensure all brackets `{}` are properly closed

### 6. Enable the Site

```bash
sudo ln -s /etc/nginx/sites-available/planground /etc/nginx/sites-enabled/
```

### 7. Reload Nginx

```bash
sudo systemctl reload nginx
```

---

## Complete Example Configuration

**If your domain is `planground.com` and you cloned to `/var/www/planground`:**

```nginx
server {
    listen 80;
    server_name planground.com www.planground.com;
    root /var/www/planground/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # Main location - React Router support
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## Configuration Explained

### `listen 80;`
- Listens on port 80 (HTTP)
- After SSL setup, Certbot will add port 443 (HTTPS)

### `server_name yourdomain.com www.yourdomain.com;`
- Tells Nginx which domain this config applies to
- Replace with your actual domain

### `root /var/www/planground/dist;`
- Points to your built files directory
- **Important:** Must point to the `dist` folder (where `npm run build` outputs files)

### `index index.html;`
- Default file to serve when accessing a directory

### `try_files $uri $uri/ /index.html;`
- **Critical for React Router!**
- Tries to serve the requested file
- If not found, tries as a directory
- If still not found, serves `index.html` (allows React Router to handle routes)

### Static Asset Caching
- Caches images, CSS, JS files for 1 year
- Improves performance

---

## Troubleshooting

### Error: "root" directive is not allowed here
- Make sure the `root` line is inside the `server { }` block
- Check that all brackets are properly closed

### Error: "server_name" has invalid value
- Make sure you replaced `yourdomain.com` with your actual domain
- No spaces in domain name

### 404 Not Found after setup
- Check that `/var/www/planground/dist` exists
- Verify `dist/index.html` exists
- Check file permissions: `ls -la /var/www/planground/dist`

### React Router routes return 404
- Ensure `try_files $uri $uri/ /index.html;` is in the config
- Make sure you're pointing to the `dist` folder

### Permission denied errors
```bash
sudo chown -R www-data:www-data /var/www/planground/dist
sudo chmod -R 755 /var/www/planground/dist
```

---

## After Configuration Works

1. **Set up SSL (HTTPS):**
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

2. **Verify site is working:**
   - Visit `http://yourdomain.com` (or `https://` after SSL)
   - Test React Router routes: `/blog`, `/team`

---

## Quick Reference

```bash
# Edit config
sudo nano /etc/nginx/sites-available/planground

# Test config
sudo nginx -t

# Enable site
sudo ln -s /etc/nginx/sites-available/planground /etc/nginx/sites-enabled/

# Reload Nginx
sudo systemctl reload nginx

# Check Nginx status
sudo systemctl status nginx

# View error logs
sudo tail -f /var/log/nginx/error.log
```

---

**That's it!** Once you paste the config, replace the domain, test, and enable it.







