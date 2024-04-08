from django.core.files.uploadedfile import SimpleUploadedFile

from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.groups.models import Group
from backend.pigeonhole.apps.projects.models import Project
from backend.pigeonhole.apps.submissions.models import Submissions
from backend.pigeonhole.apps.users.models import User

lorem_ipsum = (
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore "
    "magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo "
    "consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. "
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
)


def run():
    # Create courses

    course_1, _ = Course.objects.get_or_create(
        name='Artificiële intelligentie',
        description='Kennisgebaseerd redeneren, machinaal leren, heuristische zoekstrategieën, '
                    'neurale netwerken en deep learning, natuurlijke taalverwerking'
    )

    course_2, _ = Course.objects.get_or_create(
        name='Algoritmen en datastructuren 3',
        description='Algoritme, datastructuur, efficiëntie'
    )

    course_3, _ = Course.objects.get_or_create(
        name='Besturingssystemen',
        description='procesbeheer, geheugenbeheer, systeembeheer, beveiliging'
    )

    course_4, _ = Course.objects.get_or_create(
        name='Logisch programmeren',
        description='Programmeertalen, logisch programmeren, unificatie, backtracking, metavertolkers, Prolog'
    )

    course_5, _ = Course.objects.get_or_create(
        name='Software Engineering Lab 2',
        description='Projectwerk, vakoverschrijdend, groepswerk, software-ontwikkelingspraktijk'
    )

    course_6, _ = Course.objects.get_or_create(
        name='Computationele biologie',
        description='Rekenmethoden, moleculaire biologie, genoomstructuur, genpredictie, sequenties aligneren, '
                    'fylogenie, vergelijkend genoomonderzoek, analyse van genexpressie'
    )

    course_7, _ = Course.objects.get_or_create(
        name='Automaten, berekenbaarheid en complexiteit',
        description='Eindige automaten, formele talen, stapelautomaten, Turingmachines, berekenbaarheid, complexiteit'
    )

    course_8, _ = Course.objects.get_or_create(
        name='Parallelle computersystemen',
        description='Computerarchitectuur, parallellisme op instructieniveau, parallellisme op dataniveau, '
                    'parallellisme op draadniveau, superscalaire uitvoering, speculatieve uitvoering, '
                    'computersystemen met gedeeld geheugen, cachecoherentie, geheugenconsistentie, '
                    'multi-core processors, meerdradige uitvoering, datacenters, supercomputers, '
                    'fundamentele concepten betreffende prestatie, impact van technologie op computerarchitectuur, '
                    'vermogen/energie, betrouwbaarheid'
    )

    course_9, _ = Course.objects.get_or_create(
        name='Informatiebeveiliging',
        description='beveiliging, encryptie'
    )

    course_10, _ = Course.objects.get_or_create(
        name='Modelleren en simuleren',
        description='Gewone en partiële differentiaalvergelijkingen, Fourier-analyse, '
                    'toevalsgetallen, meervoudige integralen'
    )

    course_11, _ = Course.objects.get_or_create(
        name='Inleiding tot de telecommunicatie',
        description='Telecommunicatie, signalen, datacommunicatie, broncodering, kanaalcodering.'
    )

    course_12, _ = Course.objects.get_or_create(
        name='Inleiding tot de elektrotechniek',
        description='Analoge en digitale elektronica, elektrische netwerken, netwerkanalyse, circuitsynthese, '
                    'signaalvoorstelling, stelling van Shannon-Nyquist, elektrische interconnecties, '
                    'computerarchitectuur, klokfrequentie, vermogenverbruik, schaalbaarheid.'
    )

    course_13, _ = Course.objects.get_or_create(
        name='Wiskundige modellering in de ingenieurswetenschappen',
        description='Wiskundige basisconcepten, wiskundige modellen voor ingenieurstoepassingen, '
                    'differentiaalvergelijkingen, integraaltransformaties, vectorcalculus'
    )

    course_14, _ = Course.objects.get_or_create(
        name='Krachtige leeromgevingen',
        description='Didactiek, visies op leren en onderwijzen, onderwijskundig referentiekader, werkvormen, '
                    'toetsing en evaluatie, individuele verschillen'
    )

    course_15, _ = Course.objects.get_or_create(
        name='Vakdidactiek wetenschappen',
        description='Krachtige leeromgeving, didactiek voor wetenschapsonderwijs, onderzoekend leren, STEM, '
                    'computationeel denken, ethiek, misconcepten'
    )

    course_16, _ = Course.objects.get_or_create(
        name='Oriëntatiestage wetenschappen',
        description='Eindtermen, leerplannen, lesvoorbereiding, microteaching, stage, reflectie.'
    )

    course_17, _ = Course.objects.get_or_create(
        name='Vakkennis wiskunde',
        description='Vlakke Analytische Meetkunde; Ruimtemeetkunde; Driehoeksmeting; Matrices, '
                    'Determinanten en Stelsels; combinatoriek, kansrekening'
    )

    # Create users

    user_1, _ = User.objects.get_or_create(
        username='alexandervanoyen',
        email='alexander.vanoyen@sel2-1.ugent.be',
        first_name='Alexander',
        last_name='Van Oyen',
        role=3
    )
    user_1.course.set(
        [course_1, course_2, course_3, course_4, course_5, course_6, course_7, course_8, course_9, course_10]
    )

    user_2, _ = User.objects.get_or_create(
        username='axellorreyne',
        email='axel.lorreyne@sel2-1.ugent.be',
        first_name='Axel',
        last_name='Lorreyne',
        role=3
    )
    user_2.course.set(
        [course_1, course_2, course_3, course_4, course_5, course_6, course_7, course_8, course_9, course_10]
    )

    user_3, _ = User.objects.get_or_create(
        username='gillesarnout',
        email='gilles.arnout@sel2-1.ugent.be',
        first_name='Gilles',
        last_name='Arnout',
        role=3
    )
    user_3.course.set(
        [course_1, course_2, course_3, course_4, course_5, course_6, course_7, course_8, course_9, course_10]
    )

    user_4, _ = User.objects.get_or_create(
        username='pieterjandesmijter',
        email='pieter-jan.desmijter@sel2-1.ugent.be',
        first_name='Pieter-Jan',
        last_name='De Smijter',
        role=3
    )
    user_4.course.set(
        [course_1, course_2, course_3, course_4, course_5, course_6, course_7, course_11, course_12, course_13]
    )

    user_5, _ = User.objects.get_or_create(
        username='reinharddepaepe',
        email='reinhard.depaepe@sel2-1.ugent.be',
        first_name='Reinhard',
        last_name='De Paepe',
        role=3
    )
    user_5.course.set(
        [course_1, course_2, course_3, course_4, course_5, course_6, course_7, course_11, course_12, course_13]
    )

    user_6, _ = User.objects.get_or_create(
        username='robinparet',
        email='robin.paret@sel2-1.ugent.be',
        first_name='Robin',
        last_name='Paret',
        role=3
    )
    user_6.course.set(
        [course_1, course_2, course_3, course_4, course_5, course_6, course_7, course_11, course_12, course_13]
    )

    user_7, _ = User.objects.get_or_create(
        username='runedyselinck',
        email='rune.dyselinck@sel2-1.ugent.be',
        first_name='Rune',
        last_name='Dyselinck',
        role=3
    )
    user_7.course.set(
        [course_1, course_2, course_3, course_4, course_5, course_6, course_7, course_14, course_15, course_16,
         course_17]
    )

    user_8, _ = User.objects.get_or_create(
        username='thibaudcollyn',
        email='thibaud.collyn@sel2-1.ugent.be',
        first_name='Thibaud',
        last_name='Collyn',
        role=3
    )
    user_8.course.set(
        [course_1, course_2, course_3, course_4, course_5, course_6, course_7, course_14, course_15, course_16,
         course_17]
    )

    # Create projects

    project_1, _ = Project.objects.get_or_create(
        name='SELab 2 project',
        course_id=course_5,
        deadline='2021-12-12 12:12:14',
        visible=True,
        number_of_groups=1,
        group_size=8
    )

    project_2, _ = Project.objects.get_or_create(
        name='AI project',
        course_id=course_1,
        deadline='2021-12-12 12:12:14',
        visible=True,
        number_of_groups=4,
        group_size=2
    )

    # Create groups

    group_1, _ = Group.objects.get_or_create(
        group_nr=1,
        final_score=20,
        project_id=project_1,
        feedback=lorem_ipsum,
        visible=True
    )
    group_1.user.set(
        [user_1, user_2, user_3, user_4, user_5, user_6, user_7, user_8]
    )

    group_2, _ = Group.objects.get_or_create(
        group_nr=1,
        final_score=17,
        project_id=project_2,
        feedback=lorem_ipsum,
        visible=True
    )
    group_2.user.set(
        [user_1, user_2]
    )

    group_3, _ = Group.objects.get_or_create(
        group_nr=2,
        final_score=11,
        project_id=project_2,
        feedback=lorem_ipsum,
        visible=True
    )
    group_3.user.set(
        [user_3, user_4]
    )

    group_4, _ = Group.objects.get_or_create(
        group_nr=3,
        final_score=14,
        project_id=project_2,
        feedback=lorem_ipsum,
        visible=True
    )
    group_4.user.set(
        [user_5, user_6]
    )

    group_5, _ = Group.objects.get_or_create(
        group_nr=4,
        final_score=8,
        project_id=project_2,
        feedback=lorem_ipsum,
        visible=True
    )
    group_5.user.set(
        [user_7, user_8]
    )

    # Create submissions

    lorem_ipsum_file = SimpleUploadedFile(
        'lorem_ipsum.txt',
        lorem_ipsum.encode('utf-8'),
        content_type="text/plain"
    )

    Submissions.objects.get_or_create(
        group_id=group_1,
        submission_nr=1,
        file=lorem_ipsum_file,
        timestamp='2021-12-12 12:12:12'
    )

    Submissions.objects.get_or_create(
        group_id=group_1,
        submission_nr=2,
        file=lorem_ipsum_file,
        timestamp='2021-12-12 12:12:13'
    )

    Submissions.objects.get_or_create(
        group_id=group_1,
        submission_nr=3,
        file=lorem_ipsum_file,
        timestamp='2021-12-12 12:12:15'
    )

    Submissions.objects.get_or_create(
        group_id=group_1,
        submission_nr=4,
        file=lorem_ipsum_file,
        timestamp='2021-12-12 12:12:16'
    )

    Submissions.objects.get_or_create(
        group_id=group_2,
        submission_nr=1,
        file=lorem_ipsum_file,
        timestamp='2021-12-12 12:12:12'
    )

    Submissions.objects.get_or_create(
        group_id=group_3,
        submission_nr=1,
        file=lorem_ipsum_file,
        timestamp='2021-12-12 12:12:13'
    )

    Submissions.objects.get_or_create(
        group_id=group_4,
        submission_nr=1,
        file=lorem_ipsum_file,
        timestamp='2021-12-12 12:12:15'
    )

    Submissions.objects.get_or_create(
        group_id=group_5,
        submission_nr=1,
        file=lorem_ipsum_file,
        timestamp='2021-12-12 12:12:16'
    )
