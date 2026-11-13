import os
import sys
import subprocess
from PIL import Image, ImageDraw, ImageFont

# -------------------------------------------------------------
# Configuration
# -------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.abspath(os.path.join(BASE_DIR, '..'))

def resolve_path(rel_root_path, rel_asset_path):
    p1 = os.path.join(ROOT_DIR, rel_root_path)
    if os.path.exists(p1): return p1
    p2 = os.path.join(ROOT_DIR, 'assets', rel_asset_path)
    if os.path.exists(p2): return p2
    return p1

WIDTH, HEIGHT = 1280, 720
FPS = 30
DURATION = 93.5
TOTAL_FRAMES = int(FPS * DURATION)
AUDIO_FILE = resolve_path('master_promo_audio.wav', 'audio/master_promo_audio.wav')
OUTPUT_VIDEO = os.path.join(ROOT_DIR, 'assets/video/production_rag_promo.mp4')

# -------------------------------------------------------------
# Clean Modern Typography (Avenir Next & Menlo)
# -------------------------------------------------------------
FONT_TITLE_HERO = ImageFont.truetype('/System/Library/Fonts/Avenir Next.ttc', 24, index=0) # Bold
FONT_TITLE_MD   = ImageFont.truetype('/System/Library/Fonts/Avenir Next.ttc', 20, index=0) # Bold
FONT_CARD_HEAD  = ImageFont.truetype('/System/Library/Fonts/Avenir Next.ttc', 16, index=2) # Demi Bold
FONT_BODY_BOLD  = ImageFont.truetype('/System/Library/Fonts/Avenir Next.ttc', 13, index=0) # Bold
FONT_BODY_REG   = ImageFont.truetype('/System/Library/Fonts/Avenir Next.ttc', 13, index=7) # Regular
FONT_BODY_SM    = ImageFont.truetype('/System/Library/Fonts/Avenir Next.ttc', 12, index=7) # Regular

FONT_MONO_LG    = ImageFont.truetype('/System/Library/Fonts/Menlo.ttc', 15, index=1)       # Bold
FONT_MONO_MD    = ImageFont.truetype('/System/Library/Fonts/Menlo.ttc', 12, index=1)       # Bold
FONT_MONO_SM    = ImageFont.truetype('/System/Library/Fonts/Menlo.ttc', 11, index=0)       # Regular

# -------------------------------------------------------------
# Asset Preloading
# -------------------------------------------------------------
# 1. MiG-29 Blueprint Schematic
bp_path = resolve_path('mig29_blueprint.jpg', 'images/mig29_blueprint.jpg')
bp_raw = Image.open(bp_path).convert('RGB')
bp_thumb = bp_raw.resize((480, 330), Image.Resampling.LANCZOS)

# 2. Figure 1-1A Engine Control Block Diagram
engine_path = resolve_path('mig29_engine_block_diagram.jpg', 'images/mig29_engine_block_diagram.jpg')
engine_raw = Image.open(engine_path).convert('RGB')
engine_thumb = engine_raw.resize((400, 480), Image.Resampling.LANCZOS)

# Grounded Version with ColPali Bounding Boxes
engine_grounded = engine_thumb.copy()
draw_eg = ImageDraw.Draw(engine_grounded)
# ECU bounding box
draw_eg.rectangle([150, 25, 205, 240], outline=(13, 148, 136), width=3)
draw_eg.rectangle([150, 8, 280, 26], fill=(13, 148, 136))
draw_eg.text((154, 9), 'ECU UNIT [99.8%]', fill=(255, 255, 255), font=FONT_MONO_SM)
# Fault detect bounding box
draw_eg.rectangle([100, 260, 145, 360], outline=(2, 132, 199), width=3)
draw_eg.rectangle([50, 360, 210, 378], fill=(2, 132, 199))
draw_eg.text((54, 362), 'FAULT DETECT [99.5%]', fill=(255, 255, 255), font=FONT_MONO_SM)

