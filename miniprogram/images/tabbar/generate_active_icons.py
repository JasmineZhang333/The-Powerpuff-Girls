#!/usr/bin/env python3
from PIL import Image, ImageDraw

def create_card_active_icon(size=81):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    draw.rounded_rectangle([10, 16, 71, 65], radius=8, fill='#1a1a1a', outline='#f5a623', width=3)
    draw.ellipse([22, 30, 30, 38], fill='#f5a623')
    draw.ellipse([53, 27, 61, 35], fill='#f5a623')
    draw.ellipse([37, 45, 45, 53], fill='#f5a623')
    draw.ellipse([19, 47, 27, 55], fill='#f5a623')
    draw.rectangle([50, 48, 62, 58], fill='#f5a623')
    
    img.save('card-active.png')
    print('Created card-active.png')

def create_climb_active_icon(size=81):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    draw.line([8, 72, 40, 22, 72, 72], fill='#f5a623', width=4)
    draw.ellipse([33, 18, 47, 32], fill='#f5a623')
    draw.line([40, 32, 40, 48], fill='#f5a623', width=4)
    draw.line([30, 40, 40, 48, 50, 40], fill='#f5a623', width=4)
    draw.line([35, 36, 28, 26], fill='#f5a623', width=3)
    draw.line([45, 36, 52, 26], fill='#f5a623', width=3)
    draw.line([35, 48, 28, 58, 24, 68], fill='#f5a623', width=3)
    draw.line([45, 48, 52, 58, 56, 68], fill='#f5a623', width=3)
    draw.ellipse([18, 22, 28, 32], fill='#f5a623')
    draw.ellipse([52, 30, 62, 40], fill='#f5a623')
    draw.ellipse([28, 58, 38, 68], fill='#f5a623')
    
    img.save('climb-active.png')
    print('Created climb-active.png')

def create_profile_active_icon(size=81):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    draw.ellipse([29, 12, 51, 34], fill='#f5a623')
    draw.ellipse([29, 12, 51, 34], outline='#f5a623', width=2)
    draw.ellipse([18, 34, 62, 72], fill='#f5a623')
    draw.ellipse([11, 25, 23, 37], fill='#f5a623')
    draw.ellipse([57, 33, 69, 45], fill='#f5a623')
    draw.ellipse([19, 52, 29, 62], fill='#f5a623')
    draw.ellipse([51, 56, 61, 66], fill='#f5a623')
    
    img.save('profile-active.png')
    print('Created profile-active.png')

if __name__ == '__main__':
    create_card_active_icon()
    create_climb_active_icon()
    create_profile_active_icon()
    print('All active icons created!')
