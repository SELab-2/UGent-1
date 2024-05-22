# voor deze evaluatie voeren we een bash script uit
FROM bash:latest

# declareer de volumes waar straks de indieningsbestanden en output-artifacts komen
VOLUME /submission
VOLUME /artifacts

# hier kan je nog extra dependencies installeren

# kopieer alle nodige bestanden naar de image
COPY entrypoint.sh /entrypoint.sh
COPY expected-output /expected-output

# voer het evaluatie-script uit wanneer de container wordt gestart
ENTRYPOINT bash /entrypoint.sh