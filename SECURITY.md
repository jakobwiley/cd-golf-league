# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability within the Country Drive Golf League application, please follow these steps:

1. **Do NOT disclose the vulnerability publicly** until it has been addressed by the maintainers.
2. Email the vulnerability details to [jake.mullins@sureapp.com](mailto:jake.mullins@sureapp.com).
3. Include as much information as possible, such as:
   - A description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact
   - Suggestions for remediation if you have any

## Response Process

When a security vulnerability is reported:

1. The maintainers will acknowledge receipt of the vulnerability report within 48 hours.
2. The team will investigate and validate the reported vulnerability.
3. The team will develop and test a fix for the vulnerability.
4. Once a fix is ready, it will be deployed to production as soon as possible.
5. After the vulnerability has been addressed, the reporter will be credited (if desired) for responsibly disclosing the issue.

## Best Practices for Contributors

When contributing to this project, please follow these security best practices:

1. **Never commit secrets or credentials** to the repository.
2. Use environment variables for all sensitive information.
3. Follow the principle of least privilege when implementing new features.
4. Validate all user inputs to prevent injection attacks.
5. Use parameterized queries when interacting with the database.
6. Keep dependencies updated to avoid known vulnerabilities.
7. Run `npm run secrets:scan` before committing changes to ensure no secrets are accidentally committed.

## Security Updates

Security updates will be applied promptly. We use automated tools to monitor for vulnerabilities in our dependencies and will update them as soon as patches are available.

## Responsible Disclosure

We are committed to working with security researchers and the community to maintain the security of our application. We appreciate your efforts in responsibly disclosing your findings and will make every effort to acknowledge your contributions.
