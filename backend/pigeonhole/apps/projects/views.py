from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from models import Project


class ProjectAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, subject_id, project_id):
        # TODO still figuring out how to implement views properly.
        if request.user.teacher:
            # TODO should be able to get every project as an admin, not as a teacher. (check the is_admin field)
            # This happens when the user is a teacher or admin.
            project = Project.objects.get(project_id=project_id)
            return JsonResponse({"id": project.project_id,
                                 "name": project.name,
                                 "deadline": project.deadline,
                                 "description": project.description}, status=200)
        elif request.user.student:
            # When the user is a student.
            student = request.user.student
            if student.projects.filter(project_id=project_id).exists():
                project = Project.objects.get(project_id=project_id)

                return JsonResponse({"id": project.project_id,
                                     "name": project.name,
                                     "deadline": project.deadline,
                                     "description": project.description}, status=200)
            else:
                return JsonResponse({"message": "Project not found"}, status=404)
        else:
            # User isn't recognized.
            return JsonResponse({"message": "User role not recognized"}, status=403)

    def put(self, request, subject_id, project_id):
        if request.user.teacher:
            # update project data, such as name, description, ...
            project = Project.objects.get(project_id=project_id)
        elif request.user.student:
            student = request.user.student
            project = Project.objects.get(project_id=project_id)


