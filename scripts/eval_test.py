from docker import DockerClient


def run():
    client = DockerClient(base_url='unix://var/run/docker.sock')

    container = client.containers.run(
        image='busybox:latest',
        name='pigeonhole-submission-evaluation-test',

        # Keep the container running for testing
        detach=True,
        tty=True,
        stdin_open=True,

        volumes={
            'submissions': {
                'bind': '/usr/src/submissions/',
                'mode': 'ro'
            }
        }
    )

    client.close()
