from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    class Meta(AbstractUser.Meta):
        db_table = "auth_user"

    def delete_account(self):
        self.first_name = ""
        self.last_name = ""
        self.email = ""
        self.is_active = False
        self.save()

    @property
    def name(self):
        return f"{self.first_name.strip()} {self.last_name.strip()}"