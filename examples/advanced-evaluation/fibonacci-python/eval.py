import sys
from importlib.util import spec_from_file_location, module_from_spec
from typing import List


def check_fibonacci(sequence: List) -> bool:
    if len(sequence) == 0:
        return sequence == []
    elif len(sequence) == 1:
        return sequence == [0]
    elif len(sequence) == 2:
        return sequence == [0, 1]

    for i in range(2, len(sequence)):
        if sequence[i] != sequence[i - 1] + sequence[i - 2]:
            return False

    return True


def write_sequences_to_file(fibonacci_method, limit: int = 25) -> None:
    for i in range(1, limit):
        sequence = fibonacci_method(i)
        with open(f'/usr/out/artifacts/fibonacci_{i}.txt', 'w') as outfile:
            for n in sequence:
                outfile.write(f'{n}\n')


if __name__ == '__main__':
    try:
        spec = spec_from_file_location(
            name='fibonacci',
            location='/usr/src/submission/main.py',
        )
        fibonacci = module_from_spec(spec)
        spec.loader.exec_module(fibonacci)

        write_sequences_to_file(fibonacci.fibonacci)

        assert check_fibonacci(fibonacci.fibonacci(0)), 'Fibonacci sequence with length 0 incorrect'
        assert check_fibonacci(fibonacci.fibonacci(1)), 'Fibonacci sequence with length 1 incorrect'
        assert check_fibonacci(fibonacci.fibonacci(2)), 'Fibonacci sequence with length 2 incorrect'
        assert check_fibonacci(fibonacci.fibonacci(1000)), 'Fibonacci sequence with length 1000 incorrect'

    except FileNotFoundError:
        sys.exit("Required main file missing.\nPlease consult the project assignment.")

    except ImportError or AttributeError or ModuleNotFoundError as e:
        sys.exit(f"Required method missing or wrongly defined.\nPlease consult the project assignment.\n{e}")

    except AssertionError as e:
        sys.exit(f"Output assertion failed: {e}")

    print("Fibonacci script assertions succeeded, exiting...")

    exit(0)
