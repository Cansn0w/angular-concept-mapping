
/**
 * Check browser version to avoid a SVG displaying bug on Windows
 * https://connect.microsoft.com/IE/feedback/details/801938/dynamically-updated-svg-path-with-a-marker-end-does-not-update
 */
export const ie = (function() {
  // IE 10
  // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

  // IE 11
  // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

  // Edge 12 (Spartan)
  // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

  // Edge 13
  // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

  const ua = window.navigator.userAgent;
  return (ua.indexOf('MSIE ') > 0) || (ua.indexOf('Trident/') > 0);
})();

interface ModifierKey {
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
}

const defaultModifiers = {
  ctrl: false,
  shift: false,
  alt: false,
  meta: false,
};

/**
 * Function used to match keyboard events
 */
export function keyMatch(keyboardEvent, key: string, modifiers: ModifierKey) {
  modifiers = Object.assign(defaultModifiers, modifiers);
  key = key.toUpperCase();
  return (keyboardEvent.key ? keyboardEvent.key.toUpperCase() === key : keyboardEvent.which === key.charCodeAt(0)) &&
  keyboardEvent.ctrlKey === modifiers.ctrl && keyboardEvent.shiftKey === modifiers.shift &&
  keyboardEvent.altKey === modifiers.alt && keyboardEvent.metaKey === modifiers.meta;
}
