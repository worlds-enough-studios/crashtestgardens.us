from setuptools import setup

setup(
    name='lektor-typogrify',
    version='0.1',
    author=u'David Eyk',
    author_email='david@worldsenoughstudios.com',
    license='MIT',
    py_modules=['lektor_typogrify'],
    install_requires = [
        'typogrify<2.1',
        'markupsafe',
    ],
    entry_points={
        'lektor.plugins': [
            'typogrify = lektor_typogrify:TypogrifyPlugin',
        ]
    }
)
