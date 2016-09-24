from paver.easy import task, sh


@task
def clean():
    sh('lektor clean --yes')


@task
def deploy():
    sh('lektor build')
    results = sh(
        (
            'aws --profile worlds'
            '  s3 sync'
            '  --delete'
            '  --acl public-read'
            "  --exclude='*.sublime*'"
            "  --exclude='.*'"
            "  --exclude='_*'"
            '  "$(lektor project-info --output-path)"/ "s3://crashtestgardens.us/"'
        ),
        capture=True,
    )
    to_invalidate = [
        line.rsplit('s3://crashtestgardens.us', 1)[-1]
        for line in results.splitlines()
        if 's3://' in line
    ]
    if to_invalidate:
        sh(
            (
                'aws --profile worlds'
                '  cloudfront create-invalidation'
                '  --distribution-id E2CMYWU04HTJN6'
                '  --paths %s'
            ) % ' '.join(to_invalidate)
        )
