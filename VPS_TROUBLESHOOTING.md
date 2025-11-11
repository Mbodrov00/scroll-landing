# VPS SSH Connection Troubleshooting

## Error: "Connection refused" on New VPS

This error means the SSH service isn't accessible yet. Here's how to fix it:

---

## Step 1: Wait for VPS Initialization

**Most common cause:** The VPS is still provisioning.

- **Wait 5-15 minutes** after receiving the confirmation email
- VPS providers need time to:
  - Install the operating system
  - Configure network settings
  - Start SSH service
  - Complete initial setup

**Check your Atlantic VPS dashboard:**
- Look for status indicators (e.g., "Active", "Running", "Ready")
- Some providers show "Initializing" or "Setting up" status

---

## Step 2: Verify SSH Credentials

### Check Your Atlantic VPS Email/Control Panel

Atlantic VPS typically provides:
1. **Root password** (in confirmation email or control panel)
2. **SSH key** (if you selected key-based auth)
3. **Username** (might be `root`, `ubuntu`, `debian`, or custom)

**Common usernames by OS:**
- Ubuntu: `ubuntu` or `root`
- Debian: `root` or `debian`
- CentOS: `root` or `centos`

**Try different username formats:**
```bash
ssh root@103.47.226.104
ssh ubuntu@103.47.226.104
ssh admin@103.47.226.104
```

---

## Step 3: Check SSH Port

Some VPS providers use non-standard SSH ports for security.

**Try common alternative ports:**
```bash
ssh -p 2222 root@103.47.226.104
ssh -p 2200 root@103.47.226.104
ssh -p 22022 root@103.47.226.104
```

**Check your Atlantic VPS control panel** for the SSH port number.

---

## Step 4: Check Atlantic VPS Control Panel

1. **Log into Atlantic VPS dashboard**
2. **Find your VPS instance**
3. **Check:**
   - Status (should be "Running" or "Active")
   - Network settings
   - Firewall rules
   - SSH access settings
   - Console/terminal access (some providers have web-based console)

---

## Step 5: Use Atlantic VPS Web Console

Many VPS providers offer a **web-based console/terminal**:

1. Log into Atlantic VPS dashboard
2. Find your VPS instance
3. Look for "Console", "Terminal", "VNC", or "KVM" access
4. Use this to:
   - Verify SSH service is running
   - Check network configuration
   - Manually start SSH if needed

**Once in console, check SSH status:**
```bash
sudo systemctl status ssh
# or
sudo systemctl status sshd
```

**If SSH is not running, start it:**
```bash
sudo systemctl start ssh
sudo systemctl enable ssh
```

---

## Step 6: Check Firewall Rules

### On Atlantic VPS Control Panel:
1. Go to your VPS → **Firewall** or **Security Groups**
2. Ensure **port 22 (SSH)** is **allowed** for:
   - Your IP address, OR
   - All IPs (0.0.0.0/0) - less secure but works for testing

### If you have console access, check firewall:
```bash
# Ubuntu/Debian
sudo ufw status
sudo ufw allow 22/tcp

# CentOS/RHEL
sudo firewall-cmd --list-all
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload
```

---

## Step 7: Verify IP Address

**Double-check the IP address:**
- Confirm `103.47.226.104` is correct from your Atlantic dashboard
- Try pinging it:
  ```bash
  ping 103.47.226.104
  ```
- If ping fails, the VPS might not be fully provisioned yet

---

## Step 8: Check Network Connectivity

**Test if the server is reachable:**
```bash
# Check if port 22 is open
telnet 103.47.226.104 22
# or
nc -zv 103.47.226.104 22
```

**If connection times out:**
- VPS is still initializing, OR
- Firewall is blocking, OR
- Network issue

---

## Step 9: Contact Atlantic VPS Support

If after 15-30 minutes you still can't connect:

1. **Check Atlantic VPS support documentation**
2. **Contact support** with:
   - Your VPS IP: `103.47.226.104`
   - Error message: "Connection refused on port 22"
   - Time since VPS creation
   - Screenshot of VPS status in dashboard

---

## Step 10: Alternative - Use Password Instead of Key

If you're trying to use SSH keys, try password authentication:

```bash
ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no root@103.47.226.104
```

**You'll be prompted for the root password** (check your email/control panel).

---

## Quick Diagnostic Commands

**From your local machine:**
```bash
# 1. Ping test
ping -c 4 103.47.226.104

# 2. Port check
nc -zv 103.47.226.104 22

# 3. Verbose SSH (shows more details)
ssh -v root@103.47.226.104

# 4. Try with password prompt
ssh -o PreferredAuthentications=password root@103.47.226.104
```

**What to look for:**
- `-v` flag shows detailed connection attempts
- Look for where it fails (DNS, connection, authentication)

---

## Most Likely Solutions (in order):

1. ✅ **Wait 10-15 minutes** - VPS still initializing (90% of cases)
2. ✅ **Check Atlantic dashboard** - Use web console to verify SSH
3. ✅ **Verify credentials** - Check email for correct username/password
4. ✅ **Check firewall** - Ensure port 22 is open in Atlantic control panel
5. ✅ **Try different username** - `ubuntu`, `root`, `admin`, etc.

---

## Once Connected Successfully:

After you can SSH in, immediately:

```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Secure SSH (optional but recommended)
sudo nano /etc/ssh/sshd_config
# Change: PermitRootLogin no (if using non-root user)
# Change: PasswordAuthentication no (if using keys)
sudo systemctl restart ssh

# 3. Set up firewall
sudo ufw allow OpenSSH
sudo ufw enable
```

---

**Need more help?** Check Atlantic VPS documentation or contact their support with your VPS details.





