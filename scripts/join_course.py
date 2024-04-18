from backend.pigeonhole.apps.users.models import User


def run():
    user_1, _ = User.objects.get_or_create(
        email='rune.dyselinck@ugent.be'
    )

    print(user_1)
