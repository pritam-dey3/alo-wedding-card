import re

p = r"e:\projects\alo_wedding_card\target\Gourav And Rupkatha Wedding Invitation.html"
c = open(p, encoding="utf-8", errors="replace").read()
links = re.findall(r'https://fonts\.[a-z]+\.com[^"\\]+', c)
print("google fonts links:", links[:8])
