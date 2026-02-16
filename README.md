# Duck Kong - Mobile PWA

## 🎮 About
Duck Kong is now a Progressive Web App! Play on any mobile device, install to your home screen, and play offline.

## 📱 Features
- **Touch Controls**: Optimized virtual buttons for mobile play
- **Installable**: Add to home screen like a native app
- **Offline Play**: Works without internet after first load
- **Responsive**: Adapts to any screen size and orientation
- **All Original Features**: 6 playable ducks, 5 levels, boss battle, storyline

## 🚀 Quick Start

### Option 1: Play Online (Easiest)
1. Open `index.html` in a web browser
2. On mobile: Use "Add to Home Screen" option
3. Launch from your home screen like a native app!

### Option 2: Host on GitHub Pages (Free)
1. Create a GitHub repository
2. Upload all files from this folder
3. Enable GitHub Pages in repository settings
4. Share the URL: `https://yourusername.github.io/duck-kong`

### Option 3: Deploy to Netlify/Vercel (Free)
1. Sign up at netlify.com or vercel.com
2. Drag and drop this folder
3. Get instant HTTPS URL
4. Share with anyone!

## 📂 Files
- `index.html` - Main game page (mobile optimized)
- `game.js` - Complete game logic with touch controls
- `manifest.json` - PWA configuration
- `sw.js` - Service worker for offline play
- `icon-192.png` & `icon-512.png` - App icons (need to create)
- `README.md` - This file

## 🎨 Creating App Icons

You need to create two app icon files:

### icon-192.png (192x192 pixels)
- Use any image editor (Canva, Photoshop, GIMP)
- Create 192x192 pixel square image
- Draw a duck emoji or game logo
- Save as PNG

### icon-512.png (512x512 pixels)  
- Same as above but 512x512 pixels
- Higher resolution for better quality

**Quick Tip**: You can use emoji as placeholders:
1. Screenshot a large duck emoji 🦆
2. Resize to 192x192 and 512x512
3. Save as PNG files

## 🎮 Mobile Controls

**Touch Buttons:**
- **←** Left Button - Move left
- **→** Right Button - Move right  
- **JUMP** - Jump (tap twice for double-jump with Mandarin Ming)
- **⚡** - Special ability (varies by duck)
- **⏸** - Pause button (top-right) - Access restart and duck change

**Works on:**
- iOS Safari
- Android Chrome
- Any modern mobile browser

## 🌐 How to Install as PWA

### iOS (Safari):
1. Open the game URL in Safari
2. Tap the Share button
3. Scroll and tap "Add to Home Screen"
4. Tap "Add"
5. Duck Kong appears on your home screen!

### Android (Chrome):
1. Open the game URL in Chrome
2. Tap the menu (three dots)
3. Tap "Add to Home Screen" or "Install App"
4. Tap "Install"
5. Duck Kong appears in your app drawer!

## 🔧 Advanced Deployment

### Using a Web Server
Any static file server works:
```bash
# Python
python3 -m http.server 8000

# Node.js
npx serve

# PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

### HTTPS Requirement
For full PWA features (especially on iOS), you need HTTPS:
- GitHub Pages: Automatic HTTPS ✅
- Netlify/Vercel: Automatic HTTPS ✅
- Local testing: Use `localhost` (treated as secure)

## 🎯 Next Steps

1. **Create Icons**: Make your 192x192 and 512x512 PNG icons
2. **Test Locally**: Open index.html in browser
3. **Deploy Online**: Choose GitHub Pages, Netlify, or Vercel
4. **Install on Phone**: Use "Add to Home Screen"
5. **Share**: Send the URL to friends!

## 📝 Customization

Want to customize?
- Edit colors in `index.html` styles
- Modify game logic in `game.js`
- Update app name/description in `manifest.json`
- Change theme color in `manifest.json`

## 🐛 Troubleshooting

**Game doesn't load?**
- Check all files are in the same folder
- Make sure JavaScript is enabled
- Try different browser

**Can't install on phone?**
- Must be served over HTTPS (or localhost)
- Some browsers don't support PWA
- Try Chrome or Safari

**Touch controls not working?**
- Make sure you're not in desktop mode
- Refresh the page
- Check browser console for errors

## 🎉 You're Done!

Your Duck Kong mobile game is ready to play!

Defeat Gustav, save Feather Farm, become a legend! 🦆🏆
