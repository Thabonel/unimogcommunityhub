import math, ezdxf
from ezdxf.enums import TextEntityAlignment

PCD = 335.0        # Pitch Circle Diameter (mm)
BOLT_COUNT = 10
BOLT_DIAMETER = 26.0
CENTER_BORE = 281.0
ET_VALUES = [90, 100, 110, 120]  # offset guide circles (mm)

doc = ezdxf.new(dxfversion="R2010")
msp = doc.modelspace()

# Create layers with colors
doc.layers.new("CENTER_BORE", dxfattribs={"color": 1})  # Red
doc.layers.new("PCD", dxfattribs={"color": 3})  # Green
doc.layers.new("BOLT_HOLES", dxfattribs={"color": 7})  # White
doc.layers.new("DIMENSIONS", dxfattribs={"color": 2})  # Yellow
doc.layers.new("CENTERLINES", dxfattribs={"color": 1})  # Red
doc.layers.new("ANNOTATIONS", dxfattribs={"color": 7})  # White

# Centre bore
msp.add_circle((0, 0), CENTER_BORE/2, dxfattribs={"layer": "CENTER_BORE"})

# PCD circle
msp.add_circle((0, 0), PCD/2, dxfattribs={"layer": "PCD"})

# Bolt holes with centerlines
for i in range(BOLT_COUNT):
    angle = math.radians(i * 360 / BOLT_COUNT)
    x = (PCD / 2) * math.cos(angle)
    y = (PCD / 2) * math.sin(angle)

    # Bolt hole
    msp.add_circle((x, y), BOLT_DIAMETER / 2, dxfattribs={"layer": "BOLT_HOLES"})

    # Centerline from origin to bolt center
    msp.add_line((0, 0), (x * 1.3, y * 1.3),
                 dxfattribs={"layer": "CENTERLINES", "linetype": "CENTER"})

# Main horizontal centerline
msp.add_line((-200, 0), (200, 0),
             dxfattribs={"layer": "CENTERLINES", "linetype": "CENTER"})

# Main vertical centerline
msp.add_line((0, -200), (0, 200),
             dxfattribs={"layer": "CENTERLINES", "linetype": "CENTER"})

# Offset reference circles
for et in ET_VALUES:
    msp.add_circle((0, 0), et, dxfattribs={"layer": f"OFFSET_ET{et}", "color": 5})

# Add dimension lines manually using lines and text
angle_between_bolts = 360 / BOLT_COUNT

# PCD dimension line (horizontal)
dim_y = -PCD/2 - 30
msp.add_line((-PCD/2, dim_y), (PCD/2, dim_y),
             dxfattribs={"layer": "DIMENSIONS"})
msp.add_line((-PCD/2, dim_y - 5), (-PCD/2, dim_y + 5),
             dxfattribs={"layer": "DIMENSIONS"})
msp.add_line((PCD/2, dim_y - 5), (PCD/2, dim_y + 5),
             dxfattribs={"layer": "DIMENSIONS"})
msp.add_text(f"Ø{PCD} PCD",
             dxfattribs={"height": 5, "insert": (0, dim_y - 12),
                        "layer": "DIMENSIONS"})

# Center bore dimension
bore_dim_y = CENTER_BORE/2 + 20
msp.add_line((-CENTER_BORE/2, bore_dim_y), (CENTER_BORE/2, bore_dim_y),
             dxfattribs={"layer": "DIMENSIONS"})
msp.add_line((-CENTER_BORE/2, bore_dim_y - 5), (-CENTER_BORE/2, bore_dim_y + 5),
             dxfattribs={"layer": "DIMENSIONS"})
msp.add_line((CENTER_BORE/2, bore_dim_y - 5), (CENTER_BORE/2, bore_dim_y + 5),
             dxfattribs={"layer": "DIMENSIONS"})
msp.add_text(f"Ø{CENTER_BORE} CENTER BORE",
             dxfattribs={"height": 5, "insert": (0, bore_dim_y + 8),
                        "layer": "DIMENSIONS"})

