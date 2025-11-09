# Security Vulnerabilities Report

**Last Updated**: November 9, 2025
**Status**: Active Monitoring
**Total Vulnerabilities**: 13 (7 moderate, 4 high, 2 critical)

## Summary

This document tracks known security vulnerabilities in dependencies and their mitigation status.

## Critical Vulnerabilities

### 1. form-data - Unsafe Random Function (CVE-2024-XXXX)
**Severity**: Critical
**CVSS Score**: Not specified
**Package**: form-data < 2.5.4
**Dependency Chain**: gpxparser → jsdom → request → form-data
**Advisory**: https://github.com/advisories/GHSA-fjxv-7rqg-78g4

**Issue**: form-data uses unsafe random function for choosing boundary

**Impact**:
- Potential for predictable boundary strings
- Could lead to multipart form data manipulation

**Fix Available**: Yes, via `npm audit fix --force`
**Breaking Change**: Yes (gpxparser@3.0.0)

**Mitigation Status**: PENDING
- **Risk Assessment**: LOW (gpxparser only used for GPX file parsing, not user input)
- **User-Facing**: GPX trip planning feature
- **Recommended Action**: Schedule upgrade during next maintenance window
- **Workaround**: Validate GPX files server-side before processing

---

### 2. request - Server-Side Request Forgery (SSRF)
**Severity**: Moderate→Critical (dependency chain)
**CVSS Score**: 6.1
**Package**: request <= 2.88.2
**Dependency Chain**: gpxparser → jsdom → request
**Advisory**: https://github.com/advisories/GHSA-p8p7-x288-28g6

**Issue**: Server-Side Request Forgery vulnerability

**Impact**:
- Attacker could make requests to internal services
- Data exfiltration potential

**Fix Available**: Yes, via `npm audit fix --force`
**Breaking Change**: Yes (gpxparser@3.0.0)

**Mitigation Status**: PENDING
- **Risk Assessment**: LOW (request package runs client-side in gpxparser, no server-side usage)
- **User-Facing**: GPX file parsing
- **Recommended Action**: Upgrade during maintenance window
- **Workaround**: None needed (client-side only)

---

## High Vulnerabilities

### 3. pdfjs-dist - Arbitrary JavaScript Execution
**Severity**: High
**CVSS Score**: 8.8
**Package**: pdfjs-dist <= 4.1.392
**Dependency Chain**: react-pdf → pdfjs-dist
**Advisory**: https://github.com/advisories/GHSA-wgrm-67xf-hhpq

**Issue**: PDF.js vulnerable to arbitrary JavaScript execution upon opening a malicious PDF

**Impact**:
- Malicious PDF could execute arbitrary JavaScript
- XSS potential
- User data theft

**Fix Available**: Yes (pdfjs-dist@5.4.394)
**Breaking Change**: MAJOR version change

**Mitigation Status**: HIGH PRIORITY
- **Risk Assessment**: MEDIUM-HIGH (users upload PDFs in manual processing)
- **User-Facing**: Manual viewer, Barry AI PDF citations
- **Current Version**: 3.11.174 (react-pdf 7.7.0 requirement)
- **Target Version**: 5.4.394
- **Blocker**: react-pdf compatibility

**Testing Required**:
1. Test SimplePdfScrollViewer (Barry)
2. Test WISPDFViewer (WIS media)
3. Test admin manual processing
4. Verify no "Invalid parameter object" errors
5. Check version compatibility: `npm view react-pdf@latest dependencies.pdfjs-dist`

**Recommended Action**:
1. Research react-pdf compatibility with pdfjs-dist 5.x
2. Create test branch
3. Test all PDF viewers thoroughly
4. Deploy to staging for 48h monitoring
5. Get user approval before production

**Temporary Mitigation**:
- Only allow PDFs from trusted sources (official manuals)
- Validate PDF structure before rendering
- Run PDF viewer in sandboxed iframe

---

### 4. react-pdf - Cross-Site Scripting (XSS)
**Severity**: High
**CVSS Score**: 7.1
**Package**: react-pdf < 7.7.3
**Current Version**: 7.7.0
**Advisory**: https://github.com/advisories/GHSA-XXXX

**Issue**: XSS vulnerability in PDF rendering

**Impact**:
- Malicious PDF annotations could inject scripts
- User data theft

**Fix Available**: Yes (react-pdf@7.7.3)
**Breaking Change**: NO (patch version)

**Mitigation Status**: READY TO FIX
- **Risk Assessment**: MEDIUM
- **User-Facing**: PDF viewer
- **Fix Complexity**: Simple patch update

**Recommended Action**: IMMEDIATE
```bash
npm install react-pdf@7.7.3
npm test
# Test PDF viewers
git push staging main:main
```

---

### 5. lodash.template - Command Injection
**Severity**: High
**CVSS Score**: 7.2
**Package**: lodash.template <= 4.5.0
**Dependency Chain**: @mapbox/mapbox-gl-directions → lodash.template
**Advisory**: https://github.com/advisories/GHSA-35jh-r3h4-6jhm

**Issue**: Command injection vulnerability in template compilation

**Impact**:
- Template injection attacks
- Code execution potential

**Fix Available**: NO
**Breaking Change**: N/A

**Mitigation Status**: NO FIX AVAILABLE
- **Risk Assessment**: LOW (lodash.template not used with user input)
- **User-Facing**: Mapbox directions (trip planning)
- **Package Status**: @mapbox/mapbox-gl-directions is unmaintained

