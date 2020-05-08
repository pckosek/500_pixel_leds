# 500 Pixel Leds on a Telephone Pole

## There is now a Webserver on the raspberry pi

This server runs on the pu and allow you to individually access lights


---
### Highlights

#### Phase 2

- Solved Glitching Lights (periodically flashing white) by doing the following
	- Using coax for the data line from enclosure to pole
	- connecting coax shield (ground) to ground at PSU
	- connecting coax shield (ground) to ground at pole
	- incorporating a 3.3V to 5V bjt level shifter (with 2A 5V external source)
- There are lights on the Raspberry Pi

#### Phase 1

- Rpi 3b 1.2 running Ubuntu Server 18.04
- Enclosure working
- There are lights on the pole
- It turns on.