# 3. Sachin Mishra Portrait
photo_path = resolve_path('sachin_photo.jpg', 'images/sachin_photo.jpg')
photo_raw = Image.open(photo_path).convert('RGB')
pw, ph = photo_raw.size
crop_w = int(pw * 0.75)
crop_h = crop_w
crop_x = (pw - crop_w) // 2
crop_y = int(ph * 0.05)
photo_cropped = photo_raw.crop((crop_x, crop_y, crop_x + crop_w, crop_y + crop_h)).resize((210, 210), Image.Resampling.LANCZOS)

mask_circle = Image.new('L', (210, 210), 0)
draw_mask = ImageDraw.Draw(mask_circle)
draw_mask.ellipse((0, 0, 210, 210), fill=255)
photo_circle = Image.new('RGBA', (210, 210), (0, 0, 0, 0))
photo_circle.paste(photo_cropped, (0, 0))
photo_circle.putalpha(mask_circle)

print("Preloaded all diagram assets and instructor photo.")

# -------------------------------------------------------------
# Clean Header & Clean Footer (Plain, No Cyberpunk / Robotic Telemetry)
# -------------------------------------------------------------
def draw_clean_header(draw, title_category, slide_number_str):
    # Top Bar (Clean, Minimalist, Dark Slate)
    draw.rectangle([0, 0, WIDTH, 54], fill=(15, 23, 42)) # Slate 900
    draw.line([(0, 54), (WIDTH, 54)], fill=(30, 41, 59), width=1)
    
    # Left: Course Title
    draw.rectangle([32, 14, 42, 40], fill=(13, 148, 136)) # Teal accent
    draw.text((52, 17), "PRODUCTION RAG MASTERCLASS", font=FONT_CARD_HEAD, fill=(255, 255, 255))
    draw.text((360, 20), "•   3-4 WEEK LIVE COHORT", font=FONT_MONO_SM, fill=(148, 163, 184))
    
    # Right: Category & Slide
    draw.text((WIDTH - 380, 20), title_category, font=FONT_MONO_SM, fill=(45, 212, 191))
    draw.text((WIDTH - 90, 18), slide_number_str, font=FONT_MONO_MD, fill=(255, 255, 255))

def draw_clean_footer(draw, progress):
    # Minimalist Bottom Progress Line (Clean line at the very bottom, no text/telemetry)
    draw.rectangle([0, HEIGHT - 4, WIDTH, HEIGHT], fill=(15, 23, 42))
    fill_w = int(WIDTH * min(1.0, max(0.0, progress)))
    if fill_w > 0:
        draw.rectangle([0, HEIGHT - 4, fill_w, HEIGHT], fill=(13, 148, 136))

# -------------------------------------------------------------
# FFMPEG Pipeline Setup
# -------------------------------------------------------------
cmd = [
    'ffmpeg', '-y',
    '-f', 'rawvideo',
    '-vcodec', 'rawvideo',
    '-s', f'{WIDTH}x{HEIGHT}',
    '-pix_fmt', 'rgb24',
    '-r', str(FPS),
    '-i', '-',
    '-i', AUDIO_FILE,
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '18',
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-shortest',
    OUTPUT_VIDEO
]

print("Rendering plain, professional 93.5s video...")
proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)

