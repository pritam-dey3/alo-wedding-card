import re

p = r"e:\projects\alo_wedding_card\target\Gourav And Rupkatha Wedding Invitation.html"
c = open(p, encoding="utf-8", errors="replace").read()
seen = {}
for m in re.finditer(r'\{"A":"(Y[A-Za-z0-9]+)","B":\d+,"C":"([^"]+)"', c):
    seen[m.group(1)] = m.group(2)
for k, v in seen.items():
    print(k, "->", v)
