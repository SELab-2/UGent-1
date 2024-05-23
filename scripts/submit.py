from rest_framework.test import APIClient

from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.groups.models import Group
from backend.pigeonhole.apps.projects.models import Project
from backend.pigeonhole.apps.users.models import User

from django.conf import settings

base_dir = settings.BASE_DIR

lorem_ipsum = (
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore "
    "magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo "
    "consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. "
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
)


def run():
    course, _ = Course.objects.get_or_create(
        name='Python Course',
        description='We learn python today !',
        open_course=True
    )

    user, _ = User.objects.get_or_create(
        username='mrpython',
        email='python@python.org',
        first_name='Python',
        last_name='McPython',
        role=3
    )
    user.course.set(
        [course]
    )
    user.save()

    project, _ = Project.objects.get_or_create(
        name='Fibonacci',
        description='Generate the first n Fibonacci numbers using Python.',
        course_id=course,
        deadline='2030-12-12 12:12:14',
        file_structure='*.py',
        test_docker_image='fibonacci-python',
        visible=True,
        number_of_groups=1,
        group_size=2
    )

    group, _ = Group.objects.get_or_create(
        group_nr=1,
        final_score=20,
        project_id=project,
        feedback=lorem_ipsum,
        visible=True
    )
    group.user.set(
        [user]
    )

    client = APIClient()
    client.force_authenticate(user)

    response = client.post(
        "/submissions/",
        {
            "group_id": group.group_id,
            "file_urls": "main.py",
            "main.py": open(f'{base_dir}/../scripts/fibonacci_correct/main.py', 'rb')
        },
        format='multipart',
    )

    print(response.status_code)
    print(response.data)

    response = client.post(
        "/submissions/",
        {
            "group_id": group.group_id,
            "file_urls": "main.py",
            "main.py": open(f'{base_dir}/../scripts/fibonacci_incorrect/main.py', 'rb')
        },
        format='multipart',
    )

    print(response.status_code)
    print(response.data)
