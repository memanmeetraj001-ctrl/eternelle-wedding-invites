import os, sys, base64, json

def write_b64(relpath, b64_str):
    os.makedirs(os.path.dirname(relpath), exist_ok=True)
    raw = base64.b64decode(b64_str.encode('utf-8')).decode('utf-8')
    with open(relpath, 'w', encoding='utf-8') as f:
        f.write(raw)
    print('Wrote:', relpath)

if __name__ == '__main__':
    manifest = json.loads(open(sys.argv[1], 'r', encoding='utf-8').read())
    for p, b in manifest.items():
        write_b64(p, b)