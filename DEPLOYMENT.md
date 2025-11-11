# Deployment Guide: VPS + Namecheap Domain

## Overview
This guide walks you through deploying your Vite + React app to an Atlantic VPS with a Namecheap domain.

## Prerequisites
- Domain name on Namecheap
- VPS on Atlantic (Ubuntu/Debian recommended)
- SSH access to your VPS
- Basic terminal knowledge

---

## Step 1: Build Your Application Locally

```bash
# In your project directory
npm run build
```

This creates a `dist/` folder with production-ready static files.

**Test the build locally:**
```bash
npm run preview
```

---

## Step 2: Prepare Your VPS

### 2.1 Connect to Your VPS
```bash
ssh root@your-vps-ip
# or
ssh your-username@your-vps-ip
```

### 2.2 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 2.3 Install Required Software

**Install Node.js (if you need Node for any server-side features):**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

**Install Nginx (web server):**
```bash
sudo apt install -y nginx
```

**Install Certbot (for SSL certificates):**
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 2.4 Create Application Directory
```bash
sudo mkdir -p /var/www/planground
sudo chown -R $USER:$USER /var/www/planground
```

---

## Step 3: Configure DNS on Namecheap

1. Log into your Namecheap account
2. Go to **Domain List** → Select your domain → **Manage**
3. Go to **Advanced DNS** tab
4. Add/Edit these records:

   **For root domain (example.com):**
   - Type: **A Record**
   - Host: `@`
   - Value: `your-vps-ip-address`
   - TTL: Automatic (or 30 min)

   **For www subdomain (www.example.com):**
   - Type: **A Record**
   - Host: `www`
   - Value: `your-vps-ip-address`
   - TTL: Automatic (or 30 min)

5. **Save changes** (DNS propagation can take 5 minutes to 48 hours, usually ~30 minutes)

**Verify DNS propagation:**
```bash
# Check from your local machine
dig yourdomain.com
# or
nslookup yourdomain.com
```

---

## Step 4: Deploy Your Application

### Option A: Using SCP (Simple)
```bash
# From your local machine
cd /home/gregory/Documents/projects/planground/scroll-landing
scp -r dist/* your-username@your-vps-ip:/var/www/planground/
```

### Option B: Using Git (Recommended for updates)
```bash
# On VPS
cd /var/www/planground
git clone your-repo-url .
# or if you have a build script on VPS:
git pull && npm install && npm run build
# then copy dist/* to /var/www/planground/
```

### Option C: Using rsync (Best for updates)
```bash
# From your local machine
rsync -avz --delete dist/ your-username@your-vps-ip:/var/www/planground/
```

---

## Step 5: Configure Nginx

### 5.1 Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/planground
```

**Paste this configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/planground;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # Main location
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

**Save and exit** (Ctrl+X, then Y, then Enter)

### 5.2 Enable the Site
```bash
sudo ln -s /etc/nginx/sites-available/planground /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

### 5.3 Set Correct Permissions
```bash
sudo chown -R www-data:www-data /var/www/planground
sudo chmod -R 755 /var/www/planground
```

---

## Step 6: Set Up SSL Certificate (HTTPS)

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts:
- Enter your email
- Agree to terms
- Choose whether to redirect HTTP to HTTPS (recommended: Yes)

Certbot will automatically:
- Obtain SSL certificate
- Configure Nginx
- Set up auto-renewal

**Test auto-renewal:**
```bash
sudo certbot renew --dry-run
```

---

## Step 7: Configure Firewall

```bash
# Allow HTTP, HTTPS, and SSH
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
sudo ufw status
```

---

## Step 8: Verify Deployment

1. **Check Nginx status:**
   ```bash
   sudo systemctl status nginx
   ```

2. **Visit your domain:**
   - Open `https://yourdomain.com` in a browser
   - Check browser console for errors

3. **Test routes:**
   - `/blog`
   - `/team`
   - Ensure React Router works correctly

---

## Step 9: Set Up Auto-Deployment (Optional)

### Using GitHub Actions or GitLab CI/CD
Create a workflow that:
1. Builds the app
2. Deploys to VPS via SSH/rsync
3. Restarts Nginx if needed

### Manual Update Process
```bash
# On your local machine
npm run build
rsync -avz --delete dist/ your-username@your-vps-ip:/var/www/planground/
# On VPS (if needed)
sudo systemctl reload nginx
```

---

## Troubleshooting

### Nginx won't start
```bash
sudo nginx -t  # Check for syntax errors
sudo systemctl status nginx  # Check error logs
sudo tail -f /var/log/nginx/error.log
```

### 502 Bad Gateway
- Check file permissions: `sudo chown -R www-data:www-data /var/www/planground`
- Verify files exist: `ls -la /var/www/planground`

### DNS not resolving
- Wait longer (up to 48 hours)
- Check DNS records on Namecheap
- Use `dig` or `nslookup` to verify

### React Router 404 errors
- Ensure Nginx config has `try_files $uri $uri/ /index.html;`
- Check that `index.html` is in `/var/www/planground/`

### SSL certificate issues
```bash
sudo certbot certificates  # List certificates
sudo certbot renew  # Manually renew
```

---

## Security Checklist

- [ ] Firewall configured (UFW)
- [ ] SSH key-based authentication (disable password auth)
- [ ] Regular system updates enabled
- [ ] SSL certificate installed and auto-renewing
- [ ] Nginx configured with security headers (optional)
- [ ] File permissions set correctly

---

## Quick Reference Commands

```bash
# Build locally
npm run build

# Deploy to VPS
rsync -avz --delete dist/ user@vps-ip:/var/www/planground/

# Check Nginx
sudo nginx -t
sudo systemctl reload nginx

# View logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Renew SSL
sudo certbot renew
```

---

## Next Steps

1. Set up monitoring (optional): UptimeRobot, Pingdom
2. Configure backups for your VPS
3. Set up CI/CD pipeline for automatic deployments
4. Add analytics (Google Analytics, Plausible, etc.)

---

**Need help?** Check:
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)





