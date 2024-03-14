import os

from django.contrib.sites.models import Site


def run():
    debug = int(os.environ.get("DEBUG", default=0))
    domain = 'localhost:8000' if debug else 'sel2-1.ugent.be'
    Site.objects.filter(pk=1).delete()
    Site.objects.create(pk=1, domain=domain, name='localhost')
