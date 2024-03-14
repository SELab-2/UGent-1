# from unittest import TestCase
#
# from rest_framework import status
# from rest_framework.test import APIClient
#
# from backend.pigeonhole.apps.courses.models import Course
# from backend.pigeonhole.apps.groups.models import Group
# from backend.pigeonhole.apps.projects.models import Project
# from backend.pigeonhole.apps.users.models import User
#
#
# class GroupTestAdminTeacher(TestCase):
#
#     def setUp(self):
#         self.client = APIClient()
#
#         # self.admin = User.objects.create(
#         #     username="admin_username",
#         #     email="test@gmail.com",
#         #     first_name="Test1",
#         #     last_name="Test2",
#         #     role=1
#         # )
#
#         self.course = Course.objects.create(
#             name="Test Course",
#             description="Test Course Description",
#         )
#
#         self.project = Project.objects.create(
#             name="Test Project",
#             course_id=self.course
#         )
#
#         self.group = Group.objects.create(
#             name="Test Group",
#             project_id=self.project
#         )
#
#         self.admin.course.set([self.course])
#
#         self.client.force_authenticate(self.admin)
#
#     def test_admin_create_group(self):
#         response = self.client.post(
#             f'/courses/{self.course.course_id}/projects/{self.project.project_id}/groups/',
#             {
#                 "name": "Test Group 2",
#                 "description": "Test Group 2 Description",
#                 "project_id": self.project.project_id,
#                 "number_of_groups": 4,
#             },
#             format='json'
#         )
#         self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
#
#     def test_admin_retrieve_group(self):
#         response = self.client.get(
#             f'/courses/{self.course.course_id}/projects/{self.project.project_id}/groups/{self.group.group_id}/',
#         )
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(response.data.get('name'), self.group.name)
#
#     def test_admin_list_groups(self):
#         response = self.client.get(
#             f'/courses/{self.course.course_id}/projects/{self.project.project_id}/groups/',
#         )
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(len(response.data), 1)
#
#     def test_admin_update_group(self):
#         response = self.client.put(
#             f'/courses/{self.course.course_id}/projects/{self.project.project_id}/groups/{self.group.group_id}/',
#             {
#                 "name": "Test Group 3",
#                 "description": "Test Group 2 Description",
#                 "project_id": self.project.project_id,
#                 "number_of_groups": 4,
#             },
#             format='json'
#         )
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#
#     def test_admin_delete_group(self):
#         response = self.client.delete(
#             f'/courses/{self.course.course_id}/projects/{self.project.project_id}/groups/{self.group.group_id}/',
#         )
#         self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
#         self.assertEqual(Group.objects.count(), 0)
