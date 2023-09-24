$name = "single_player_sleep"
$buildDir = "./build"
$stagingDir = "$buildDir/$name"
New-Item -ItemType Directory -Path "./" -Name $buildDir -Force
New-Item -ItemType Directory -Path $stagingDir -Force
Copy-Item -Recurse -Force -Path "./scripts" -Destination $stagingDir
Copy-Item -Path "./pack_icon.png" -Destination $stagingDir
Copy-Item -Path "./manifest.json" -Destination $stagingDir
Compress-Archive -Path $stagingDir -Destination "./$name.zip" -Force
Move-Item -Path "./$name.zip" -Destination "./$name.mcaddon" -Force