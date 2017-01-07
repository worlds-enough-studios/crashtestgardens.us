from setuptools import setup

setup(
    name='lektor-remove-editorial-instructions',
    version='0.1',
    author=u'David Eyk',
    author_email='david@wordsenoughstudios.com',
    license='MIT',
    py_modules=['lektor_remove_editorial_instructions'],
    entry_points={
        'lektor.plugins': [
            'remove-editorial-instructions = lektor_remove_editorial_instructions:RemoveEditorialInstructionsPlugin',
        ]
    }
)
