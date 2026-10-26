import json
import re

p = r"e:\projects\alo_wedding_card\target\Gourav And Rupkatha Wedding Invitation.html"
c = open(p, encoding="utf-8", errors="replace").read()
for m in re.finditer(
    r'\{"A":"(Y[A-Za-z0-9]+)","B":\d+,"C":"([^"]+)","D":(\[.*?\])(,"E")?\}', c
):
    key, name, d = m.group(1), m.group(2), m.group(3)
    styles = re.findall(r'"style":"([A-Z]+)","files":\[(.*?)\]', d)
    for st, files in styles:
        urls = re.findall(r'"url":"([^"]+)"', files)
        fmts = re.findall(r'"format":"?([A-Za-z0-9]+)"?', files)
        for u, f in zip(urls, fmts + ["?"] * (len(urls) - len(fmts))):
            print(f"{key} | {name} | {st} | {f} | {u}")