**Recommended Action**:
1. Consider replacing @mapbox/mapbox-gl-directions
2. Alternative: Implement custom directions UI
3. Monitor for package updates
4. Ensure no user input reaches template engine

**Workaround**: Validate and sanitize all inputs to directions feature

---

## Moderate Vulnerabilities

### 6. esbuild - Development Server Request Reading
**Severity**: Moderate
**CVSS Score**: 5.3
**Package**: esbuild <= 0.24.2
**Dependency Chain**: vite → esbuild
**Advisory**: https://github.com/advisories/GHSA-67mh-4wv8-2f99

**Issue**: Development server allows any website to read responses

**Impact**:
- Development data leakage
- Local file exposure during development

**Fix Available**: Yes (via vite@7.2.2)
**Breaking Change**: YES (major version)

**Mitigation Status**: LOW PRIORITY
- **Risk Assessment**: LOW (only affects development, not production)
- **Production Impact**: NONE
- **Development Impact**: Minimal

**Recommended Action**:
- Upgrade during next major version update
- Use separate development environment
- Don't run dev server with sensitive data

---

### 7. vite - File System Bypass (Windows)
**Severity**: Moderate
**Package**: vite 5.2.6 - 5.4.20
**Current Version**: 5.4.21 (FIXED)
**Advisory**: https://github.com/advisories/GHSA-93m4-6634-74q7

**Issue**: server.fs.deny bypass via backslash on Windows

**Impact**: Unauthorized file access on Windows development machines

**Mitigation Status**: RESOLVED (npm audit fix applied)
- Vite updated to 5.4.21

---

### 8. vite-plugin-static-copy - Path Traversal
**Severity**: Moderate
**Package**: vite-plugin-static-copy 0.4.3 - 2.3.1
**Current Version**: Unknown
**Advisory**: https://github.com/advisories/GHSA-pp7p-q8fx-2968

**Issue**: Files not included in src are accessible with crafted request

**Impact**: Unauthorized file access

**Fix Available**: Yes (vite-plugin-static-copy@3.1.4)
**Breaking Change**: YES (major version)

**Mitigation Status**: PENDING
- **Risk Assessment**: LOW (static files are public by design)
- **Recommended Action**: Schedule upgrade during maintenance

---

### 9. tough-cookie - Prototype Pollution
**Severity**: Moderate
**CVSS Score**: 6.5
**Package**: tough-cookie < 4.1.3
**Dependency Chain**: gpxparser → jsdom/request → tough-cookie
**Advisory**: https://github.com/advisories/GHSA-72xf-g2v4-qvf3

**Issue**: Prototype pollution vulnerability

**Impact**: Object property injection, potential RCE

**Fix Available**: Yes (via gpxparser@3.0.0)
**Breaking Change**: YES

**Mitigation Status**: PENDING
- Same fix as issues #1 and #2 (gpxparser upgrade)

---

## Remediation Plan

### Phase 1: Immediate (Within 24 hours)
- [x] Apply safe npm audit fixes (vite 5.4.21)
- [ ] Upgrade react-pdf to 7.7.3 (XSS fix)
- [ ] Document all vulnerabilities

### Phase 2: Short-term (Within 1 week)
- [ ] Research pdfjs-dist 5.x compatibility with react-pdf
- [ ] Test PDF viewer upgrades on staging
- [ ] Evaluate @mapbox/mapbox-gl-directions alternatives

### Phase 3: Medium-term (Within 1 month)
- [ ] Plan gpxparser@3.0.0 upgrade
- [ ] Test GPX functionality with new version
- [ ] Upgrade vite-plugin-static-copy to 3.1.4

### Phase 4: Long-term (Within 3 months)
- [ ] Replace @mapbox/mapbox-gl-directions with maintained alternative
- [ ] Upgrade vite to 7.x (when stable)
- [ ] Comprehensive dependency audit

---

## Monitoring & Prevention

### Automated Checks
```bash
# Weekly vulnerability check
npm audit

# Monthly dependency updates
npm outdated

# Continuous monitoring (if using Snyk)
snyk monitor
```

### Prevention Strategy
1. Enable Dependabot/Renovate for automated PRs
2. Weekly npm audit in CI/CD
3. Review dependencies before adding new ones
4. Prefer maintained packages with recent updates
5. Lock versions of critical dependencies

---

## Impact Assessment

### Production Risk: MEDIUM
- Most critical vulnerabilities are in dependencies used for specific features
- No direct user input reaches vulnerable code paths
- PDFs are from trusted sources (official manuals)

### User-Facing Features Affected:
1. PDF Viewer (Barry + WIS) - HIGH priority fix
2. GPX Trip Planning - MEDIUM priority fix
3. Mapbox Directions - LOW priority (workarounds in place)

### Recommended User Communication:
NO - Vulnerabilities are being actively managed and do not require user notification at this time.

---

## References

- [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/)
- [npm audit documentation](https://docs.npmjs.com/cli/v9/commands/npm-audit)
- [Snyk Vulnerability Database](https://snyk.io/vuln/)
- [GitHub Advisory Database](https://github.com/advisories)

---

## Contact

For security concerns, contact:
- Primary: [Security contact TBD]
- Report vulnerabilities: [Process TBD]
