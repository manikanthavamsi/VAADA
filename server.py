import os, re, sys, http.server, socketserver

PORT = 8080

class RangeHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def send_head(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()
        try:
            f = open(path, 'rb')
        except OSError:
            self.send_error(404, 'File not found')
            return None
        range_header = self.headers.get('Range')
        if not range_header:
            return super().send_head()
        size = os.path.getsize(path)
        m = re.match(r'bytes=(\d+)-(\d*)', range_header)
        if not m:
            self.send_error(400, 'Bad range header')
            f.close()
            return None
        start = int(m.group(1))
        end = int(m.group(2)) if m.group(2) else size - 1
        if start >= size or end >= size:
            self.send_error(416, 'Requested Range Not Satisfiable')
            self.send_header('Content-Range', f'bytes */{size}')
            self.end_headers()
            f.close()
            return None
        length = end - start + 1
        self.send_response(206)
        self.send_header('Content-Type', self.guess_type(path))
        self.send_header('Content-Length', str(length))
        self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
        self.send_header('Accept-Ranges', 'bytes')
        self.end_headers()
        f.seek(start)
        return f

class ThreadedHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True

if __name__ == '__main__':
    httpd = ThreadedHTTPServer(('0.0.0.0', PORT), RangeHTTPRequestHandler)
    print(f'Range-supporting server running on http://localhost:{PORT}')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        httpd.server_close()
