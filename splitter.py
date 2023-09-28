import sys;
import subprocess

result = subprocess.run('conda activate tensorflow && spleeter separate --codec mp3 --bitrate 320k -p spleeter:'+sys.argv[1]+'stems -o '+sys.argv[2]+" "+sys.argv[3], shell = True, capture_output=True)
print(result.stdout.decode())
sys.stdout.flush()