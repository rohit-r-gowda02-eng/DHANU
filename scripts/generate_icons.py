import os
from PIL import Image, ImageDraw

os.makedirs('public/icons', exist_ok=True)

def create_dhanu_icon(size):
    # Background: Obsidian Dark Forest Black #070B08
    img = Image.new('RGBA', (size, size), (7, 11, 8, 255))
    draw = ImageDraw.Draw(img)
    
    center = size / 2.0
    
    # Outer dark emerald green plate: #0D1510 with Gold outline
    plate_pad = size * 0.08
    draw.rounded_rectangle(
        [plate_pad, plate_pad, size - plate_pad, size - plate_pad],
        radius=int(size * 0.22),
        fill=(13, 21, 16, 255),
        outline=(212, 175, 55, 60), # Gold subtle border
        width=max(1, int(size * 0.015))
    )
    
    # Inner subtle target guide circle in Gold
    ring_radius = size * 0.35
    draw.ellipse(
        [center - ring_radius, center - ring_radius, center + ring_radius, center + ring_radius],
        outline=(212, 175, 55, 50),
        width=max(1, int(size * 0.012))
    )
    
    # Draw geometric Bow arc in Pure Gold (#D4AF37)
    arc_box = [size * 0.18, size * 0.18, size * 0.82, size * 0.82]
    draw.arc(arc_box, start=120, end=320, fill=(212, 175, 55, 255), width=max(2, int(size * 0.045)))
    
    # Bowstring in soft Champagne
    p_start = (int(size * 0.26), int(size * 0.72))
    p_end = (int(size * 0.74), int(size * 0.24))
    draw.line([p_start, p_end], fill=(243, 229, 171, 90), width=max(1, int(size * 0.015)))
    
    # Trajectory Arrow line in Emerald Green (#10B981)
    arrow_tail = (int(size * 0.32), int(size * 0.68))
    arrow_tip = (int(size * 0.78), int(size * 0.20))
    draw.line([arrow_tail, arrow_tip], fill=(16, 185, 129, 255), width=max(2, int(size * 0.04)))
    
    # Arrow tip triangle in Pure Gold (#D4AF37)
    tip_x, tip_y = arrow_tip
    arrow_poly = [
        (tip_x, tip_y),
        (int(tip_x - size * 0.14), int(tip_y + size * 0.02)),
        (int(tip_x - size * 0.02), int(tip_y + size * 0.14))
    ]
    draw.polygon(arrow_poly, fill=(212, 175, 55, 255))
    
    # Core focus point: Emerald Green + White
    core_x = int(size * 0.52)
    core_y = int(size * 0.46)
    r_core = int(size * 0.045)
    draw.ellipse([core_x - r_core, core_y - r_core, core_x + r_core, core_y + r_core], fill=(16, 185, 129, 255))
    r_inner = int(size * 0.02)
    draw.ellipse([core_x - r_inner, core_y - r_inner, core_x + r_inner, core_y + r_inner], fill=(255, 255, 255, 255))
    
    return img

icon_192 = create_dhanu_icon(192)
icon_192.save('public/icons/icon-192.png', 'PNG')

icon_512 = create_dhanu_icon(512)
icon_512.save('public/icons/icon-512.png', 'PNG')

icon_apple = create_dhanu_icon(180)
icon_apple.save('public/apple-touch-icon.png', 'PNG')

icon_64 = create_dhanu_icon(64)
icon_64.save('public/favicon.ico', format='ICO', sizes=[(64, 64)])
icon_64.save('public/favicon.png', 'PNG')

print("Regenerated Dhanu Dark Green + Gold + Black PWA icons successfully!")
