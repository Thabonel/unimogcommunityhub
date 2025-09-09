# Getting Transbase JDBC Driver from Windows VM

## In the Windows VM (QEMU window):

1. Open **File Explorer** 
2. Navigate to: `C:\Program Files\EWA\database\TransBase\jdbc\`
3. Look for `transbase.jar` or similar JDBC driver file
4. Copy it to `C:\export\` folder

## Alternative locations to check:
- `C:\Program Files\EWA\lib\`
- `C:\DB\TransBase\jdbc\`
- `C:\Program Files (x86)\TransBase\`

## To create a shared folder:
1. In Windows, create folder: `C:\export`
2. Right-click → Properties → Sharing → Share
3. Note the network path

## If you find the JAR file:
1. Copy it to a USB or shared location
2. Or upload to a file sharing service
3. Then add it to DbVisualizer's Driver Manager

The driver file is typically named:
- `transbase.jar`
- `transbase-jdbc.jar`  
- `tbjdbc.jar`
- Or similar

Once we have this driver, DbVisualizer can connect directly to the WIS database!