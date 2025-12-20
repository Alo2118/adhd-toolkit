#!/usr/bin/env python3
"""
Script per creare icone per l'app "Come Stai? - Supporto ADHD"
"""
from PIL import Image, ImageDraw
import math

def create_icon(size):
    """Crea un'icona con design moderno per app ADHD"""
    # Colori dell'app
    bg_deep = (26, 26, 46)  # #1a1a2e
    accent_calm = (126, 184, 218)  # #7eb8da
    accent_soft = (195, 174, 214)  # #c3aed6
    accent_warm = (232, 168, 124)  # #e8a87c

    # Crea immagine con gradiente
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Sfondo con gradiente radiale dal centro
    for y in range(size):
        for x in range(size):
            # Distanza dal centro (0 al centro, 1 agli angoli)
            dx = (x - size/2) / (size/2)
            dy = (y - size/2) / (size/2)
            distance = math.sqrt(dx*dx + dy*dy)

            # Gradiente da blu a viola con sfondo scuro
            if distance < 1.0:
                # Interpolazione tra accent_calm e accent_soft
                t = distance * 0.7  # Riduce il range per mantenere colori più vibranti
                r = int(accent_calm[0] * (1-t) + accent_soft[0] * t)
                g = int(accent_calm[1] * (1-t) + accent_soft[1] * t)
                b = int(accent_calm[2] * (1-t) + accent_soft[2] * t)
            else:
                # Sfondo scuro agli angoli
                fade = min((distance - 1.0) * 2, 1.0)
                r = int(accent_soft[0] * (1-fade) + bg_deep[0] * fade)
                g = int(accent_soft[1] * (1-fade) + bg_deep[1] * fade)
                b = int(accent_soft[2] * (1-fade) + bg_deep[2] * fade)

            img.putpixel((x, y), (r, g, b, 255))

    # Crea overlay per il simbolo
    overlay = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw_overlay = ImageDraw.Draw(overlay)

    # Disegna un cuore stilizzato al centro
    center_x, center_y = size // 2, size // 2
    heart_size = size * 0.35

    # Cuore con forma semplificata usando cerchi e triangolo
    # Due cerchi in alto
    circle_radius = heart_size * 0.35
    left_circle_x = center_x - heart_size * 0.25
    right_circle_x = center_x + heart_size * 0.25
    circle_y = center_y - heart_size * 0.15

    # Colore bianco con leggera trasparenza
    heart_color = (255, 255, 255, 230)

    # Disegna i cerchi del cuore
    draw_overlay.ellipse(
        [left_circle_x - circle_radius, circle_y - circle_radius,
         left_circle_x + circle_radius, circle_y + circle_radius],
        fill=heart_color
    )
    draw_overlay.ellipse(
        [right_circle_x - circle_radius, circle_y - circle_radius,
         right_circle_x + circle_radius, circle_y + circle_radius],
        fill=heart_color
    )

    # Disegna la parte inferiore del cuore (triangolo)
    bottom_point = (center_x, center_y + heart_size * 0.5)
    left_point = (left_circle_x - circle_radius * 0.7, circle_y)
    right_point = (right_circle_x + circle_radius * 0.7, circle_y)

    draw_overlay.polygon(
        [left_point, right_point, bottom_point],
        fill=heart_color
    )

    # Rettangolo per collegare i cerchi al triangolo
    draw_overlay.rectangle(
        [left_circle_x - circle_radius * 0.7, circle_y - circle_radius * 0.3,
         right_circle_x + circle_radius * 0.7, circle_y + circle_radius],
        fill=heart_color
    )

    # Aggiungi piccoli cerchi decorativi attorno (rappresentano pensieri/supporto)
    dot_radius = size * 0.025
    num_dots = 8
    orbit_radius = heart_size * 1.3

    for i in range(num_dots):
        angle = (i / num_dots) * 2 * math.pi
        dot_x = center_x + orbit_radius * math.cos(angle)
        dot_y = center_y + orbit_radius * math.sin(angle)

        # Punti con opacità variabile
        opacity = int(150 + 105 * math.sin(angle))
        dot_color = (255, 255, 255, opacity)

        draw_overlay.ellipse(
            [dot_x - dot_radius, dot_y - dot_radius,
             dot_x + dot_radius, dot_y + dot_radius],
            fill=dot_color
        )

    # Combina il gradiente con l'overlay
    img = Image.alpha_composite(img, overlay)

    return img

# Crea entrambe le dimensioni
print("Creazione icon-192.png...")
icon_192 = create_icon(192)
icon_192.save('/home/user/adhd-toolkit/icon-192.png', 'PNG')

print("Creazione icon-512.png...")
icon_512 = create_icon(512)
icon_512.save('/home/user/adhd-toolkit/icon-512.png', 'PNG')

print("✓ Icone create con successo!")