# Bolt hole dimension
first_bolt_x = PCD/2
first_bolt_y = 0
bolt_dim_x = first_bolt_x + BOLT_DIAMETER/2 + 15
msp.add_line((first_bolt_x - BOLT_DIAMETER/2, first_bolt_y),
             (bolt_dim_x, first_bolt_y),
             dxfattribs={"layer": "DIMENSIONS"})
msp.add_line((first_bolt_x + BOLT_DIAMETER/2, first_bolt_y),
             (bolt_dim_x, first_bolt_y),
             dxfattribs={"layer": "DIMENSIONS"})
msp.add_text(f"Ø{BOLT_DIAMETER}",
             dxfattribs={"height": 4, "insert": (bolt_dim_x + 5, first_bolt_y - 2),
                        "layer": "DIMENSIONS"})

# Angular dimension text
angle_text_radius = PCD/2 + 40
angle_text_angle = math.radians(angle_between_bolts / 2)
angle_text_x = angle_text_radius * math.cos(angle_text_angle)
angle_text_y = angle_text_radius * math.sin(angle_text_angle)
msp.add_text(f"{angle_between_bolts}°",
             dxfattribs={"height": 4, "insert": (angle_text_x, angle_text_y),
                        "layer": "DIMENSIONS"})

# Title block
title_x = PCD/2 + 80
msp.add_text(
    "UNIMOG U1700L (MODEL 435)",
    dxfattribs={
        "height": 8,
        "insert": (title_x, 80),
        "layer": "ANNOTATIONS",
        "style": "Standard"
    }
)

msp.add_text(
    "WHEEL HUB MOUNTING TEMPLATE",
    dxfattribs={
        "height": 6,
        "insert": (title_x, 70),
        "layer": "ANNOTATIONS"
    }
)

# Technical specifications
specs_y = 50
specs = [
    f"PCD: Ø{PCD} mm",
    f"Bolt Pattern: {BOLT_COUNT} × Ø{BOLT_DIAMETER} mm",
    f"Center Bore: Ø{CENTER_BORE} mm",
    f"Angular Spacing: {angle_between_bolts}°",
    f"Thread: M22 × 1.5 (Front)",
    f"Thread: M20 × 1.5 (Rear)",
    f"Torque: 400 Nm",
]

for i, spec in enumerate(specs):
    msp.add_text(
        spec,
        dxfattribs={
            "height": 4,
            "insert": (title_x, specs_y - (i * 6)),
            "layer": "ANNOTATIONS"
        }
    )

# Offset specifications
offset_y = specs_y - (len(specs) * 6) - 10
msp.add_text(
    "OFFSET REFERENCE CIRCLES:",
    dxfattribs={
        "height": 4,
        "insert": (title_x, offset_y),
        "layer": "ANNOTATIONS"
    }
)

for i, et in enumerate(ET_VALUES):
    msp.add_text(
        f"ET{et}: Ø{et*2} mm",
        dxfattribs={
            "height": 3.5,
            "insert": (title_x + 5, offset_y - ((i+1) * 5)),
            "layer": "ANNOTATIONS"
        }
    )

# Add notes
notes_y = offset_y - (len(ET_VALUES) * 5) - 15
notes = [
    "NOTES:",
    "1. All dimensions in millimeters",
    "2. Tolerances: ±0.1mm unless noted",
    "3. Bolt holes equally spaced",
    "4. Hub-centric fitment required",
]

for i, note in enumerate(notes):
    msp.add_text(
        note,
        dxfattribs={
            "height": 3,
            "insert": (title_x, notes_y - (i * 4)),
            "layer": "ANNOTATIONS"
        }
    )

# Save file
doc.saveas("Unimog_U1700L_WheelHub_Professional.dxf")
print("✅ Professional DXF saved with dimensions and annotations")
print(f"   - {BOLT_COUNT} bolt holes on Ø{PCD}mm PCD")
print(f"   - Ø{CENTER_BORE}mm center bore")
print(f"   - Complete dimensioning and technical notes")
