/**
 * This file is a copy of the postcss-parent-selector plugin. It allows you to scope the app/CSS so everything has a prefix. Helps when embedding the app in other websites where the CSS/code might interefere.
 */
module.exports = (opts = {}) => {
    opts = opts || {};
    const parentSelector = opts.selector || '';
    const ignoredSelectors = opts.ignoredSelectors || [];
    const replaceRoot = opts.replaceRootWithSelector || false;

    function isNonRelevantRule(rule) {
        return rule.parent && rule.parent.type === 'atrule' &&
            rule.parent.name.indexOf('keyframes') !== -1;
    }

    function isIgnoredSelector(selector) {
        return ignoredSelectors.some(ignored => {
            if (typeof ignored === 'string') {
                return selector.includes(ignored);
            } else if (ignored instanceof RegExp) {
                return ignored.test(selector);
            }
            return false;
        });
    }

    function replaceRootSelector(selector) {
        // replace :root and html and body with parent selector
        return selector.replace(/:root|html|body/g, parentSelector);
    }

    function processRule(rule) {
        if (isNonRelevantRule(rule)) {
            return;
        }

        rule.selectors = rule.selectors.map(complexSelector => {
            return complexSelector.split(',').map(selector => {
                selector = selector.trim();
                if (replaceRoot) {
                    selector = replaceRootSelector(selector);
                }
                if (isIgnoredSelector(selector) || selector.startsWith(parentSelector)) {
                    return selector;
                }
                return `${parentSelector} ${selector}`;
            }).join(', ');
        });
    }

    return {
        postcssPlugin: 'postcss-parent-selector',
        Once(root) {
            root.walkRules(processRule);
        }
    };
};

module.exports.postcss = true;
