import subprocess

result = subprocess.run('ffmpeg -i D:/Spleeter/Notify/backend/_output/1695509470119/vocals.wav -vn -ar 44100 -ac 2 -b:a 192k D:/Spleeter/Notify/backend/_output/1695509470119/vocals.mp3', shell=True)

print(result.stdout.decode())