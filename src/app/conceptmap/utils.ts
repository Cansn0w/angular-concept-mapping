
/**
 * Modifier keys object
 */
export class ModifierKey {

  static ctrl = new ModifierKey(event => event.ctrlKey);
  static shift = new ModifierKey(event => event.shift);
  static alt = new ModifierKey(event => event.altKey);
  static meta = new ModifierKey(event => event.metaKey);

  private predicate: (event: any) => boolean;

  constructor(predicate: (event: any) => boolean) {
    this.predicate = predicate;
  }

  match(keyboardEvent: any): boolean {
    return this.predicate(keyboardEvent);
  }

  notMatch(keyboardEvent: any): boolean {
    return !this.predicate(keyboardEvent);
  }
}

/**
 * Object used to match keyboard events
 * Will match keyboard events that have exactly same set of modifier keys.
 */
export class KeyCombination {

  static modifierKey = ModifierKey;

  key: string;
  modifiers: ModifierKey[];
  excludes: ModifierKey[] = [ModifierKey.ctrl, ModifierKey.shift, ModifierKey.alt, ModifierKey.meta];

  constructor(key: string, modifiers: ModifierKey[]) {
    this.key = key.toUpperCase();
    this.modifiers = modifiers;
    this.excludes = this.excludes.filter(m => !modifiers.includes(m));
  }

  match(keyboardEvent): boolean {
    return (keyboardEvent.key ? keyboardEvent.key.toUpperCase() === this.key : keyboardEvent.which === this.key.charCodeAt(0)) &&
    this.modifiers.every(m => m.match(keyboardEvent)) && this.excludes.every(m => m.notMatch(keyboardEvent));
  }
}