# -------------------------------------------------------------
# Frame Generation Loop
# -------------------------------------------------------------
for frame_idx in range(TOTAL_FRAMES):
    t = frame_idx / FPS
    progress = t / DURATION
    
    # Clean, professional deep slate background (#0f172a)
    img = Image.new('RGB', (WIDTH, HEIGHT), (15, 23, 42))
    draw = ImageDraw.Draw(img)
    
    # -------------------------------------------------------------
    # SCENE 1: (0.0s - 18.0s) - Why Toy RAG Fails on Real Documents
    # -------------------------------------------------------------
    if t < 18.0:
        draw_clean_header(draw, "PROBLEM 01 // SCANNED MANUALS", "01 / 05")
        draw_clean_footer(draw, progress)
        
        # Slide Title & Subtitle
        draw.text((60, 78), "Why 95% of Toy RAG Fails in Production", font=FONT_TITLE_HERO, fill=(255, 255, 255))
        draw.text((60, 112), "Standard tutorials assume clean text. Real enterprise manuals are complex scanned blueprints.", font=FONT_BODY_REG, fill=(148, 163, 184))
        
        # Left Panel: MiG-29 Blueprint Schematic
        bx, by, bw, bh = 60, 150, 520, 480
        draw.rectangle([bx, by, bx + bw, by + bh], fill=(30, 41, 59), outline=(51, 65, 85), width=1)
        draw.rectangle([bx, by, bx + bw, by + 40], fill=(51, 65, 85))
        draw.text((bx + 16, by + 12), "DOCUMENT: MiG-29 FLIGHT MANUAL (PAGE 7)", font=FONT_MONO_SM, fill=(255, 255, 255))
        
        # Paste Blueprint Image
        img.paste(bp_thumb, (bx + 20, by + 55))
        draw.text((bx + 20, by + 400), "Wing Area: 38 m2   •   Sweep: 42 deg   •   Rudder: 1.45 m2", font=FONT_MONO_SM, fill=(203, 213, 225))
        draw.text((bx + 20, by + 430), "Contains critical dimensions and engineering specs embedded in vectors.", font=FONT_BODY_SM, fill=(148, 163, 184))
        
        # Right Panel: Standard Text Extractor Failure
        rx, ry, rw, rh = 620, 150, 600, 480
        draw.rectangle([rx, ry, rx + rw, ry + rh], fill=(30, 41, 59), outline=(51, 65, 85), width=1)
        draw.rectangle([rx, ry, rx + rw, ry + 40], fill=(51, 65, 85))
        draw.text((rx + 16, by + 12), "STANDARD INGESTION PIPELINE (PyPDF / TextSplitter)", font=FONT_MONO_SM, fill=(255, 255, 255))
        
        # Code Box
        cx, cy, cw, ch = rx + 20, ry + 60, rw - 40, 120
        draw.rectangle([cx, cy, cx + cw, cy + ch], fill=(15, 23, 42), outline=(51, 65, 85), width=1)
        draw.text((cx + 16, cy + 16), ">>> from pypdf import PdfReader", font=FONT_MONO_SM, fill=(148, 163, 184))
        draw.text((cx + 16, cy + 40), ">>> reader = PdfReader('mig29_flight_manual.pdf')", font=FONT_MONO_SM, fill=(148, 163, 184))
        draw.text((cx + 16, cy + 64), ">>> text = reader.pages[6].extract_text()", font=FONT_MONO_SM, fill=(148, 163, 184))
        draw.text((cx + 16, cy + 88), ">>> print(len(text))  # Returns: 0 Characters Extracted", font=FONT_MONO_SM, fill=(248, 113, 113))
        
        # Failure Diagnostic Box
        fx, fy, fw, fh = rx + 20, ry + 200, rw - 40, 120
        draw.rectangle([fx, fy, fx + fw, fy + fh], fill=(69, 10, 10), outline=(239, 68, 68), width=1)
        draw.text((fx + 16, fy + 16), "EXTRACTION FAILURE: ZERO CHARACTERS", font=FONT_CARD_HEAD, fill=(254, 202, 202))
        draw.text((fx + 16, fy + 48), "• Standard text chunkers drop image pixels and coordinate geometries completely.", font=FONT_BODY_REG, fill=(254, 226, 226))
        draw.text((fx + 16, fy + 72), "• Produces empty embeddings or catastrophic LLM hallucinations.", font=FONT_BODY_REG, fill=(254, 226, 226))
        
        # Solution Preview Box
        sx, sy, sw, sh = rx + 20, ry + 340, rw - 40, 110
        draw.rectangle([sx, sy, sx + sw, sy + sh], fill=(6, 78, 59), outline=(16, 185, 129), width=1)
        draw.text((sx + 16, sy + 16), "THE PRODUCTION FIX: MULTIMODAL VISION EMBEDDINGS", font=FONT_CARD_HEAD, fill=(167, 243, 208))
        draw.text((sx + 16, sy + 48), "• ColPali embeds whole document pages directly into multi-vector tokens.", font=FONT_BODY_REG, fill=(209, 250, 229))
        draw.text((sx + 16, sy + 72), "• Preserves tables, diagrams, and exact technical measurements.", font=FONT_BODY_REG, fill=(209, 250, 229))

    # -------------------------------------------------------------
    # SCENE 2: (18.0s - 38.0s) - Complex Engineering Diagrams
    # -------------------------------------------------------------
    elif t < 38.0:
        draw_clean_header(draw, "PROBLEM 02 // MULTI-TIER SCHEMATICS", "02 / 05")
        draw_clean_footer(draw, progress)
        
        draw.text((60, 78), "Complex Schematics Scramble Naive Chunkers", font=FONT_TITLE_HERO, fill=(255, 255, 255))
        draw.text((60, 112), "Figure 1-1A: Multi-tier avionics signal flows, control pumps, and feedback loops.", font=FONT_BODY_REG, fill=(148, 163, 184))
        
        # Left: Engine Control Block Diagram
        lx, ly, lw, lh = 60, 150, 440, 520
        draw.rectangle([lx, ly, lx + lw, ly + lh], fill=(30, 41, 59), outline=(51, 65, 85), width=1)
        draw.rectangle([lx, ly, lx + lw, ly + 36], fill=(51, 65, 85))
        draw.text((lx + 16, ly + 10), "FIGURE 1-1A: ENGINE CONTROL ARCHITECTURE", font=FONT_MONO_SM, fill=(255, 255, 255))
        img.paste(engine_thumb, (lx + 20, ly + 40))
        
        # Right: Engineering Analysis Cards
        rx, ry, rw = 530, 150, 690
        
        # Card 1: Multi-Directional Signal Routing
        c1y = ry
        draw.rectangle([rx, c1y, rx + rw, c1y + 155], fill=(30, 41, 59), outline=(51, 65, 85), width=1)
        draw.rectangle([rx, c1y, rx + 6, c1y + 155], fill=(234, 179, 8)) # Amber accent
        draw.text((rx + 24, c1y + 18), "1. Multi-Directional Signal Routing", font=FONT_CARD_HEAD, fill=(255, 255, 255))
        draw.text((rx + 24, c1y + 52), "• Sensor inputs (NL, NH, CIT, EGT, CIP, CDP) route into Engine Control Unit (ECU).", font=FONT_BODY_REG, fill=(203, 213, 225))
        draw.text((rx + 24, c1y + 80), "• Output triggers Fuel Flow Divider, Afterburner Ignition, and Nozzle Control Pumps.", font=FONT_BODY_REG, fill=(203, 213, 225))
        draw.text((rx + 24, c1y + 108), "• Fault Detection Unit simultaneously logs telemetry into Relais Box and FDR recorder.", font=FONT_BODY_REG, fill=(203, 213, 225))
        
        # Card 2: Why Naive Chunking Breaks
        c2y = c1y + 175
        draw.rectangle([rx, c2y, rx + rw, c2y + 155], fill=(30, 41, 59), outline=(51, 65, 85), width=1)
        draw.rectangle([rx, c2y, rx + 6, c2y + 155], fill=(239, 68, 68)) # Red accent
        draw.text((rx + 24, c2y + 18), "2. Spatial Connections Cannot Be Split by Characters", font=FONT_CARD_HEAD, fill=(255, 255, 255))
        draw.text((rx + 24, c2y + 52), "• Splitting text into 500-token chunks cuts arrows, signal paths, and control logic.", font=FONT_BODY_REG, fill=(203, 213, 225))
        draw.text((rx + 24, c2y + 80), "• LLM cannot answer: 'Which sensor inputs route directly to the Relais Box?'", font=FONT_BODY_REG, fill=(203, 213, 225))
        draw.text((rx + 24, c2y + 108), "• Result: High-risk engineering errors and disconnected information chunks.", font=FONT_BODY_REG, fill=(248, 113, 113))

        # Card 3: Scale & Concurrency Bottleneck
        c3y = c2y + 175
        draw.rectangle([rx, c3y, rx + rw, c3y + 155], fill=(30, 41, 59), outline=(51, 65, 85), width=1)
        draw.rectangle([rx, c3y, rx + 6, c3y + 155], fill=(59, 130, 246)) # Blue accent
        draw.text((rx + 24, c3y + 18), "3. High-Concurrency & Bulk Document Uploads Choke", font=FONT_CARD_HEAD, fill=(255, 255, 255))
        draw.text((rx + 24, c3y + 52), "• Ingesting 100-200+ heavy technical manuals synchronously blocks server event loops.", font=FONT_BODY_REG, fill=(203, 213, 225))
        draw.text((rx + 24, c3y + 80), "• Memory spikes trigger out-of-memory container crashes under multi-user traffic.", font=FONT_BODY_REG, fill=(203, 213, 225))
        draw.text((rx + 24, c3y + 108), "• Production demands distributed Celery worker queues and Redis semantic caches.", font=FONT_BODY_REG, fill=(147, 197, 253))

    # -------------------------------------------------------------
    # SCENE 3: (38.0s - 60.5s) - The Production Solution
    # -------------------------------------------------------------
    elif t < 60.5:
        draw_clean_header(draw, "SOLUTION // PRODUCTION ARCHITECTURE", "03 / 05")
        draw_clean_footer(draw, progress)
        
        draw.text((60, 78), "The Production Solution: Multimodal Vision RAG", font=FONT_TITLE_HERO, fill=(255, 255, 255))
        draw.text((60, 112), "Direct document vision embeddings with high-throughput asynchronous scaling.", font=FONT_BODY_REG, fill=(148, 163, 184))
        
        # Left: Grounded Engine Diagram with ColPali Bounding Boxes
        lx, ly, lw, lh = 60, 150, 440, 520
        draw.rectangle([lx, ly, lx + lw, ly + lh], fill=(30, 41, 59), outline=(51, 65, 85), width=1)
        draw.rectangle([lx, ly, lx + lw, ly + 36], fill=(51, 65, 85))
        draw.text((lx + 16, ly + 10), "COLPALI VISION GROUNDING [VERIFIED 99.8%]", font=FONT_MONO_SM, fill=(45, 212, 191))
        img.paste(engine_grounded, (lx + 20, ly + 40))
        
        # Right: 3 Core Production Pillars
        rx, ry, rw = 530, 150, 690
        
        # Pillar 1
        p1y = ry
        draw.rectangle([rx, p1y, rx + rw, p1y + 155], fill=(30, 41, 59), outline=(51, 65, 85), width=1)
        draw.rectangle([rx, p1y, rx + 6, p1y + 155], fill=(13, 148, 136)) # Teal
        draw.text((rx + 24, p1y + 18), "1. ColPali Vision Indexing", font=FONT_CARD_HEAD, fill=(255, 255, 255))
        draw.text((rx + 24, p1y + 52), "• Indexes raw high-resolution document pages directly without lossy OCR.", font=FONT_BODY_REG, fill=(203, 213, 225))
        draw.text((rx + 24, p1y + 80), "• Generates multi-vector patch embeddings that capture text, layout, and lines.", font=FONT_BODY_REG, fill=(203, 213, 225))
        draw.text((rx + 24, p1y + 108), "• Pinpoints exact bounding box coordinates of engineering components.", font=FONT_BODY_REG, fill=(45, 212, 191))
        
        # Pillar 2
        p2y = p1y + 175
        draw.rectangle([rx, p2y, rx + rw, p2y + 155], fill=(30, 41, 59), outline=(51, 65, 85), width=1)
        draw.rectangle([rx, p2y, rx + 6, p2y + 155], fill=(59, 130, 246)) # Blue
        draw.text((rx + 24, p2y + 18), "2. Hybrid Search & Cross-Encoder Reranking", font=FONT_CARD_HEAD, fill=(255, 255, 255))
        draw.text((rx + 24, p2y + 52), "• Combines dense vector semantic similarity with sparse BM25 exact part-number search.", font=FONT_BODY_REG, fill=(203, 213, 225))
        draw.text((rx + 24, p2y + 80), "• Reciprocal Rank Fusion (RRF) merges candidate document pools.", font=FONT_BODY_REG, fill=(203, 213, 225))
        draw.text((rx + 24, p2y + 108), "• Cross-encoder re-ranks the top 5 chunks with zero contextual loss.", font=FONT_BODY_REG, fill=(147, 197, 253))

        # Pillar 3
        p3y = p2y + 175
        draw.rectangle([rx, p3y, rx + rw, p3y + 155], fill=(30, 41, 59), outline=(51, 65, 85), width=1)
        draw.rectangle([rx, p3y, rx + 6, p3y + 155], fill=(16, 185, 129)) # Emerald
        draw.text((rx + 24, p3y + 18), "3. Scalable Async Architecture (<200ms P95)", font=FONT_CARD_HEAD, fill=(255, 255, 255))
        draw.text((rx + 24, p3y + 52), "• Asynchronous FastAPI endpoints stream responses to thousands of concurrent users.", font=FONT_BODY_REG, fill=(203, 213, 225))
        draw.text((rx + 24, p3y + 80), "• Background ingestion decoupled via Celery worker pools and Redis queues.", font=FONT_BODY_REG, fill=(203, 213, 225))
        draw.text((rx + 24, p3y + 108), "• Complete Docker Compose & Cloud Deployment ready for AWS, GCP, and Kubernetes.", font=FONT_BODY_REG, fill=(110, 231, 183))

    # -------------------------------------------------------------
    # SCENE 4: (60.5s - 78.5s) - Career & Monetization Pathways
    # -------------------------------------------------------------
    elif t < 78.5:
        draw_clean_header(draw, "CAREER & ROI // MONETIZATION ROADMAP", "04 / 05")
        draw_clean_footer(draw, progress)
        
        draw.text((60, 78), "Career & Monetization Pathways", font=FONT_TITLE_HERO, fill=(255, 255, 255))
        draw.text((60, 112), "Turn production RAG engineering into job switches, promotions, and freelance retainers.", font=FONT_BODY_REG, fill=(148, 163, 184))
        
        # 3 Clean Vertical Cards for the 3 Pathways
        col_w = 360
        gap = 40
        start_x = 60
        top_y = 160
        card_h = 490
        
        # Column 1: Senior AI Engineer Jobs
        c1x = start_x
        draw.rectangle([c1x, top_y, c1x + col_w, top_y + card_h], fill=(30, 41, 59), outline=(51, 65, 85), width=1)
        draw.rectangle([c1x, top_y, c1x + col_w, top_y + 8], fill=(13, 148, 136)) # Teal header
        
        draw.text((c1x + 24, top_y + 30), "CAREER SWITCH", font=FONT_MONO_SM, fill=(45, 212, 191))
        draw.text((c1x + 24, top_y + 55), "Senior AI Engineer", font=FONT_TITLE_MD, fill=(255, 255, 255))
        draw.text((c1x + 24, top_y + 90), "20 - 30 LPA", font=FONT_TITLE_HERO, fill=(255, 255, 255))
        draw.text((c1x + 24, top_y + 125), "Realistic Indian Tech Compensation", font=FONT_MONO_SM, fill=(148, 163, 184))
        draw.line([(c1x + 24, top_y + 155), (c1x + col_w - 24, top_y + 155)], fill=(51, 65, 85), width=1)
        
        draw.text((c1x + 24, top_y + 175), "• System design interview playbook", font=FONT_BODY_REG, fill=(203, 213, 225))
        draw.text((c1x + 24, top_y + 215), "• Explain vector sharding & HNSW", font=FONT_BODY_REG, fill=(203, 213, 225))
        draw.text((c1x + 24, top_y + 255), "• Defend latency vs accuracy trade-offs", font=FONT_BODY_REG, fill=(203, 213, 225))
        draw.text((c1x + 24, top_y + 295), "• Production portfolio with MiG-29 manual", font=FONT_BODY_REG, fill=(203, 213, 225))
        draw.text((c1x + 24, top_y + 335), "• 1:1 resume & interview preparation", font=FONT_BODY_REG, fill=(203, 213, 225))
        
        # Column 2: Freelancing & Consulting
        c2x = c1x + col_w + gap
        draw.rectangle([c2x, top_y, c2x + col_w, top_y + card_h], fill=(30, 41, 59), outline=(51, 65, 85), width=1)
        draw.rectangle([c2x, top_y, c2x + col_w, top_y + 8], fill=(16, 185, 129)) # Emerald header
        
        draw.text((c2x + 24, top_y + 30), "FREELANCE & CONSULTING", font=FONT_MONO_SM, fill=(110, 231, 183))
        draw.text((c2x + 24, top_y + 55), "Client Retainers", font=FONT_TITLE_MD, fill=(255, 255, 255))
        draw.text((c2x + 24, top_y + 90), "Rs. 15k - 50k", font=FONT_TITLE_HERO, fill=(255, 255, 255))
        draw.text((c2x + 24, top_y + 125), "Per Project / Up to 1 Lakh Experienced", font=FONT_MONO_SM, fill=(148, 163, 184))
        draw.line([(c2x + 24, top_y + 155), (c2x + col_w - 24, top_y + 155)], fill=(51, 65, 85), width=1)
        
        draw.text((c2x + 24, top_y + 175), "• Client acquisition & discovery pitch", font=FONT_BODY_REG, fill=(203, 213, 225))
        draw.text((c2x + 24, top_y + 215), "• Battle-tested Statement of Work (SOW)", font=FONT_BODY_REG, fill=(203, 213, 225))
        draw.text((c2x + 24, top_y + 255), "• Fixed-bid & monthly retainer contracts", font=FONT_BODY_REG, fill=(203, 213, 225))
        draw.text((c2x + 24, top_y + 295), "• Enterprise client demo templates", font=FONT_BODY_REG, fill=(203, 213, 225))
        draw.text((c2x + 24, top_y + 335), "• Direct client pitch coaching", font=FONT_BODY_REG, fill=(203, 213, 225))

        # Column 3: In-Company Promotions
        c3x = c2x + col_w + gap
        draw.rectangle([c3x, top_y, c3x + col_w, top_y + card_h], fill=(30, 41, 59), outline=(51, 65, 85), width=1)
        draw.rectangle([c3x, top_y, c3x + col_w, top_y + 8], fill=(59, 130, 246)) # Blue header
        
        draw.text((c3x + 24, top_y + 30), "IN-COMPANY ADVANCEMENT", font=FONT_MONO_SM, fill=(147, 197, 253))
        draw.text((c3x + 24, top_y + 55), "Internal Promotions", font=FONT_TITLE_MD, fill=(255, 255, 255))
        draw.text((c3x + 24, top_y + 90), "Lead AI Architect", font=FONT_TITLE_HERO, fill=(255, 255, 255))
        draw.text((c3x + 24, top_y + 125), "High-Impact Engineering Leadership", font=FONT_MONO_SM, fill=(148, 163, 184))
        draw.line([(c3x + 24, top_y + 155), (c3x + col_w - 24, top_y + 155)], fill=(51, 65, 85), width=1)
        
        draw.text((c3x + 24, top_y + 175), "• Deploy internal RAG for enterprise docs", font=FONT_BODY_REG, fill=(203, 213, 225))
        draw.text((c3x + 24, top_y + 215), "• Slash hallucination rates under 0.2%", font=FONT_BODY_REG, fill=(203, 213, 225))
        draw.text((c3x + 24, top_y + 255), "• Present architecture to CTO / leadership", font=FONT_BODY_REG, fill=(203, 213, 225))
        draw.text((c3x + 24, top_y + 295), "• Lead GenAI initiatives across teams", font=FONT_BODY_REG, fill=(203, 213, 225))
        draw.text((c3x + 24, top_y + 335), "• Secure promotion and significant hike", font=FONT_BODY_REG, fill=(203, 213, 225))

    # -------------------------------------------------------------
    # SCENE 5: (78.5s - 93.5s) - Live Cohort Details & Enrollment
    # -------------------------------------------------------------
    else:
        draw_clean_header(draw, "ENROLLMENT // COHORT DETAILS", "05 / 05")
        draw_clean_footer(draw, progress)
        
        draw.text((60, 78), "Join the Live Production RAG Cohort", font=FONT_TITLE_HERO, fill=(255, 255, 255))
        draw.text((60, 112), "3-4 weeks intensive hands-on cohort. Build, scale, and deploy real systems.", font=FONT_BODY_REG, fill=(148, 163, 184))
        
        # Left Panel: Mentor Card
        mx, my, mw, mh = 60, 150, 440, 520
        draw.rectangle([mx, my, mx + mw, my + mh], fill=(30, 41, 59), outline=(51, 65, 85), width=1)
        draw.rectangle([mx, my, mx + mw, my + 8], fill=(13, 148, 136))
        
        # Paste Instructor Photo
        img.paste(photo_circle, (mx + 115, my + 40), photo_circle)
        
        draw.text((mx + 130, my + 270), "Sachin Mishra", font=FONT_TITLE_MD, fill=(255, 255, 255))
        draw.text((mx + 85, my + 305), "Senior Generative AI Engineer", font=FONT_BODY_BOLD, fill=(45, 212, 191))
        draw.text((mx + 75, my + 330), "6+ Years Enterprise AI/ML Experience", font=FONT_BODY_REG, fill=(203, 213, 225))
        draw.text((mx + 80, my + 355), "Built & Scaled Production GenAI Systems", font=FONT_BODY_REG, fill=(148, 163, 184))
        draw.text((mx + 110, my + 380), "Mentor to 500+ Engineers", font=FONT_MONO_SM, fill=(148, 163, 184))
        
        draw.line([(mx + 40, my + 420), (mx + mw - 40, my + 420)], fill=(51, 65, 85), width=1)
        draw.text((mx + 70, my + 445), "Live Weekend Interactive Coding Sessions", font=FONT_MONO_SM, fill=(255, 255, 255))
        draw.text((mx + 95, my + 475), "Direct 1:1 Architecture Reviews", font=FONT_MONO_SM, fill=(45, 212, 191))

        # Right Panel: Cohort Details & Offer
        rx, ry, rw, rh = 540, 150, 680, 520
        draw.rectangle([rx, ry, rx + rw, ry + rh], fill=(30, 41, 59), outline=(51, 65, 85), width=1)
        draw.rectangle([rx, ry, rx + rw, ry + 8], fill=(16, 185, 129))
        
        draw.text((rx + 36, ry + 35), "COHORT 1 INCLUSIONS:", font=FONT_CARD_HEAD, fill=(255, 255, 255))
        
        inclusions = [
            "• 4 Weeks of Live Weekend Interactive Coding Sessions",
            "• Complete Production Codebase: ColPali + FastAPI + Redis + Docker",
            "• Scanned 77-Page MiG-29 Manual & Heavy Document Datasets",
            "• Scalable Async API & Celery Distributed Ingestion Architecture",
            "• Freelance Consulting Proposals & Senior AI (20-30 LPA) Interview Kit",
            "• Private VIP Discord Community for Direct Code Reviews",
            "• Lifetime Access to All Recordings, Slides & Repositories"
        ]
        
        for idx, inc in enumerate(inclusions):
            draw.text((rx + 36, ry + 75 + idx * 34), inc, font=FONT_BODY_REG, fill=(203, 213, 225))
            
        # Pricing Banner Box
        px, py, pw, ph = rx + 36, ry + 330, rw - 72, 150
        draw.rectangle([px, py, px + pw, py + ph], fill=(15, 23, 42), outline=(13, 148, 136), width=2)
        
        draw.text((px + 24, py + 18), "Early Bird Tuition: Rs. 8,999 (INR)", font=FONT_TITLE_MD, fill=(255, 255, 255))
        draw.text((px + 24, py + 52), "Use Promo Code: EARLYBIRD10 for Extra 10% Off -> Rs. 8,099", font=FONT_MONO_SM, fill=(45, 212, 191))
        draw.text((px + 24, py + 80), "(International: $99 USD via Stripe / Card)", font=FONT_BODY_SM, fill=(148, 163, 184))
        draw.text((px + 24, py + 112), "RESERVE SEAT: productionrag.dev   •   Strictly Limited to 35 Engineers", font=FONT_MONO_SM, fill=(255, 255, 255))

    # Write raw frame to ffmpeg stdin
    proc.stdin.write(img.tobytes())

proc.stdin.close()
proc.wait()
print(f"Video render complete: {OUTPUT_VIDEO}")
