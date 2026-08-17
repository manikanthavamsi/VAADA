import os, io, json, urllib.request, zipfile, sys
print('Starting deployment...', flush=True)
zip_buf = io.BytesIO()
with zipfile.ZipFile(zip_buf, 'w', zipfile.ZIP_DEFLATED) as zf:
    for f in os.listdir('.'):
        if f.endswith(('.html', '.css', '.js', '.jpg', '.png', '.jpeg', '.svg', '.m4a', '.mp3')):
            zf.write(f)
data = zip_buf.getvalue()
print('Zip size:', len(data), flush=True)
req = urllib.request.Request('https://api.netlify.com/api/v1/sites', data=data, headers={'Content-Type': 'application/zip', 'User-Agent': 'Mozilla/5.0'}, method='POST')
try:
    with urllib.request.urlopen(req, timeout=60) as res:
        out = json.loads(res.read().decode())
        url = out.get('ssl_url') or out.get('url')
        print('PERMANENT_NETLIFY_URL:', url, flush=True)
        with open('deployed_url.txt', 'w') as f:
            f.write(url)
except Exception as e:
    print('Deploy error:', e, flush=True)
