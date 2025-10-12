import math, ezdxf

PCD = 335.0        # Pitch Circle Diameter (mm)
BOLT_COUNT = 10
BOLT_DIAMETER = 26.0
CENTER_BORE = 281.0
ET_VALUES = [90, 100, 110, 120]  # offset guide circles (mm)

doc = ezdxf.new(dxfversion="R2010")
msp = doc.modelspace()

# centre bore
msp.add_circle((0, 0), CENTER_BORE/2, dxfattribs={"layer": "CENTER_BORE"})

# PCD circle
msp.add_circle((0, 0), PCD/2, dxfattribs={"layer": "PCD"})

# bolt holes
for i in range(BOLT_COUNT):
    angle = math.radians(i * 360 / BOLT_COUNT)
    x = (PCD / 2) * math.cos(angle)
    y = (PCD / 2) * math.sin(angle)
    msp.add_circle((x, y), BOLT_DIAMETER / 2, dxfattribs={"layer": "BOLT_HOLES"})

# offset reference circles
for et in ET_VALUES:
    msp.add_circle((0, 0), et, dxfattribs={"layer": f"OFFSET_ET{et}"})

# text annotations
msp.add_text("UNIMOG U1700L (MODEL 435) WHEEL HUB TEMPLATE",
             dxfattribs={"height": 12, "insert": (PCD/2 + 50, 0)})
msp.add_text("10×Ø26 on 335 mm PCD",
             dxfattribs={"height": 10, "insert": (PCD/2 + 50, -20)})
msp.add_text("Centre Bore Ø281 mm",
             dxfattribs={"height": 10, "insert": (PCD/2 + 50, -40)})
msp.add_text("Offset circles: ET90 / ET100 / ET110 / ET120",
             dxfattribs={"height": 10, "insert": (PCD/2 + 50, -60)})

doc.saveas("Unimog_U1700L_WheelHub_Template.dxf")
print("✅ DXF saved as Unimog_U1700L_WheelHub_Template.dxf")
