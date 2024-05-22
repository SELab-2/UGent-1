# voer de indiening uit en sla de output op in een bestand
bash /submission/main.sh > output.txt

# vergelijk de output met de verwachte output
diff output.txt /expected-output/output.txt

# De exit code van de entrypoint is de exit code van de laatst uitgevoerde opdracht
# Dit bepaalt ook het slagen van de evaluatie
exit $?