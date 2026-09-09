import { AuditResult, Suggestion, SuggestionSeverity } from './types';

type Rule = (data: AuditResult) => Suggestion | null;

const SEVERITY_ORDER: Record<SuggestionSeverity, number> = {
  critical: 0,
  warning: 1,
  info: 2,
};

const ALL_CLEAR: Suggestion = {
  id: 'all-clear',
  severity: 'info',
  title: 'Great job! No major issues found.',
  problem: 'Your site passes all basic checks.',
  fix: 'Keep monitoring regularly. Performance can degrade as you add features.',
};

const rules: Rule[] = [
  (data) =>
    !data.seo.title
      ? {
          id: 'seo-title-missing',
          severity: 'critical',
          title: 'Missing page title',
          problem:
            'Your page has no `<title>` tag. Google and browsers don\'t know what to call this page.',
          fix: 'Add a `<title>` inside `<head>`. Keep it under 60 characters and include your main keyword.',
          codeExample: '<title>Your Brand — What You Do</title>',
        }
      : null,

  (data) =>
    data.seo.title && data.seo.title.length > 60
      ? {
          id: 'seo-title-long',
          severity: 'warning',
          title: 'Title tag is too long',
          problem: `Your title is ${data.seo.title!.length} characters. Google cuts off titles after ~60 characters.`,
          fix: 'Shorten your title to 50–60 characters while keeping it descriptive.',
        }
      : null,

  (data) =>
    !data.seo.metaDescription
      ? {
          id: 'seo-meta-missing',
          severity: 'critical',
          title: 'Missing meta description',
          problem:
            'No meta description means Google picks random text from your page to show in search results.',
          fix: 'Add a `<meta name="description">` with a compelling 150–160 character summary.',
          codeExample:
            '<meta name="description" content="A short, compelling summary of what this page offers.">',
        }
      : null,

  (data) =>
    data.seo.h1Count === 0
      ? {
          id: 'seo-h1-missing',
          severity: 'critical',
          title: 'No H1 heading found',
          problem:
            'An H1 is the main headline of your page. Without it, Google struggles to understand your page topic.',
          fix: 'Add exactly one `<h1>` near the top of your page. It should describe the page clearly.',
          codeExample: '<h1>Billing Software for Small Businesses</h1>',
        }
      : null,

  (data) =>
    data.seo.h1Count > 1
      ? {
          id: 'seo-h1-multiple',
          severity: 'warning',
          title: 'Multiple H1 tags detected',
          problem: `You have ${data.seo.h1Count} H1 tags. There should only be one per page.`,
          fix: 'Change extra H1s to `<h2>` or `<h3>`. Keep only one H1 as the main page topic.',
        }
      : null,

  (data) =>
    !data.seo.hasViewport
      ? {
          id: 'seo-viewport-missing',
          severity: 'critical',
          title: 'Not mobile-friendly',
          problem: 'Missing viewport meta tag. Your site looks zoomed-out and tiny on phones.',
          fix: 'Add this single line to your `<head>`:',
          codeExample: '<meta name="viewport" content="width=device-width, initial-scale=1">',
        }
      : null,

  (data) =>
    !data.https
      ? {
          id: 'sec-no-https',
          severity: 'critical',
          title: 'Site is not secure (no HTTPS)',
          problem: 'Users see a \'Not Secure\' warning. Google ranks HTTPS sites higher.',
          fix: 'Install an SSL certificate. Most hosts provide this free.',
        }
      : null,

  (data) => {
    const score = data.pagespeed.mobile.performance;
    return score < 50
      ? {
          id: 'perf-poor',
          severity: 'critical',
          title: 'Performance is very poor on mobile',
          problem: `Your mobile performance score is ${score}/100. Users on slow connections will leave before the page loads.`,
          fix: 'Compress images (use WebP), remove unused JavaScript, and enable lazy loading.',
        }
      : null;
  },

  (data) => {
    const score = data.pagespeed.mobile.performance;
    return score >= 50 && score < 90
      ? {
          id: 'perf-moderate',
          severity: 'warning',
          title: 'Performance can be improved',
          problem: `Score is ${score}/100. There's room to make your site faster.`,
          fix: 'Use next-gen image formats, defer non-critical scripts, and use a CDN.',
        }
      : null;
  },

  (data) => {
    const score = data.pagespeed.mobile.accessibility;
    return score < 90
      ? {
          id: 'a11y-low',
          severity: 'warning',
          title: 'Accessibility needs work',
          problem: `Score: ${score}/100. Users with screen readers may struggle.`,
          fix: 'Add alt text to all images, ensure color contrast meets WCAG standards.',
        }
      : null;
  },

  (data) => {
    const score = data.pagespeed.mobile.bestPractices;
    return score < 90
      ? {
          id: 'bp-low',
          severity: 'info',
          title: 'Best practices below optimal',
          problem: `Score: ${score}/100. Usually means outdated libraries or console errors.`,
          fix: 'Update npm packages, fix console errors, ensure external resources load over HTTPS.',
        }
      : null;
  },
];

export function generateSuggestions(data: AuditResult): Suggestion[] {
  const matched = rules
    .map((rule) => rule(data))
    .filter((s): s is Suggestion => s !== null);

  if (matched.length === 0) {
    return [ALL_CLEAR];
  }

  return matched.sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
  );
}
