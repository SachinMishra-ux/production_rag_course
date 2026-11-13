import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont

WIDTH, HEIGHT = 1280, 720

# Load macOS High-End Fonts
FONT_TITLE = ImageFont.truetype('/System/Library/Fonts/Avenir Next.ttc', 24, index=0)     # Bold
FONT_HEAD = ImageFont.truetype('/System/Library/Fonts/Avenir Next.ttc', 20, index=2)      # Demi Bold
FONT_SUB = ImageFont.truetype('/System/Library/Fonts/Avenir Next.ttc', 16, index=2)       # Demi Bold
FONT_BODY = ImageFont.truetype('/System/Library/Fonts/Avenir Next.ttc', 14, index=7)      # Regular
FONT_BODY_BOLD = ImageFont.truetype('/System/Library/Fonts/Avenir Next.ttc', 14, index=0) # Bold
FONT_MONO = ImageFont.truetype('/System/Library/Fonts/Menlo.ttc', 14, index=1)           # Bold
FONT_MONO_SM = ImageFont.truetype('/System/Library/Fonts/Menlo.ttc', 11, index=0)        # Regular
FONT_HUD = ImageFont.truetype('/System/Library/Fonts/Menlo.ttc', 11, index=1)            # Bold

# Load assets
base_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(base_dir, '..'))
img_dir = os.path.join(root_dir, 'assets/images')

bp_raw = Image.open(os.path.join(img_dir, 'mig29_blueprint.jpg')).convert('RGB')
bp_thumb = bp_raw.resize((410, 285), Image.Resampling.LANCZOS)

engine_raw = Image.open(os.path.join(img_dir, 'mig29_engine_block_diagram.jpg')).convert('RGB')
engine_thumb = engine_raw.resize((360, 440), Image.Resampling.LANCZOS)

engine_green = engine_thumb.copy()
draw_eg = ImageDraw.Draw(engine_green)
draw_eg.rectangle([135, 20, 185, 220], outline=(52, 211, 153), width=2)
draw_eg.rectangle([135, 6, 255, 20], fill=(12, 35, 28))
draw_eg.text((138, 7), 'ECU [99.8%]', fill=(52, 211, 153), font=FONT_MONO_SM)

draw_eg.rectangle([90, 240, 130, 330], outline=(56, 189, 248), width=2)
draw_eg.rectangle([40, 332, 175, 346], fill=(15, 30, 48))
draw_eg.text((45, 333), 'FAULT DETECT [99.5%]', fill=(56, 189, 248), font=FONT_MONO_SM)

photo_raw = Image.open(os.path.join(img_dir, 'sachin_photo.jpg')).convert('RGB')
pw, ph = photo_raw.size
crop_w = int(pw * 0.75)
crop_h = crop_w
crop_x = (pw - crop_w) // 2
crop_y = int(ph * 0.05)
photo_cropped = photo_raw.crop((crop_x, crop_y, crop_x + crop_w, crop_y + crop_h)).resize((200, 200), Image.Resampling.LANCZOS)

mask_circle = Image.new('L', (200, 200), 0)
draw_mask = ImageDraw.Draw(mask_circle)
draw_mask.ellipse((0, 0, 200, 200), fill=255)
photo_circle = Image.new('RGBA', (200, 200), (0, 0, 0, 0))
photo_circle.paste(photo_cropped, (0, 0))
photo_circle.putalpha(mask_circle)

print("Assets loaded successfully for test frames.")
